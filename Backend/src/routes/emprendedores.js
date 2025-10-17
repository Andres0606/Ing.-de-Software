const express = require('express');
const ctrl = require('../controllers/emprendedoresController');
const router = express.Router();

router.get('/', ctrl.list);
// Rutas específicas antes de la genérica
router.get('/usuario/:usuarioId', ctrl.listByUsuario);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
