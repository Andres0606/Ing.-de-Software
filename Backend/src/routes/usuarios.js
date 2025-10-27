const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// ⚠️ IMPORTANTE: El orden de las rutas importa en Express
// Las rutas más específicas deben ir ANTES que las genéricas

// Ruta de login (debe ir antes de /:id)
router.post('/login', usuariosController.login);

// Ruta para cambiar contraseña (debe ir antes de /:id)
router.post('/:id/change-password', usuariosController.cambiarPassword);

// Rutas CRUD básicas de usuarios
router.get('/', usuariosController.obtenerTodos);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

module.exports = router;