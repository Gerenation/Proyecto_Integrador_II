const express = require('express');
const router = express.Router();
const { autenticar, esAdmin } = require('../middleware/auth');
const { listarUsuarios } = require('../controllers/adminController');

router.use(autenticar, esAdmin);
router.get('/usuarios', listarUsuarios);

module.exports = router;
