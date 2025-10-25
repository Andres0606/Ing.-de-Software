require('dotenv').config();

module.exports = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_cambiar_en_produccion',

  // Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY
  },

  // OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
  },

  microsoft: {
    tenant: process.env.MICROSOFT_TENANT || 'common',
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/api/auth/microsoft/callback'
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  // Frontend
  frontendBaseUrl: process.env.FRONTEND_BASE_URL || 'http://localhost:5173',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};