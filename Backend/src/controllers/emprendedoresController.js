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
    const sql = `
      SELECT e.*, u.nombre AS usuario_nombre, u.email AS usuario_email
      FROM emprendedores e
      LEFT JOIN usuarios u ON e.usuario_id = u.id
      LIMIT ${limit} OFFSET ${offset}
    `;
    const rows = await query(sql);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
},
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const rows = await query(
        'SELECT e.*, u.nombre AS usuario_nombre, u.email AS usuario_email FROM emprendedores e LEFT JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?',
        [id]
      );
      if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Emprendedor no encontrado' });
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async listByUsuario(req, res) {
    try {
      const usuarioId = parseInt(req.params.usuarioId, 10);
      const rows = await query('SELECT * FROM emprendedores WHERE usuario_id = ?', [usuarioId]);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { usuario_id, descripcion, ubicacion, categoria, calificacion, imagen } = req.body || {};
      if (!usuario_id) return res.status(400).json({ ok: false, error: 'usuario_id es requerido' });
      const result = await query(
        'INSERT INTO emprendedores (usuario_id, descripcion, ubicacion, categoria, calificacion, imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, descripcion || null, ubicacion || null, categoria || null, calificacion || 0, imagen || null]
      );
      const rows = await query('SELECT * FROM emprendedores WHERE id = ?', [result.insertId]);
      res.status(201).json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { descripcion, ubicacion, categoria, calificacion, imagen } = req.body || {};
      const existing = await query('SELECT id FROM emprendedores WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Emprendedor no encontrado' });
      await query(
        'UPDATE emprendedores SET descripcion = COALESCE(?, descripcion), ubicacion = COALESCE(?, ubicacion), categoria = COALESCE(?, categoria), calificacion = COALESCE(?, calificacion), imagen = COALESCE(?, imagen) WHERE id = ?',
        [descripcion, ubicacion, categoria, calificacion, imagen, id]
      );
      const rows = await query('SELECT * FROM emprendedores WHERE id = ?', [id]);
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const existing = await query('SELECT id FROM emprendedores WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Emprendedor no encontrado' });
      await query('DELETE FROM emprendedores WHERE id = ?', [id]);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};
