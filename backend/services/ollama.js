/**
 * Cliente Ollama (API local): convierte mensaje en lenguaje natural en campos del modelo Reporte.
 * Documentación: https://github.com/ollama/ollama/blob/main/docs/api.md
 */

class InvalidReportError extends Error {
  constructor(message = 'El texto no describe un reporte válido') {
    super(message);
    this.name = 'InvalidReportError';
  }
}

class LlmParseError extends Error {
  constructor(message = 'No se pudo interpretar la respuesta de la IA') {
    super(message);
    this.name = 'LlmParseError';
  }
}

class LlmServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LlmServiceError';
  }
}

const MAPA_CATEGORIAS = {
  basura: 'Basura',
  ruido: 'Ruido',
  contaminacion: 'Contaminacion',
  seguridad: 'Seguridad'
};

const CATEGORIAS_IA_PERMITIDAS = Object.keys(MAPA_CATEGORIAS);

function baseUrlNormalizada() {
  const raw = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  return String(raw).replace(/\/+$/, '');
}

function nombreModelo() {
  const m = process.env.OLLAMA_MODEL;
  return (m && m.trim()) || 'llama3';
}

function timeoutMs() {
  const n = Number(process.env.OLLAMA_TIMEOUT_MS);
  return Number.isFinite(n) && n > 0 ? n : 120000;
}

/** Si es "false" o "0", no se envía format:json (algunos modelos devuelven vacío con JSON forzado). */
function preferirFormatoJsonExplicito() {
  const v = process.env.OLLAMA_JSON_FORMAT;
  if (v === undefined || v === '') {
    return true;
  }
  const s = String(v).trim().toLowerCase();
  return s !== '0' && s !== 'false' && s !== 'no' && s !== 'off';
}

function limpiarTextoParaJson(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }

  let t = texto.trim();
  const regexFence = /^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```$/i;
  const matchCompleto = t.match(regexFence);
  if (matchCompleto) {
    return matchCompleto[1].trim();
  }

  if (t.startsWith('```json')) {
    t = t.slice(7);
  } else if (t.startsWith('```')) {
    t = t.slice(3);
  }
  if (t.endsWith('```')) {
    t = t.slice(0, -3);
  }

  return t.trim();
}

function extraerPrimerObjetoJson(texto) {
  if (!texto || typeof texto !== 'string') {
    throw new LlmParseError('La IA respondió sin contenido legible');
  }

  const inicio = texto.indexOf('{');
  if (inicio === -1) {
    throw new LlmParseError('La IA no devolvió un objeto JSON');
  }

  let profundidad = 0;
  let enString = false;
  let escape = false;

  for (let i = inicio; i < texto.length; i += 1) {
    const c = texto[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (c === '\\') {
      escape = true;
      continue;
    }
    if (c === '"') {
      enString = !enString;
      continue;
    }
    if (enString) {
      continue;
    }
    if (c === '{') {
      profundidad += 1;
      continue;
    }
    if (c === '}') {
      profundidad -= 1;
      if (profundidad === 0) {
        return texto.slice(inicio, i + 1).trim();
      }
    }
  }

  throw new LlmParseError('No se pudo cerrar correctamente el JSON devuelto por la IA');
}

function parsearJsonSeguro(textoLimpio) {
  try {
    return JSON.parse(textoLimpio);
  } catch (_) {
    const soloJson = extraerPrimerObjetoJson(textoLimpio);
    try {
      return JSON.parse(soloJson);
    } catch {
      throw new LlmParseError(
        'La IA no devolvió JSON válido. Intenta de nuevo con un texto más claro.'
      );
    }
  }
}

/**
 * La IA a veces devuelve números u otros tipos; Mongoose espera strings.
 */
function coerceCamposStrings(obj) {
  const campos = ['titulo', 'descripcion', 'categoria', 'ubicacion'];
  const out = { ...obj };
  for (const c of campos) {
    if (out[c] !== undefined && out[c] !== null && typeof out[c] !== 'string') {
      out[c] = String(out[c]);
    }
  }
  return out;
}

function validarCamposReporte(obj) {
  const campos = ['titulo', 'descripcion', 'categoria', 'ubicacion'];
  for (const c of campos) {
    if (obj[c] === undefined || obj[c] === null) {
      throw new LlmParseError(`Falta el campo obligatorio: ${c}`);
    }
    if (typeof obj[c] !== 'string') {
      throw new LlmParseError(`El campo ${c} debe ser texto`);
    }
    const valor = obj[c].trim();
    if (valor === '') {
      throw new LlmParseError(`El campo ${c} está vacío`);
    }
  }
}

function normalizarCategoria(valorCrudo) {
  const key = String(valorCrudo).trim().toLowerCase();
  const normalizada = MAPA_CATEGORIAS[key];
  if (!normalizada) {
    return 'Otro';
  }
  return normalizada;
}

/**
 * Instrucciones fijas (rol system): separar reglas del texto del ciudadano mejora adherencia al JSON en /api/chat.
 */
function construirMensajeSistema() {
  const listaCats = CATEGORIAS_IA_PERMITIDAS.join(', ');
  return `Eres un asistente que extrae información de reportes de incidencias urbanas y devuelve un único objeto JSON.

INSTRUCCIONES CRÍTICAS:
1. Tu salida debe ser SOLO un objeto JSON parseable (sin markdown, sin texto antes ni después).
2. Si el texto del usuario NO es un reporte urbano válido (incidencia, daño, problema en la vía pública), devuelve exactamente este objeto (una sola línea o varias, pero solo JSON):
   {"error":"no es un reporte valido"}

3. Para reportes VÁLIDOS, incluye EXACTAMENTE estas claves en minúscula:
   - "titulo": máximo 100 caracteres, descriptivo. Ejemplo: "Basura acumulada en esquina"
   - "descripcion": resumen del reporte, máximo 500 caracteres, específico
   - "categoria": una sola cadena en minúscula, una de: ${listaCats}
   - "ubicacion": dirección o lugar mencionado; si no hay dato, el texto exacto "No especificada"

4. Significado de categorías (elige una):
   - basura: acumulación, desperdicios, desorden
   - ruido: molestias sonoras, música, construcción
   - contaminacion: aire, agua, polvo, humo
   - seguridad: alumbrado, vandalismo, peligro

5. Toda referencia geográfica (calle, barrio, parque, comercio) va en "ubicacion".

6. Ejemplo de respuesta válida (solo ilustrativo):
   {"titulo":"...","descripcion":"...","categoria":"basura","ubicacion":"..."}`;
}

/** Contenido del turno user: solo el texto a clasificar (el system ya tiene las reglas). */
function construirMensajeUsuario(mensajeCiudadano) {
  return `Analiza el siguiente texto del ciudadano y responde únicamente con el objeto JSON definido en tus instrucciones (reporte válido o {"error":"no es un reporte valido"}):

---
${mensajeCiudadano.trim()}
---`;
}

/**
 * Ollama devuelve content como string o, en mensajes multimodales, como array de partes.
 */
function extraerContenidoAssistant(data) {
  const c = data?.message?.content;
  if (typeof c === 'string') {
    return c.trim();
  }
  if (Array.isArray(c)) {
    return c
      .map((p) => {
        if (typeof p === 'string') {
          return p;
        }
        if (p && typeof p.text === 'string') {
          return p.text;
        }
        return '';
      })
      .join('')
      .trim();
  }
  return '';
}

/** Quita razonamiento envuelto en etiquetas que algunos modelos insertan antes del JSON. */
function quitarBloquesRazonamiento(texto) {
  if (!texto || typeof texto !== 'string') {
    return '';
  }
  return texto
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/<think>[\s\S]*?<\/redacted_thinking>/gi, '')
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, '')
    .trim();
}

function extraerTextoDeRespuestaOllama(data) {
  const texto = quitarBloquesRazonamiento(extraerContenidoAssistant(data));
  if (!texto) {
    const motivo =
      typeof data?.error === 'string'
        ? data.error
        : data?.message && !extraerContenidoAssistant(data)
          ? JSON.stringify(data.message)
          : 'sin texto';
    throw new LlmParseError(
      `Respuesta vacía o inválida de Ollama (${motivo}). Revisa OLLAMA_MODEL (debe coincidir con "ollama list").`
    );
  }
  return texto;
}

function interpretarRespuestaComoReporte(textoCrudo) {
  const textoLimpio = limpiarTextoParaJson(quitarBloquesRazonamiento(textoCrudo));
  let objeto = parsearJsonSeguro(textoLimpio);
  objeto = coerceCamposStrings(objeto);

  if (objeto.error !== undefined && objeto.error !== null) {
    const errMsg = String(objeto.error).toLowerCase();
    if (errMsg.includes('no es un reporte valido')) {
      throw new InvalidReportError(
        'El texto no describe un reporte urbano válido. Sé más específico sobre el problema.'
      );
    }
    throw new InvalidReportError(String(objeto.error));
  }

  validarCamposReporte(objeto);

  return {
    titulo: objeto.titulo.trim(),
    descripcion: objeto.descripcion.trim(),
    categoria: normalizarCategoria(objeto.categoria),
    ubicacion: objeto.ubicacion.trim()
  };
}

async function llamarChatOllama(messages, formatJson) {
  const base = baseUrlNormalizada();
  const model = nombreModelo();
  const url = `${base}/api/chat`;

  const body = {
    model,
    messages,
    stream: false,
    options: { temperature: 0.2 }
  };
  if (formatJson) {
    body.format = 'json';
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());

  let respuestaHttp;
  try {
    respuestaHttp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body)
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new LlmServiceError(
        'Tiempo de espera agotado al llamar a Ollama. Prueba OLLAMA_TIMEOUT_MS o un modelo más rápido.'
      );
    }
    console.error('Error de red al llamar a Ollama:', err);
    throw new LlmServiceError(
      `No se pudo conectar con Ollama en ${base}. ¿Está ejecutándose (ollama serve)?`
    );
  } finally {
    clearTimeout(timer);
  }

  const cuerpo = await respuestaHttp.json().catch(() => ({}));

  if (!respuestaHttp.ok) {
    const detalle = cuerpo?.error || cuerpo?.message || respuestaHttp.statusText;
    console.error('Ollama API error:', respuestaHttp.status, detalle);
    throw new LlmServiceError(
      `Error de Ollama (${respuestaHttp.status}): ${detalle}. Comprueba que el modelo "${model}" exista (ollama pull ${model}).`
    );
  }

  if (typeof cuerpo?.error === 'string' && cuerpo.error.trim()) {
    throw new LlmServiceError(
      `${cuerpo.error}. Modelo configurado: "${model}" en ${base}`
    );
  }

  return cuerpo;
}

/**
 * @param {string} mensaje - Texto libre del usuario
 * @returns {Promise<{ titulo: string, descripcion: string, categoria: string, ubicacion: string }>}
 */
async function generarReporteDesdeTexto(mensaje) {
  if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
    throw new InvalidReportError('El mensaje está vacío');
  }

  const messages = [
    { role: 'system', content: construirMensajeSistema() },
    { role: 'user', content: construirMensajeUsuario(mensaje) }
  ];

  const conJson = preferirFormatoJsonExplicito();
  /** Orden: primero sin JSON forzado (máxima compatibilidad); si falla el parse, un intento con format json. */
  const ordenFormato = conJson ? [false, true] : [false];

  let ultimoParse = null;
  for (const formatJson of ordenFormato) {
    try {
      const cuerpo = await llamarChatOllama(messages, formatJson);
      const textoCrudo = extraerTextoDeRespuestaOllama(cuerpo);
      return interpretarRespuestaComoReporte(textoCrudo);
    } catch (err) {
      if (err instanceof InvalidReportError || err instanceof LlmServiceError) {
        throw err;
      }
      ultimoParse = err;
      if (formatJson === ordenFormato[ordenFormato.length - 1]) {
        throw err;
      }
      console.warn(
        `Ollama: parseo fallido con format=${formatJson}; reintentando con format=${!formatJson}…`,
        err.message
      );
    }
  }

  throw ultimoParse || new LlmParseError('No se pudo obtener datos del modelo');
}

module.exports = {
  generarReporteDesdeTexto,
  InvalidReportError,
  LlmParseError,
  LlmServiceError
};
