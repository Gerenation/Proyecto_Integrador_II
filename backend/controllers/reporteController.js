const mongoose = require('mongoose');
const Reporte = require('../models/Reporte');
const Usuario = require('../models/Usuario');
const {
  generarReporteDesdeTexto,
  InvalidReportError,
  LlmParseError,
  LlmServiceError
} = require('../services/ollama');
const { bufferFromImageInput } = require('../utils/imageBuffer');
const { uploadBuffer } = require('../services/gridfsStore');
const { serializeReporte, serializeReportes } = require('../utils/serializers');
const { enviarConfirmacionReporte } = require('../services/emailService');

function ajustarCamposParaGuardar(datos, mensajeOriginal) {
  const msg = String(mensajeOriginal || '').trim();
  let titulo = String(datos.titulo || '').trim().substring(0, 100);
  if (titulo.length < 3) {
    const primeraLineaNoVacia = msg.split(/\r?\n/).find((l) => l.trim());
    titulo = (primeraLineaNoVacia || msg).trim().substring(0, 100);
  }
  if (titulo.length < 3) {
    titulo = 'Reporte urbano';
  }

  let descripcion = String(datos.descripcion || '').trim().substring(0, 500);
  if (descripcion.length < 10) {
    descripcion = msg.substring(0, 500);
  }
  if (descripcion.length < 10) {
    descripcion = 'Reporte registrado por el ciudadano (texto breve).';
  }

  const ubicacion = String(datos.ubicacion || '').trim() || 'No especificada';

  return {
    titulo,
    descripcion,
    categoria: datos.categoria,
    ubicacion
  };
}

/**
 * Imagen → GridFS únicamente. Nunca se envía a la IA (solo `mensaje` va a Ollama).
 */
async function procesarImagenReporte(req, imagen) {
  if (!imagen || typeof imagen !== 'string') {
    return { imagenFileId: null };
  }
  const parsed = bufferFromImageInput(imagen);
  const imagenFileId = await uploadBuffer(
    parsed.buffer,
    `reporte-${Date.now()}`,
    parsed.contentType,
    { tipo: 'reporte', creatorId: String(req.usuario._id) }
  );
  return { imagenFileId };
}

function notificarReporteCreado(docPoblado) {
  const ser = serializeReporte(docPoblado);
  const email = docPoblado.usuarioId?.email;
  const nombre = docPoblado.usuarioId?.nombre;
  if (!email) return;
  setImmediate(() => {
    enviarConfirmacionReporte({ to: email, nombre, reporte: ser }).catch((err) =>
      console.warn('[email] confirmación reporte:', err.message)
    );
  });
}

const crearReporteConFallback = async (req, res) => {
  try {
    const categoriasPermitidas = Reporte.schema.path('categoria').enumValues;

    if (req.body.modo === 'manual') {
      const { titulo, descripcion, categoria, ubicacion, imagen } = req.body;

      if (
        titulo == null ||
        descripcion == null ||
        categoria == null ||
        ubicacion == null
      ) {
        return res.status(400).json({
          mensaje:
            'Reporte manual: envía titulo, descripcion, categoria y ubicacion'
        });
      }

      if (!categoriasPermitidas.includes(categoria)) {
        return res.status(400).json({
          mensaje: 'Categoría no válida para el reporte manual'
        });
      }

      let imagenFileId = null;
      if (imagen && typeof imagen === 'string') {
        try {
          const r = await procesarImagenReporte(req, imagen);
          imagenFileId = r.imagenFileId;
        } catch (imgErr) {
          return res.status(400).json({ mensaje: imgErr.message });
        }
      }

      const nuevoReporte = new Reporte({
        titulo: String(titulo).trim().substring(0, 100),
        descripcion: String(descripcion).trim().substring(0, 500),
        categoria,
        ubicacion: String(ubicacion).trim(),
        imagen: null,
        imagenFileId,
        usuarioId: req.usuario._id
      });

      await nuevoReporte.save();
      await nuevoReporte.populate('usuarioId', 'nombre email direccion numeroIdentificacion tipoIdentificacion');
      notificarReporteCreado(nuevoReporte);

      return res.status(201).json({
        mensaje: 'Reporte manual creado correctamente',
        reporte: serializeReporte(nuevoReporte),
        iaDisponible: false
      });
    }

    const { mensaje, imagen } = req.body;

    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
      return res.status(400).json({
        mensaje: 'Debes enviar un campo "mensaje" con el texto del reporte'
      });
    }

    let imagenFileId = null;
    if (imagen && typeof imagen === 'string') {
      try {
        const r = await procesarImagenReporte(req, imagen);
        imagenFileId = r.imagenFileId;
      } catch (imgErr) {
        return res.status(400).json({ mensaje: imgErr.message });
      }
    }

    let datos;
    let usadoIA = true;

    try {
      datos = await generarReporteDesdeTexto(mensaje);
    } catch (errIa) {
      if (errIa instanceof LlmServiceError) {
        console.warn('⚠️  Ollama no disponible, usando fallback:', errIa.message);
        usadoIA = false;
        const lineas = mensaje.trim().split('\n');
        datos = {
          titulo: lineas[0].substring(0, 100) || 'Reporte sin título',
          descripcion: mensaje.substring(0, 500),
          categoria: 'Otro',
          ubicacion: 'No especificada'
        };
      } else if (errIa instanceof InvalidReportError) {
        return res.status(400).json({ mensaje: errIa.message });
      } else if (errIa instanceof LlmParseError) {
        console.warn('⚠️  Respuesta de IA no parseable, usando fallback:', errIa.message);
        usadoIA = false;
        const lineas = mensaje.trim().split('\n');
        datos = {
          titulo: lineas[0].substring(0, 100) || 'Reporte sin título',
          descripcion: mensaje.substring(0, 500),
          categoria: 'Otro',
          ubicacion: 'No especificada'
        };
      } else {
        throw errIa;
      }
    }

    datos = ajustarCamposParaGuardar(datos, mensaje);

    const nuevoReporte = new Reporte({
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      ubicacion: datos.ubicacion,
      imagen: null,
      imagenFileId,
      usuarioId: req.usuario._id
    });

    await nuevoReporte.save();
    await nuevoReporte.populate('usuarioId', 'nombre email direccion numeroIdentificacion tipoIdentificacion');
    notificarReporteCreado(nuevoReporte);

    return res.status(201).json({
      mensaje: usadoIA ? 'Reporte creado con IA' : 'Reporte creado sin IA (fallback)',
      reporte: serializeReporte(nuevoReporte),
      iaDisponible: usadoIA
    });
  } catch (error) {
    console.error('❌ Error al crear reporte:', error);

    if (error.name === 'ValidationError') {
      const primerError = Object.values(error.errors)[0];
      const texto = primerError ? primerError.message : 'Datos del reporte inválidos';
      return res.status(400).json({ mensaje: texto });
    }

    return res.status(500).json({
      mensaje: 'Error al crear reporte',
      error: error.message
    });
  }
};

const crearReporte = crearReporteConFallback;

const listarReportes = async (req, res) => {
  try {
    const { q, estado, usuarioId: uidFiltro, desde, hasta, nombreUsuario } = req.query;
    const estadosValidos = Reporte.schema.path('estado').enumValues;
    const and = [];

    if (req.usuario.rol === 'ciudadano') {
      and.push({ usuarioId: req.usuario._id });
    }

    if (estado && estadosValidos.includes(estado)) {
      and.push({ estado });
    }

    if (req.usuario.rol === 'admin' && uidFiltro && mongoose.isValidObjectId(uidFiltro)) {
      and.push({ usuarioId: uidFiltro });
    }

    if (desde || hasta) {
      const rango = {};
      if (desde) {
        const d = new Date(desde);
        if (!Number.isNaN(d.getTime())) rango.$gte = d;
      }
      if (hasta) {
        const h = new Date(hasta);
        if (!Number.isNaN(h.getTime())) {
          h.setHours(23, 59, 59, 999);
          rango.$lte = h;
        }
      }
      if (Object.keys(rango).length) {
        and.push({ fecha: rango });
      }
    }

    if (q && String(q).trim()) {
      const esc = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(esc, 'i');
      and.push({ $or: [{ titulo: rx }, { descripcion: rx }] });
    }

    if (nombreUsuario && String(nombreUsuario).trim() && req.usuario.rol === 'admin') {
      const esc = String(nombreUsuario).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(esc, 'i');
      const usuarios = await Usuario.find({ nombre: rx }).select('_id');
      const ids = usuarios.map((u) => u._id);
      if (!ids.length) {
        return res.json({ cantidad: 0, reportes: [] });
      }
      and.push({ usuarioId: { $in: ids } });
    }

    const query = and.length ? { $and: and } : {};

    const reportes = await Reporte.find(query)
      .populate('usuarioId', 'nombre email direccion numeroIdentificacion tipoIdentificacion')
      .sort({ fecha: -1 });

    res.json({
      cantidad: reportes.length,
      reportes: serializeReportes(reportes)
    });
  } catch (error) {
    console.error('Error al listar reportes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener reportes',
      error: error.message
    });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['Pendiente', 'En proceso', 'Resuelto'];
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        mensaje: 'Estado inválido. Debe ser: Pendiente, En proceso o Resuelto'
      });
    }

    const reporte = await Reporte.findById(id);
    if (!reporte) {
      return res.status(404).json({
        mensaje: 'Reporte no encontrado'
      });
    }

    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({
        mensaje: 'No tienes permisos para cambiar el estado de este reporte'
      });
    }

    reporte.estado = estado;
    await reporte.save();

    await reporte.populate('usuarioId', 'nombre email direccion numeroIdentificacion tipoIdentificacion');

    res.json({
      mensaje: 'Estado del reporte actualizado exitosamente',
      reporte: serializeReporte(reporte)
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({
      mensaje: 'Error al cambiar estado del reporte',
      error: error.message
    });
  }
};

const obtenerReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const reporte = await Reporte.findById(id).populate('usuarioId', 'nombre email direccion numeroIdentificacion tipoIdentificacion');

    if (!reporte) {
      return res.status(404).json({
        mensaje: 'Reporte no encontrado'
      });
    }

    const duenoReporteId = reporte.usuarioId?._id ?? reporte.usuarioId;
    if (
      req.usuario.rol === 'ciudadano' &&
      (!duenoReporteId || duenoReporteId.toString() !== req.usuario._id.toString())
    ) {
      return res.status(403).json({
        mensaje: 'No tienes permisos para ver este reporte'
      });
    }

    res.json({
      reporte: serializeReporte(reporte)
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
