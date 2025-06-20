const express = require('express');
const router = express.Router();
const adminBajaController = require('../controllers/AdminBajaControllers');

// Obtener lista activos de tipo
router.get('/:tipo', adminBajaController.obtenerActivos);

// Dar de baja lógico (desactivar)
router.post('/baja', adminBajaController.darDeBaja);
// enviar editar
router.put('/:tipo/editar', adminBajaController.editarUsuario);

// Cambiar estado (activar o desactivar)
router.post('/cambiar-estado', adminBajaController.cambiarEstado);


module.exports = router;
