const bcrypt = require('bcryptjs'); // ⚠️ Cambiado de 'bcrypt' a 'bcryptjs'
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
      const { email, password, nombre, carrera, telefono, rol } = req.body;

      // Validar campos requeridos
      if (!email || !password || !nombre) {
        return res.status(400).json({ error: 'Email, password y nombre son requeridos' });
      }

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

      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            email,
            password: hashedPassword,
            nombre,
            carrera,
            telefono,
            rol: rol || 'estudiante'
          }
        ])
        .select()
        .single();

      if (error) throw error;

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
      const { nombre, carrera, telefono, email } = req.body;

      const updateData = {};
      if (nombre) updateData.nombre = nombre;
      if (carrera) updateData.carrera = carrera;
      if (telefono) updateData.telefono = telefono;
      if (email) updateData.email = email;

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Remover contraseña
      const { password, ...usuarioSinPassword } = data;

      res.json(usuarioSinPassword);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
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
  }
};

module.exports = usuariosController;