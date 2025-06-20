
const express = require('express');

const router = express.Router();

const pacienteController= require('../controllers/pacienteController'); 

router.post('/registrar-paciente', pacienteController.registrarPaciente);
module.exports = router;

