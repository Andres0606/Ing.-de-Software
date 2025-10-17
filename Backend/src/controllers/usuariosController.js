const { query } = require('../db/mysql');

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
      // Nota: actualmente la contraseña se compara en texto plano según la BD existente
      // Para producción se recomienda usar hashing (bcrypt) y tokens (JWT)
      const match = String(password) === String(user.password);
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
      const result = await query('INSERT INTO usuarios (nombre, email, password, tipo_usuario) VALUES (?, ?, ?, ?)', [nombre, email, password, tipo_usuario || null]);
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
      const { nombre, email, password, tipo_usuario } = req.body || {};
      const existing = await query('SELECT id FROM usuarios WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });
      await query('UPDATE usuarios SET nombre = COALESCE(?, nombre), email = COALESCE(?, email), password = COALESCE(?, password), tipo_usuario = COALESCE(?, tipo_usuario) WHERE id = ?', [nombre, email, password, tipo_usuario, id]);
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
};
