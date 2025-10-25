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
        .from('eventos')
        .select('*')
        .order('fecha', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json({ ok: true, data: data || [] });
    } catch (err) {
      console.error('Error listando eventos:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ ok: false, error: 'Evento no encontrado' });

      res.json({ ok: true, data });
    } catch (err) {
      console.error('Error obteniendo evento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado } = req.body || {};
      
      if (!titulo || !fecha) {
        return res.status(400).json({ ok: false, error: 'titulo y fecha son requeridos' });
      }

      const { data, error } = await supabase
        .from('eventos')
        .insert([{
          titulo,
          descripcion: descripcion || null,
          fecha,
          hora_inicio: hora_inicio || null,
          hora_fin: hora_fin || null,
          lugar: lugar || null,
          categoria: categoria || null,
          imagen: imagen || null,
          destacado: destacado || false
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ ok: true, data });
    } catch (err) {
      console.error('Error creando evento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { titulo, descripcion, fecha, hora_inicio, hora_fin, lugar, categoria, imagen, destacado } = req.body || {};

      const { data: existing } = await supabase
        .from('eventos')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Evento no encontrado' });
      }

      const updateData = {};
      if (titulo !== undefined) updateData.titulo = titulo;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (fecha !== undefined) updateData.fecha = fecha;
      if (hora_inicio !== undefined) updateData.hora_inicio = hora_inicio;
      if (hora_fin !== undefined) updateData.hora_fin = hora_fin;
      if (lugar !== undefined) updateData.lugar = lugar;
      if (categoria !== undefined) updateData.categoria = categoria;
      if (imagen !== undefined) updateData.imagen = imagen;
      if (destacado !== undefined) updateData.destacado = destacado;

      const { data, error } = await supabase
        .from('eventos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ ok: true, data });
    } catch (err) {
      console.error('Error actualizando evento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const id = parseInt(req.params.id, 10);

      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.json({ ok: true });
    } catch (err) {
      console.error('Error eliminando evento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async registrarAsistencia(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { usuario_id } = req.body || {};
      
      if (!usuario_id) {
        return res.status(400).json({ ok: false, error: 'usuario_id es requerido' });
      }

      const { data, error } = await supabase
        .from('registro_eventos')
        .insert([{
          usuario_id,
          evento_id: id
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Duplicate key error
          return res.status(409).json({ ok: false, error: 'El usuario ya está registrado en este evento' });
        }
        throw error;
      }

      res.status(201).json({ ok: true, data });
    } catch (err) {
      console.error('Error registrando asistencia:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async asistentes(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      
      const { data, error } = await supabase
        .from('registro_eventos')
        .select(`
          id,
          fecha_registro,
          usuarios:usuario_id (
            id,
            nombre,
            email
          )
        `)
        .eq('evento_id', id);

      if (error) throw error;

      // Formatear datos
      const formattedData = data.map(reg => ({
        id: reg.id,
        fecha_registro: reg.fecha_registro,
        usuario_id: reg.usuarios?.id,
        nombre: reg.usuarios?.nombre,
        email: reg.usuarios?.email
      }));

      res.json({ ok: true, data: formattedData });
    } catch (err) {
      console.error('Error obteniendo asistentes:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};