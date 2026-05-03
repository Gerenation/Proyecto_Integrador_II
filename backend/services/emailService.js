const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: pass ? { user, pass } : undefined
  });

  return transporter;
}

/**
 * Confirmación de reporte al correo del ciudadano (no bloquea si falla).
 */
async function enviarConfirmacionReporte({ to, nombre, reporte }) {
  const tx = getTransporter();
  if (!tx || !to) {
    console.warn('[email] SMTP no configurado (SMTP_HOST / SMTP_USER). Se omite envío.');
    return { enviado: false, motivo: 'smtp_no_configurado' };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const titulo = reporte.titulo || 'Sin título';
  const estado = reporte.estado || 'Pendiente';

  const html = `
    <p>Hola ${nombre || ''},</p>
    <p>Hemos registrado tu reporte en <strong>SIVUR</strong> (Emvarias).</p>
    <ul>
      <li><strong>Título:</strong> ${titulo}</li>
      <li><strong>Estado:</strong> ${estado}</li>
      <li><strong>Categoría:</strong> ${reporte.categoria || '—'}</li>
      <li><strong>Ubicación:</strong> ${reporte.ubicacion || '—'}</li>
    </ul>
    <p>Gracias por contribuir al cuidado del territorio.</p>
  `;

  try {
    await tx.sendMail({
      from,
      to,
      subject: 'SIVUR — Confirmación de reporte',
      text: `Reporte registrado: ${titulo}. Estado: ${estado}.`,
      html
    });
    return { enviado: true };
  } catch (err) {
    console.error('[email] Error al enviar confirmación:', err.message);
    return { enviado: false, motivo: err.message };
  }
}

module.exports = { enviarConfirmacionReporte, getTransporter };
