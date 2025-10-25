const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Rutas de usuarios
router.get('/', usuariosController.obtenerTodos);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

// Ruta de login
router.post('/login', usuariosController.login);

module.exports = router;