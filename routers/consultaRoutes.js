const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaControllers');

router.get('/cita', consultaController.obtenerCitaPorCodigo);
router.post('/registrar', consultaController.registrarConsulta);

module.exports = router;
