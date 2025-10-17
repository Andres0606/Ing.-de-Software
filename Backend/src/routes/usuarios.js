const express = require('express');
const ctrl = require('../controllers/usuariosController');
const router = express.Router();

// Auth
router.post('/login', ctrl.login);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
