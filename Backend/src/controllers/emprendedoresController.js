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
        .from('emprendimientos')
        .select(`
          *,
          usuarios:usuario_id (
            nombre,
            apellido,
            email
          ),
          categorias:categoria_id (
            nombre,
            descripcion
          )
        `)
        .eq('activo', true)
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Formatear datos para compatibilidad
      const formattedData = data.map(emp => ({
        ...emp,
        usuario_nombre: emp.usuarios?.nombre,
        usuario_email: emp.usuarios?.email,
        categoria: emp.categorias?.nombre || emp.categoria_id
      }));

      res.json({ ok: true, data: formattedData });
    } catch (err) {
      console.error('Error listando emprendimientos:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabase
        .from('emprendimientos')
        .select(`
          *,
          usuarios:usuario_id (
            nombre,
            apellido,
            email,
            telefono
          ),
          categorias:categoria_id (
            nombre,
            descripcion
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return res.status(404).json({ ok: false, error: 'Emprendimiento no encontrado' });

      // Formatear datos
      const formatted = {
        ...data,
        usuario_nombre: data.usuarios?.nombre,
        usuario_email: data.usuarios?.email,
        categoria: data.categorias?.nombre || data.categoria_id
      };

      res.json({ ok: true, data: formatted });
    } catch (err) {
      console.error('Error obteniendo emprendimiento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async listByUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      
      const { data, error } = await supabase
        .from('emprendimientos')
        .select(`
          *,
          categorias:categoria_id (
            nombre
          )
        `)
        .eq('usuario_id', usuarioId)
        .eq('activo', true)
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;

      // Formatear para compatibilidad con frontend antiguo
      const formatted = (data || []).map(emp => ({
        id: emp.id,
        descripcion: emp.descripcion,
        ubicacion: emp.telefono_contacto || emp.email_contacto, // Mapear ubicacion
        categoria: emp.categorias?.nombre || 'Sin categoría',
        imagen: emp.sitio_web, // Si guardaste imagen en sitio_web, o null
        calificacion: emp.calificacion_promedio || 0
      }));

      res.json(formatted); // ✅ Devolver array directamente
    } catch (err) {
      console.error('Error listando emprendimientos por usuario:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { 
        usuario_id, 
        descripcion, 
        ubicacion, 
        categoria, 
        calificacion, 
        imagen 
      } = req.body || {};
      
      if (!usuario_id) {
        return res.status(400).json({ ok: false, error: 'usuario_id es requerido' });
      }

      // Buscar o crear categoría
      let categoria_id = null;
      if (categoria) {
        const { data: catData } = await supabase
          .from('categorias')
          .select('id')
          .ilike('nombre', categoria)
          .single();
        
        if (catData) {
          categoria_id = catData.id;
        } else {
          // Crear categoría si no existe
          const { data: newCat } = await supabase
            .from('categorias')
            .insert([{ nombre: categoria, activa: true }])
            .select('id')
            .single();
          categoria_id = newCat?.id;
        }
      }

      const { data, error } = await supabase
        .from('emprendimientos')
        .insert([{
          usuario_id,
          nombre: categoria || 'Mi Emprendimiento',
          descripcion: descripcion || null,
          categoria_id: categoria_id,
          estado: 'aprobado', // Auto-aprobar por ahora
          contacto_publico: true,
          activo: true,
          telefono_contacto: ubicacion || null, // Mapear ubicacion a telefono
          sitio_web: imagen || null, // Guardar imagen en sitio_web temporalmente
          calificacion_promedio: calificacion || 0
        }])
        .select()
        .single();

      if (error) throw error;

      // Formatear respuesta para compatibilidad
      const formatted = {
        id: data.id,
        descripcion: data.descripcion,
        ubicacion: data.telefono_contacto,
        categoria: categoria,
        imagen: data.sitio_web,
        calificacion: data.calificacion_promedio
      };

      res.status(201).json(formatted);
    } catch (err) {
      console.error('Error creando emprendimiento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { descripcion, ubicacion, categoria, calificacion, imagen } = req.body || {};

      // Verificar que existe
      const { data: existing } = await supabase
        .from('emprendimientos')
        .select('id')
        .eq('id', id)
        .single();

      if (!existing) {
        return res.status(404).json({ ok: false, error: 'Emprendimiento no encontrado' });
      }

      const updateData = {};
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (ubicacion !== undefined) updateData.telefono_contacto = ubicacion;
      if (imagen !== undefined) updateData.sitio_web = imagen;
      if (calificacion !== undefined) updateData.calificacion_promedio = calificacion;
      if (categoria !== undefined) updateData.nombre = categoria;

      const { data, error } = await supabase
        .from('emprendimientos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ ok: true, data });
    } catch (err) {
      console.error('Error actualizando emprendimiento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      // Soft delete
      const { error } = await supabase
        .from('emprendimientos')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;

      res.json({ ok: true });
    } catch (err) {
      console.error('Error eliminando emprendimiento:', err);
      res.status(500).json({ ok: false, error: err.message });
    }
  },
};