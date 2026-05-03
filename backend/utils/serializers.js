/**
 * Objeto usuario seguro para el cliente (sin password).
 */
function usuarioPublico(doc) {
  if (!doc) return null;
  const u = doc.toObject ? doc.toObject() : { ...doc };
  const id = u._id ?? u.id;
  return {
    id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    direccion: u.direccion || '',
    tipoIdentificacion: u.tipoIdentificacion || 'CC',
    numeroIdentificacion: u.numeroIdentificacion || '',
    fotoPerfilUrl: u.fotoPerfilFileId ? `/api/files/${u.fotoPerfilFileId}` : null
  };
}

/**
 * Reporte con URL de imagen GridFS o legado base64 en `imagen`.
 */
function serializeReporte(doc) {
  if (!doc) return null;
  const r = doc.toObject ? doc.toObject() : { ...doc };
  if (r.imagenFileId) {
    r.imagenUrl = `/api/files/${r.imagenFileId}`;
  } else if (r.imagen && typeof r.imagen === 'string' && r.imagen.startsWith('data:')) {
    r.imagenUrl = r.imagen;
  }
  return r;
}

function serializeReportes(docs) {
  return docs.map((d) => serializeReporte(d));
}

module.exports = { usuarioPublico, serializeReporte, serializeReportes };
