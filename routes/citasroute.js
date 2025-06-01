const express = require('express');
const router = express.Router();
const { agendarCita } = require('../controllers/citacontroller');

router.post('/', agendarCita);

module.exports = router;
