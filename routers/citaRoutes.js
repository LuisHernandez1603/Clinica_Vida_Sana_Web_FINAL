const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

router.post('/agendar-cita', citaController.agendarCita);

module.exports = router;
