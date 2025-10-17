const express = require('express');
const ctrl = require('../controllers/productosController');
const router = express.Router();

router.get('/', ctrl.list);
// Rutas específicas antes de la genérica
router.get('/emprendedor/:emprendedorId', ctrl.listByEmprendedor);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
