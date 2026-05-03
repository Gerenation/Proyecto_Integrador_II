const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { descargarArchivo, descargarArchivoPublico } = require('../controllers/fileController');

// Ruta pública: descargar fotos de perfil sin autenticación
router.get('/:id/public', descargarArchivoPublico);

// Ruta autenticada: descargar cualquier archivo
router.get('/:id', autenticar, descargarArchivo);

module.exports = router;
