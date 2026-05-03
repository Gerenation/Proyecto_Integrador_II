const Usuario = require('../models/Usuario');
const { usuarioPublico } = require('../utils/serializers');

/**
 * GET /api/admin/usuarios?rol=admin|ciudadano
 */
const listarUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    const filtro = {};
    if (rol === 'admin') filtro.rol = 'admin';
    if (rol === 'ciudadano') filtro.rol = 'ciudadano';

    const lista = await Usuario.find(filtro).select('-password').sort({ createdAt: -1 });

    res.json({
      cantidad: lista.length,
      usuarios: lista.map((u) => usuarioPublico(u))
    });
  } catch (error) {
    console.error('Admin usuarios:', error);
    res.status(500).json({
      mensaje: 'Error al listar usuarios',
      error: error.message
    });
  }
};

module.exports = { listarUsuarios };
