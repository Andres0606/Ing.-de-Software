const express = require('express');
const router = express.Router();
const emprendedoresController = require('../controllers/emprendedoresController');

router.get('/', emprendedoresController.list);
router.get('/:id', emprendedoresController.getById);
router.get('/usuario/:usuarioId', emprendedoresController.listByUsuario); // ✅ Esta es la importante
router.post('/', emprendedoresController.create);
router.put('/:id', emprendedoresController.update);
router.delete('/:id', emprendedoresController.remove);

module.exports = router;