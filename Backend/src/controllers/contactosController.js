const { query } = require('../db/mysql');

function parsePagination(req) {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const offset = parseInt(req.query.offset || '0', 10);
  return { limit, offset };
}

module.exports = {
  async list(req, res) {
    try {
      const { limit, offset } = parsePagination(req);
      const rows = await query('SELECT * FROM contactos ORDER BY fecha DESC LIMIT ? OFFSET ?', [limit, offset]);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { nombre, email, telefono, asunto, mensaje } = req.body || {};
      const result = await query(
        'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
        [nombre || null, email || null, telefono || null, asunto || null, mensaje || null]
      );
      const rows = await query('SELECT * FROM contactos WHERE id = ?', [result.insertId]);
      res.status(201).json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};
