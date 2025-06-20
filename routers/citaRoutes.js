// routes/citaRoutes.js
const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.post('/agendar-cita', citaController.agendarCita);
router.get('/doctores', citaController.obtenerDoctores);
router.get('/pacientes', citaController.obtenerPacientes);

module.exports = router;