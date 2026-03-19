const express = require('express');
const router = express.Router();

// Importamos las piezas que creamos antes
const authController = require('../controllers/authController');
const { validarRegistro } = require('../middlewares/authValidator');

// Definimos la ruta de registro (RF-01)
// Primero pasa por el validador, si todo está OK, va al controlador
router.post('/register', validarRegistro, authController.registrar);
router.post('/login', authController.login);

module.exports = router;