const express = require('express');
const router = express.Router();
const { 
  crearReporte, 
  listarReportes, 
  cambiarEstado, 
  obtenerReporte 
} = require('../controllers/reporteController');
const { autenticar } = require('../middleware/auth');

/**
 * Rutas de reportes
 * 
 * Todas las rutas requieren autenticación mediante el middleware 'autenticar'
 * 
 * POST /api/reportes - Crear nuevo reporte
 * GET /api/reportes - Listar reportes (ciudadanos ven solo los suyos, admins ven todos)
 * GET /api/reportes/:id - Obtener un reporte específico
 * PATCH /api/reportes/:id/estado - Cambiar estado del reporte (solo admins)
 */

// Todas las rutas requieren autenticación
router.use(autenticar);

// Crear reporte
router.post('/', crearReporte);

// Listar todos los reportes
router.get('/', listarReportes);

// Obtener un reporte específico
router.get('/:id', obtenerReporte);

// Cambiar estado del reporte
router.patch('/:id/estado', cambiarEstado);

module.exports = router;
