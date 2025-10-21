const { query } = require('../db/mysql');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendMail } = require('../utils/mailer');

// memoria simple para tokens si no hay tabla (reinicio los borra)
const resetTokens = new Map(); // token -> { userId, email, exp }

function parsePagination(req) {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const offset = parseInt(req.query.offset || '0', 10);
  return { limit, offset };
}

module.exports = {
  async login(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ ok: false, error: 'email y password son requeridos' });
      }
      const emailNorm = String(email).trim().toLowerCase();
      const rows = await query('SELECT id, nombre, email, password, tipo_usuario, fecha_registro FROM usuarios WHERE LOWER(email) = LOWER(?) LIMIT 1', [emailNorm]);
      if (rows.length === 0) {
        return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
      }
      const user = rows[0];
      // Intentar bcrypt; si el hash no corresponde a formato bcrypt, caer a texto plano
      let match = false;
      const pwd = String(user.password || '');
      if (pwd.startsWith('$2a$') || pwd.startsWith('$2b$') || pwd.startsWith('$2y$')) {
        match = await bcrypt.compare(String(password), pwd);
      } else {
        match = String(password) === pwd;
      }
      if (!match) {
        return res.status(401).json({ ok: false, error: 'Credenciales inválidas' });
      }
      const { password: _omit, ...safeUser } = user; // no exponer password
      return res.json({ ok: true, data: safeUser });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  },
  async list(req, res) {
    try {
      const { limit, offset } = parsePagination(req);
      const rows = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios LIMIT ? OFFSET ?', [limit, offset]);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const rows = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { nombre, email, password, tipo_usuario } = req.body || {};
      if (!nombre || !email || !password) return res.status(400).json({ ok: false, error: 'nombre, email y password son requeridos' });
      const emailNorm = String(email).trim().toLowerCase();
      // Hash seguro de contraseña
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(String(password), salt);
      const result = await query('INSERT INTO usuarios (nombre, email, password, tipo_usuario) VALUES (?, ?, ?, ?)', [nombre, emailNorm, hash, tipo_usuario || null]);
      const rows = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios WHERE id = ?', [result.insertId]);
      res.status(201).json({ ok: true, data: rows[0] });
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ ok: false, error: 'El email ya existe' });
      }
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { nombre, email, tipo_usuario, telefono, password } = req.body || {};
      if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'id inválido' });

      if (password) return res.status(400).json({ ok: false, error: 'La contraseña no se puede actualizar aquí. Usa el flujo de restablecimiento.' });

      const existing = await query('SELECT id FROM usuarios WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

      // Verificar email duplicado si viene
      if (email) {
        const dup = await query('SELECT id FROM usuarios WHERE LOWER(email)=LOWER(?) AND id <> ? LIMIT 1', [email, id]);
        if (dup.length > 0) return res.status(409).json({ ok: false, error: 'El email ya existe' });
      }

      // Construir SET dinámico
      const setParts = [];
      const params = [];
      if (typeof nombre !== 'undefined') { setParts.push('nombre = ?'); params.push(nombre); }
      if (typeof email !== 'undefined') { setParts.push('email = ?'); params.push(email); }
      if (typeof tipo_usuario !== 'undefined') { setParts.push('tipo_usuario = ?'); params.push(tipo_usuario); }

      // telefono es opcional: solo si existe la columna
      if (typeof telefono !== 'undefined') {
        try {
          const cols = await query("SHOW COLUMNS FROM usuarios LIKE 'telefono'");
          if (cols.length > 0) { setParts.push('telefono = ?'); params.push(telefono); }
        } catch (_) {
          // ignorar si falla el SHOW COLUMNS
        }
      }

      if (setParts.length === 0) {
        return res.status(400).json({ ok: false, error: 'Nada para actualizar' });
      }

      params.push(id);
      await query(`UPDATE usuarios SET ${setParts.join(', ')} WHERE id = ?`, params);
      const rows = await query('SELECT id, nombre, email, tipo_usuario, fecha_registro FROM usuarios WHERE id = ?', [id]);
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ ok: false, error: 'El email ya existe' });
      }
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const existing = await query('SELECT id FROM usuarios WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      await query('DELETE FROM usuarios WHERE id = ?', [id]);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async passwordReset(req, res) {
    try {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ ok: false, error: 'email es requerido' });
      // Buscar usuario (opcional, pero útil para enlazar token a id); sin revelar existencia
      const rows = await query('SELECT id, email, nombre FROM usuarios WHERE LOWER(email)=LOWER(?) LIMIT 1', [String(email).trim().toLowerCase()]);
      const user = rows[0];
      const token = crypto.randomBytes(32).toString('hex');
      const expMs = Date.now() + 1000 * 60 * 60; // 1 hora
      if (user) {
        resetTokens.set(token, { userId: user.id, email: user.email, exp: expMs });
      } else {
        resetTokens.set(token, { userId: null, email: String(email), exp: expMs });
      }
      const frontendBase = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
      const link = `${frontendBase}/reset-password?token=${token}`;
      const subj = 'Restablecer contraseña';
      const body = `Hola,
Solicitaste restablecer tu contraseña. Usa el siguiente enlace:
${link}
Este enlace expira en 1 hora.`;
      await sendMail({ to: email, subject: subj, text: body });
      return res.json({ ok: true, message: 'Si el correo existe, se enviará un enlace de restablecimiento.' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  },
  async passwordResetConfirm(req, res) {
    try {
      const { token, newPassword } = req.body || {};
      if (!token || !newPassword) return res.status(400).json({ ok: false, error: 'token y newPassword son requeridos' });
      const rec = resetTokens.get(String(token));
      if (!rec || rec.exp < Date.now()) return res.status(400).json({ ok: false, error: 'Token inválido o expirado' });
      // Obtener usuario por email si no tenemos id
      let userId = rec.userId;
      if (!userId) {
        const rows = await query('SELECT id FROM usuarios WHERE LOWER(email)=LOWER(?) LIMIT 1', [rec.email.toLowerCase()]);
        if (rows.length === 0) return res.status(400).json({ ok: false, error: 'Token inválido' });
        userId = rows[0].id;
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(String(newPassword), salt);
      await query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, userId]);
      resetTokens.delete(String(token));
      return res.json({ ok: true, message: 'Contraseña actualizada' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  },
  async changePassword(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { currentPassword, newPassword } = req.body || {};
      if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'id inválido' });
      if (!currentPassword || !newPassword) return res.status(400).json({ ok: false, error: 'currentPassword y newPassword son requeridos' });

      const rows = await query('SELECT id, password FROM usuarios WHERE id = ? LIMIT 1', [id]);
      if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      const user = rows[0];

      // Validar contraseña actual (bcrypt o texto plano)
      const stored = String(user.password || '');
      let match = false;
      if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
        match = await bcrypt.compare(String(currentPassword), stored);
      } else {
        match = String(currentPassword) === stored;
      }
      if (!match) return res.status(401).json({ ok: false, error: 'Contraseña actual incorrecta' });

      // Reglas básicas
      if (String(newPassword).length < 6) return res.status(400).json({ ok: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' });
      if (String(newPassword) === String(currentPassword)) return res.status(400).json({ ok: false, error: 'La nueva contraseña no puede ser igual a la actual' });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(String(newPassword), salt);
      await query('UPDATE usuarios SET password = ? WHERE id = ?', [hash, id]);
      return res.json({ ok: true, message: 'Contraseña actualizada' });
    } catch (err) {
      return res.status(500).json({ ok: false, error: err.message });
    }
  },
};
