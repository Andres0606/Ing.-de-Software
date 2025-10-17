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
      const rows = await query('SELECT * FROM eventos ORDER BY fecha DESC LIMIT ? OFFSET ?', [limit, offset]);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const rows = await query('SELECT * FROM eventos WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Evento no encontrado' });
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado } = req.body || {};
      if (!titulo || !fecha) return res.status(400).json({ ok: false, error: 'titulo y fecha son requeridos' });
      const result = await query(
        'INSERT INTO eventos (titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descripcion || null, fecha, hora_inicio || null, hora_fin || null, lugar || null, categoria || null, imagen || null, destacado ? 1 : 0]
      );
      const rows = await query('SELECT * FROM eventos WHERE id = ?', [result.insertId]);
      res.status(201).json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado } = req.body || {};
      const existing = await query('SELECT id FROM eventos WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Evento no encontrado' });
      await query(
        'UPDATE eventos SET titulo = COALESCE(?, titulo), descripcion = COALESCE(?, descripcion), fecha = COALESCE(?, fecha), hora_inicio = COALESCE(?, hora_inicio), hora_fin = COALESCE(?, hora_fin), lugar = COALESCE(?, lugar), categoria = COALESCE(?, categoria), imagen = COALESCE(?, imagen), destacado = COALESCE(?, destacado) WHERE id = ?',
        [titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado != null ? (destacado ? 1 : 0) : null, id]
      );
      const rows = await query('SELECT * FROM eventos WHERE id = ?', [id]);
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const existing = await query('SELECT id FROM eventos WHERE id = ?', [id]);
      if (existing.length === 0) return res.status(404).json({ ok: false, error: 'Evento no encontrado' });
      await query('DELETE FROM eventos WHERE id = ?', [id]);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async registrarAsistencia(req, res) {
    try {
      const id = parseInt(req.params.id, 10); // evento id
      const { usuario_id } = req.body || {};
      if (!usuario_id) return res.status(400).json({ ok: false, error: 'usuario_id es requerido' });
      await query('INSERT INTO registro_eventos (usuario_id, evento_id) VALUES (?, ?)', [usuario_id, id]);
      res.status(201).json({ ok: true });
    } catch (err) {
      if (err && err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ ok: false, error: 'El usuario ya está registrado en este evento' });
      }
      res.status(500).json({ ok: false, error: err.message });
    }
  },
  async asistentes(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const rows = await query(
        'SELECT re.id, re.fecha_registro, u.id as usuario_id, u.nombre, u.email FROM registro_eventos re INNER JOIN usuarios u ON re.usuario_id = u.id WHERE re.evento_id = ?',
        [id]
      );
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};
