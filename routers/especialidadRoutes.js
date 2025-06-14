const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/EspecialidadControllers');

// Ruta POST para registrar una especialidad
router.post('/registrar', especialidadController.registrarEspecialidad);

module.exports = router;
