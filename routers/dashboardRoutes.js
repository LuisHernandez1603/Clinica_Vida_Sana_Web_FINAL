// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerDatosDashboard } = require('../controllers/dashboardController');

router.get('/dashboard-datos', obtenerDatosDashboard);

module.exports = router;