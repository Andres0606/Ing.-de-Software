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
      const rows = await query(
        'SELECT p.*, e.usuario_id FROM productos p LEFT JOIN emprendedores e ON p.emprendedor_id = e.id LIMIT ? OFFSET ?',
        [limit, offset]
      );
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const rows = await query('SELECT * FROM productos WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async listByEmprendedor(req, res) {
    try {
      const emprendedorId = parseInt(req.params.emprendedorId, 10);
      const rows = await query('SELECT * FROM productos WHERE emprendedor_id = ?', [emprendedorId]);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { emprendedor_id, nombre, descripcion, categoria, precio, calificacion, vendidos, imagen } = req.body || {};
      if (!emprendedor_id || !nombre || precio == null) return res.status(400).json({ ok: false, error: 'emprendedor_id, nombre y precio son requeridos' });
      const result = await query(
        'INSERT INTO productos (emprendedor_id, nombre, descripcion, categoria, precio, calificacion, vendidos, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [emprendedor_id, nombre, descripcion || null, categoria || null, precio, calificacion || 0, vendidos || 0, imagen || null]
      );
      const rows = await query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
      res.status(201).json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { nombre, descripcion, categoria, precio, calificacion, vendidos, imagen } = req.body || {};
      const existing = await query('SELECT id FROM productos WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
      await query(
        'UPDATE productos SET nombre = COALESCE(?, nombre), descripcion = COALESCE(?, descripcion), categoria = COALESCE(?, categoria), precio = COALESCE(?, precio), calificacion = COALESCE(?, calificacion), vendidos = COALESCE(?, vendidos), imagen = COALESCE(?, imagen) WHERE id = ?',
        [nombre, descripcion, categoria, precio, calificacion, vendidos, imagen, id]
      );
      const rows = await query('SELECT * FROM productos WHERE id = ?', [id]);
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const existing = await query('SELECT id FROM productos WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
      await query('DELETE FROM productos WHERE id = ?', [id]);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};
