const { supabase } = require('../db/mysql');

function parsePagination(req) {
  const limit = Math.min(parseInt(req.query.limit || '50', 10), 100);
  const offset = parseInt(req.query.offset || '0', 10);
  return { limit, offset };
}

module.exports = {
  async list(req, res) {
    try {
      const { limit, offset } = parsePagination(req);
      
      const { data, error } = await supabase
        .from('contactos')
        .select('*')
        .order('fecha', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json({ ok: true, data: data || [] });
    } catch (err) {
      console.error('Error listando contactos:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { nombre, email, telefono, asunto, mensaje } = req.body || {};

      const { data, error } = await supabase
        .from('contactos')
        .insert([{
          nombre: nombre || null,
          email: email || null,
          telefono: telefono || null,
          asunto: asunto || null,
          mensaje: mensaje || null
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ ok: true, data });
    } catch (err) {
      console.error('Error creando contacto:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};