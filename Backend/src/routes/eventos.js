const express = require('express');
const ctrl = require('../controllers/eventosController');
const router = express.Router();

router.get('/', ctrl.list);
// Rutas con subpaths primero
router.post('/:id/registrar', ctrl.registrarAsistencia);
router.get('/:id/asistentes', ctrl.asistentes);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
