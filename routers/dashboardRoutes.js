const express = require('express');
const router = express.Router();
const { obtenerKPIs } = require('../controllers/dashboardControllers');

router.get('/kpis-llenar', obtenerKPIs);

module.exports = router;