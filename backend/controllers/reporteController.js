const Reporte = require('../models/Reporte');

/**
 * Controlador para crear un nuevo reporte
 * POST /api/reportes
 * Requiere autenticación
 */
const crearReporte = async (req, res) => {
  try {
    const { titulo, descripcion, categoria, ubicacion } = req.body;

    // Validar campos requeridos
    if (!titulo || !descripcion || !categoria || !ubicacion) {
      return res.status(400).json({
        mensaje: 'Por favor completa todos los campos requeridos'
      });
    }

    // Crear nuevo reporte asociado al usuario autenticado
    const nuevoReporte = new Reporte({
      titulo,
      descripcion,
      categoria,
      ubicacion,
      usuarioId: req.usuario._id // El usuario viene del middleware de autenticación
    });

    await nuevoReporte.save();

    // Poblar el campo usuarioId para devolver información del usuario
    await nuevoReporte.populate('usuarioId', 'nombre email');

    res.status(201).json({
      mensaje: 'Reporte creado exitosamente',
      reporte: nuevoReporte
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({
      mensaje: 'Error al crear reporte',
      error: error.message
    });
  }
};

/**
 * Controlador para listar todos los reportes
 * GET /api/reportes
 * Requiere autenticación
 * Los ciudadanos ven solo sus reportes, los admins ven todos
 */
const listarReportes = async (req, res) => {
  try {
    let query = {};

    // Si es ciudadano, solo ver sus propios reportes
    // Si es admin, ver todos los reportes
    if (req.usuario.rol === 'ciudadano') {
      query.usuarioId = req.usuario._id;
    }

    // Buscar reportes y poblar información del usuario
    const reportes = await Reporte.find(query)
      .populate('usuarioId', 'nombre email')
      .sort({ fecha: -1 }); // Ordenar por fecha más reciente primero

    res.json({
      cantidad: reportes.length,
      reportes
    });
  } catch (error) {
    console.error('Error al listar reportes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reportes',
      error: error.message
    });
  }
};

/**
 * Controlador para cambiar el estado de un reporte
 * PATCH /api/reportes/:id/estado
 * Requiere autenticación
 * Solo los admins pueden cambiar el estado
 */
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Validar que el estado sea válido
    const estadosValidos = ['Pendiente', 'En proceso', 'Resuelto'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: 'Estado inválido. Debe ser: Pendiente, En proceso o Resuelto'
      });
    }

    // Buscar el reporte
    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({
        mensaje: 'Reporte no encontrado'
      });
    }

    // Verificar permisos: ciudadanos solo pueden cambiar estado de sus propios reportes
    // En este MVP, solo los admins pueden cambiar estados
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        mensaje: 'No tienes permisos para cambiar el estado de este reporte'
      });
    }

    // Actualizar el estado
    reporte.estado = estado;
    await reporte.save();

    // Poblar información del usuario
    await reporte.populate('usuarioId', 'nombre email');

    res.json({
      mensaje: 'Estado del reporte actualizado exitosamente',
      reporte
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      mensaje: 'Error al cambiar estado del reporte',
      error: error.message
    });
  }
};

/**
 * Controlador para obtener un reporte por ID
 * GET /api/reportes/:id
 * Requiere autenticación
 */
const obtenerReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findById(id).populate('usuarioId', 'nombre email');

    if (!reporte) {
      return res.status(404).json({
        mensaje: 'Reporte no encontrado'
      });
    }

    // Verificar permisos, eso significa que los ciudadanos solo pueden ver sus propios reportes
    if (req.usuario.rol === 'ciudadano' && reporte.usuarioId._id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para ver este reporte'
      });
    }

    res.json({
      reporte
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reporte',
      error: error.message
    });
  }
};

module.exports = {
  crearReporte,
  listarReportes,
  cambiarEstado,
  obtenerReporte
};
