const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { descargarArchivo } = require('../controllers/fileController');

router.get('/:id', autenticar, descargarArchivo);

module.exports = router;
