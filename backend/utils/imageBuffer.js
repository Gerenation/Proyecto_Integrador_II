const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Convierte data URL o base64 crudo en buffer + tipo MIME.
 * No se usa en la ruta de IA (solo texto).
 */
function bufferFromImageInput(imagen) {
  if (!imagen || typeof imagen !== 'string') {
    return null;
  }

  let contentType = 'image/jpeg';
  let b64 = imagen.trim();

  const dataUrl = b64.match(/^data:([^;]+);base64,(.+)$/s);
  if (dataUrl) {
    contentType = dataUrl[1] || contentType;
    b64 = dataUrl[2];
  }

  if (!/^[A-Za-z0-9+/=\s]+$/.test(b64.replace(/\s/g, '')) && !dataUrl) {
    throw new Error('Formato de imagen inválido');
  }

  const buffer = Buffer.from(b64.replace(/\s/g, ''), 'base64');
  if (buffer.length > MAX_BYTES) {
    throw new Error('La imagen es demasiado grande (máximo 5MB)');
  }
  if (buffer.length === 0) {
    throw new Error('Imagen vacía');
  }

  return { buffer, contentType };
}

module.exports = { bufferFromImageInput, MAX_BYTES };
