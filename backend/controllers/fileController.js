const { openDownloadStream, findFileDoc } = require('../services/gridfsStore');
const Reporte = require('../models/Reporte');

/**
 * GET /api/files/:id — transmisión desde GridFS (reporte o foto de perfil).
 */
const descargarArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await findFileDoc(id);
    if (!doc) {
      return res.status(404).json({ mensaje: 'Archivo no encontrado' });
    }

    const meta = doc.metadata || {};
    let permitido = false;

    if (meta.tipo === 'perfil') {
      permitido =
        req.usuario.rol === 'admin' ||
        String(meta.userId) === String(req.usuario._id);
    } else if (meta.tipo === 'reporte') {
      if (req.usuario.rol === 'admin') {
        permitido = true;
      } else if (String(meta.creatorId) === String(req.usuario._id)) {
        permitido = true;
      } else {
        const rep = await Reporte.findOne({ imagenFileId: id });
        permitido = !!(rep && String(rep.usuarioId) === String(req.usuario._id));
      }
    } else {
      return res.status(403).json({ mensaje: 'Tipo de archivo no reconocido' });
    }

    if (!permitido) {
      return res.status(403).json({ mensaje: 'Sin acceso al archivo' });
    }

    res.setHeader('Content-Type', doc.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'private, max-age=86400');

    const stream = openDownloadStream(id);
    stream.on('error', () => {
      if (!res.headersSent) res.status(404).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error('GridFS:', err);
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error al leer el archivo' });
    }
  }
};

module.exports = { descargarArchivo };
