const express = require('express');
const router = express.Router();
const { crearCuentaPaciente } = require('../controllers/crearCuentaControllers');

router.post('/crear-cuenta-paciente', crearCuentaPaciente);

module.exports = router;