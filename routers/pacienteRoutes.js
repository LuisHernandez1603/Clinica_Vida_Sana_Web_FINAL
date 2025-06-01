// routers/pacienteRoutes.js
const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

// Ruta para registrar paciente
router.post('/registrar-paciente', pacienteController.registrarPaciente);

// Exportar el router correctamente
module.exports = router;
