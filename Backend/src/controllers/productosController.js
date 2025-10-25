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
        .from('productos')
        .select(`
          *,
          emprendimientos:emprendimiento_id (
            usuario_id,
            nombre
          )
        `)
        .eq('activo', true)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json({ ok: true, data: data || [] });
    } catch (err) {
      console.error('Error listando productos:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('productos')
        .select(`
          *,
          emprendimientos:emprendimiento_id (
            nombre,
            usuario_id
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });

      res.json({ ok: true, data });
    } catch (err) {
      console.error('Error obteniendo producto:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async listByEmprendedor(req, res) {
    try {
      const { emprendedorId } = req.params;
      
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('emprendimiento_id', emprendedorId)
        .eq('activo', true);

      if (error) throw error;

      res.json({ ok: true, data: data || [] });
    } catch (err) {
      console.error('Error listando productos por emprendimiento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { 
        emprendedor_id, 
        nombre, 
        descripcion, 
        categoria, 
        precio, 
        calificacion, 
        vendidos, 
        imagen 
      } = req.body || {};
      
      if (!emprendedor_id || !nombre || precio == null) {
        return res.status(400).json({ 
          ok: false, 
          error: 'emprendedor_id, nombre y precio son requeridos' 
        });
      }

      const { data, error } = await supabase
        .from('productos')
        .insert([{
          emprendimiento_id: emprendedor_id,
          nombre,
          descripcion: descripcion || null,
          categoria: categoria || null,
          precio,
          tipo: 'producto',
          stock: vendidos || 0,
          disponible: true,
          activo: true,
          calificacion_promedio: calificacion || 0
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ ok: true, data });
    } catch (err) {
      console.error('Error creando producto:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, categoria, precio, calificacion, vendidos, imagen } = req.body || {};

      const { data: existing } = await supabase
        .from('productos')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
      }

      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (categoria !== undefined) updateData.categoria = categoria;
      if (precio !== undefined) updateData.precio = precio;
      if (calificacion !== undefined) updateData.calificacion_promedio = calificacion;
      if (vendidos !== undefined) updateData.stock = vendidos;

      const { data, error } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ ok: true, data });
    } catch (err) {
      console.error('Error actualizando producto:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;

      res.json({ ok: true });
    } catch (err) {
      console.error('Error eliminando producto:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};