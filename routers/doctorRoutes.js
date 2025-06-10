// routers/doctorRoutes.js
const express = require('express');
const router = express.Router();

const { registrarDoctor, listarEspecialidades } = require('../controllers/doctorController');

router.post('/registrar-doctor', registrarDoctor);
router.get('/especialidades', listarEspecialidades);

module.exports = router;
