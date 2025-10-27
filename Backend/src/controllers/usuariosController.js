const bcrypt = require('bcryptjs');
const { supabase } = require('../db/mysql');

const usuariosController = {
  // Obtener todos los usuarios
  obtenerTodos: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('activo', true);

      if (error) throw error;

      // Remover contraseñas antes de enviar
      const usuariosSinPassword = data.map(({ password, ...usuario }) => usuario);

      res.json(usuariosSinPassword);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  // Obtener usuario por ID
  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Remover contraseña
      const { password, ...usuarioSinPassword } = data;

      res.json(usuarioSinPassword);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  // Crear usuario
  crear: async (req, res) => {
    try {
      const { 
        email, 
        password, 
        nombre, 
        apellido, 
        carrera, 
        telefono, 
        fecha_nacimiento, 
        rol 
      } = req.body;

      console.log('🔍 Datos recibidos en backend:', { 
        email, 
        nombre, 
        apellido, 
        rol,
        tipo_rol: typeof rol 
      });

      // Validar campos requeridos
      if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({ 
          error: 'Email, password, nombre y apellido son requeridos' 
        });
      }

      // ✅ VALIDACIÓN DE ROL MEJORADA
      const rolesValidos = ['Emprendedor', 'Administrador', 'Usuario de la universidad'];
      let rolFinal = rol && rolesValidos.includes(rol) ? rol : 'Usuario de la universidad';
      
      console.log('🔍 ROL RECIBIDO:', rol);
      console.log('🔍 ROL QUE SE GUARDARÁ:', rolFinal);

      // Verificar si el email ya existe
      const { data: existente } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email)
        .single();

      if (existente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ INSERTAR USUARIO
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            email,
            password: hashedPassword,
            nombre,
            apellido,
            carrera: carrera || null,
            telefono: telefono || null,
            fecha_nacimiento: fecha_nacimiento || null,
            rol: rolFinal,
            activo: true,
            verificado: false
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error de Supabase al insertar:', error);
        throw error;
      }

      console.log('✅ Usuario INSERTADO, Supabase devolvió:', data);
      console.log('🔍 ROL DEVUELTO POR SUPABASE:', data?.rol);

      // 🔥 SI SUPABASE CAMBIÓ EL ROL, FORZAMOS UN UPDATE
      if (data && data.rol !== rolFinal) {
        console.warn('⚠️ Supabase cambió el rol! Forzando actualización...');
        
        const { data: dataActualizada, error: errorUpdate } = await supabase
          .from('usuarios')
          .update({ rol: rolFinal })
          .eq('id', data.id)
          .select()
          .single();

        if (errorUpdate) {
          console.error('❌ Error al forzar actualización de rol:', errorUpdate);
        } else {
          console.log('✅ Rol actualizado forzosamente:', dataActualizada?.rol);
          data.rol = dataActualizada.rol; // Usar el dato actualizado
        }
      }

      // Remover contraseña
      const { password: _, ...usuarioSinPassword } = data;

      res.status(201).json(usuarioSinPassword);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  // Actualizar usuario
  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        nombre, 
        apellido, 
        carrera, 
        telefono, 
        email, 
        fecha_nacimiento,
        avatar_url 
      } = req.body;

      console.log('🔍 Actualizando usuario ID:', id);
      console.log('📦 Datos recibidos:', req.body);

      // ✅ PRIMERO: Verificar que el usuario existe
      const { data: usuarioExistente, error: errorBusqueda } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (errorBusqueda || !usuarioExistente) {
        console.error('❌ Usuario no encontrado:', id);
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      console.log('✅ Usuario encontrado:', usuarioExistente.email);

      // ✅ SEGUNDO: Construir objeto de actualización (solo campos que vienen)
      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (apellido !== undefined) updateData.apellido = apellido;
      if (carrera !== undefined) updateData.carrera = carrera;
      if (telefono !== undefined) updateData.telefono = telefono;
      if (email !== undefined) updateData.email = email;
      if (fecha_nacimiento !== undefined) updateData.fecha_nacimiento = fecha_nacimiento;
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

      console.log('📝 Campos a actualizar:', updateData);

      // ✅ TERCERO: Actualizar sin usar .single() primero
      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Error de Supabase al actualizar:', error);
        throw error;
      }

      // ✅ CUARTO: Validar que se actualizó
      if (!data || data.length === 0) {
        console.error('❌ No se actualizó ningún registro');
        return res.status(404).json({ error: 'No se pudo actualizar el usuario' });
      }

      const usuarioActualizado = data[0];
      console.log('✅ Usuario actualizado correctamente:', usuarioActualizado.email);

      // Remover contraseña
      const { password, ...usuarioSinPassword } = usuarioActualizado;

      res.json(usuarioSinPassword);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      res.status(500).json({ 
        error: 'Error al actualizar usuario',
        details: error.message 
      });
    }
  },

  // Eliminar usuario (soft delete)
  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('usuarios')
        .update({ activo: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email y password son requeridos' });
      }

      // Buscar usuario por email
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('activo', true)
        .single();

      if (error || !usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValido = await bcrypt.compare(password, usuario.password);

      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Remover contraseña antes de enviar
      const { password: _, ...usuarioSinPassword } = usuario;

      res.json({
        mensaje: 'Login exitoso',
        usuario: usuarioSinPassword
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  },

  // ✅ NUEVO: Cambiar contraseña
  cambiarPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Contraseña actual y nueva son requeridas' 
        });
      }

      // Buscar usuario
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar contraseña actual
      const passwordValido = await bcrypt.compare(currentPassword, usuario.password);

      if (!passwordValido) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' });
      }

      // Encriptar nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ password: hashedPassword })
        .eq('id', id);

      if (updateError) throw updateError;

      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
  }
};

module.exports = usuariosController;