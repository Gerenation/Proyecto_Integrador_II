const express = require('express');
const router = express.Router();
const { registrar, login, obtenerPerfil } = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');

/**
 * Rutas de autenticación
 * 
 * POST /api/auth/registro - Registrar nuevo usuario
 * POST /api/auth/login - Iniciar sesión
 * GET /api/auth/perfil - Obtener perfil del usuario autenticado (requiere token)
 */

// Ruta pública: registro
router.post('/registro', registrar);

// Ruta pública: login
router.post('/login', login);

// Ruta protegida: obtener perfil (requiere autenticación)
router.get('/perfil', autenticar, obtenerPerfil);

module.exports = router;
