const express = require('express');
const { query } = require('../db/mysql');
const router = express.Router();

// Helper to use fetch in Node 16/18+ or fallback to node-fetch
async function httpFetch(input, init) {
  if (typeof fetch === 'function') {
    return fetch(input, init);
  }
  const mod = await import('node-fetch');
  return mod.default(input, init);
}

function getBackendBaseUrl(req) {
  const envBase = process.env.BACKEND_PUBLIC_BASE_URL || process.env.API_BASE_URL;
  if (envBase) return envBase.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function getFrontendBaseUrl() {
  return (process.env.FRONTEND_BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
}

async function findOrCreateUser({ nombre, email, provider }) {
  if (!email) return null; // require email
  const rows = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios WHERE LOWER(email)=LOWER(?) LIMIT 1', [String(email).toLowerCase()]);
  if (rows.length > 0) return rows[0];
  // Create a placeholder password to prevent password login with unknown value
  const randomPwd = `oauth:${provider}:${Math.random().toString(36).slice(2, 10)}`;
  const result = await query('INSERT INTO usuarios (nombre, email, password, tipo_usuario) VALUES (?, ?, ?, ?)', [nombre || email.split('@')[0], email, randomPwd, null]);
  const created = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios WHERE id = ?', [result.insertId]);
  return created[0];
}

// ------ Google OAuth ------
router.get('/google/start', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).send('OAuth Google no configurado');
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendBaseUrl(req)}/api/auth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent('login');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=online&prompt=select_account&state=${state}`;
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) throw new Error('Código no proporcionado');
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${getBackendBaseUrl(req)}/api/auth/google/callback`;
    if (!clientId || !clientSecret) throw new Error('OAuth Google no configurado');

    const tokenRes = await httpFetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokenJson.error_description || tokenJson.error || 'Error de token de Google');
    const accessToken = tokenJson.access_token;

    const userRes = await httpFetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await userRes.json();
    if (!userRes.ok) throw new Error(profile.error_description || profile.error || 'Error obteniendo usuario de Google');

    const email = profile.email;
    const nombre = profile.name || profile.given_name || email;
    const user = await findOrCreateUser({ nombre, email, provider: 'google' });
    if (!user) throw new Error('No se pudo crear/obtener el usuario');

    const payload = Buffer.from(JSON.stringify(user)).toString('base64url');
    const frontend = getFrontendBaseUrl();
    return res.redirect(`${frontend}/auth/callback?u=${payload}`);
  } catch (err) {
    const frontend = getFrontendBaseUrl();
    return res.redirect(`${frontend}/auth/callback?error=${encodeURIComponent(err.message || 'Error de autenticación')}`);
  }
});

// ------ Microsoft OAuth ------
router.get('/microsoft/start', (req, res) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  if (!clientId) return res.status(500).send('OAuth Microsoft no configurado');
  const tenant = process.env.MICROSOFT_TENANT || 'common';
  const redirectUri = process.env.MICROSOFT_REDIRECT_URI || `${getBackendBaseUrl(req)}/api/auth/microsoft/callback`;
  const scope = encodeURIComponent('openid profile https://graph.microsoft.com/User.Read');
  const state = encodeURIComponent('login');
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${encodeURIComponent(clientId)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scope}&state=${state}`;
  res.redirect(url);
});

router.get('/microsoft/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) throw new Error('Código no proporcionado');
    const tenant = process.env.MICROSOFT_TENANT || 'common';
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const redirectUri = process.env.MICROSOFT_REDIRECT_URI || `${getBackendBaseUrl(req)}/api/auth/microsoft/callback`;
    if (!clientId || !clientSecret) throw new Error('OAuth Microsoft no configurado');

    const tokenRes = await httpFetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: redirectUri,
      }),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) throw new Error(tokenJson.error_description || tokenJson.error || 'Error de token de Microsoft');
    const accessToken = tokenJson.access_token;

    // Prefer OIDC userinfo
    let email, name;
    try {
      const infoRes = await httpFetch('https://graph.microsoft.com/oidc/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (infoRes.ok) {
        const info = await infoRes.json();
        email = info.email || info.preferred_username || info.upn;
        name = info.name || info.given_name;
      }
    } catch (_) {}
    if (!email) {
      // Fallback Graph /me
      const meRes = await httpFetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const me = await meRes.json();
      if (!meRes.ok) throw new Error(me.error?.message || 'Error obteniendo usuario de Microsoft');
      email = me.mail || me.userPrincipalName;
      name = me.displayName || email;
    }

    const user = await findOrCreateUser({ nombre: name, email, provider: 'microsoft' });
    if (!user) throw new Error('No se pudo crear/obtener el usuario');

    const payload = Buffer.from(JSON.stringify(user)).toString('base64url');
    const frontend = getFrontendBaseUrl();
    return res.redirect(`${frontend}/auth/callback?u=${payload}`);
  } catch (err) {
    const frontend = getFrontendBaseUrl();
    return res.redirect(`${frontend}/auth/callback?error=${encodeURIComponent(err.message || 'Error de autenticación')}`);
  }
});

module.exports = router;

// Diagnostic endpoint (do not expose secrets)
router.get('/status', (req, res) => {
  const backendBase = getBackendBaseUrl(req);
  res.json({
    frontendBaseUrl: getFrontendBaseUrl(),
    google: {
      configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      redirectUri: (process.env.GOOGLE_REDIRECT_URI || `${backendBase}/api/auth/google/callback`),
      clientIdPresent: Boolean(process.env.GOOGLE_CLIENT_ID),
      clientSecretPresent: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    },
    microsoft: {
      configured: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
      tenant: process.env.MICROSOFT_TENANT || 'common',
      redirectUri: (process.env.MICROSOFT_REDIRECT_URI || `${backendBase}/api/auth/microsoft/callback`),
      clientIdPresent: Boolean(process.env.MICROSOFT_CLIENT_ID),
      clientSecretPresent: Boolean(process.env.MICROSOFT_CLIENT_SECRET),
    },
  });
});
