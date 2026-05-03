/**
 * ---------------------------------------------------------------------------
 * VARIABLES DE ENTORNO (dotenv)
 * ---------------------------------------------------------------------------
 * Este proyecto usa CommonJS (`require`), equivalente práctico a:
 *   import dotenv from 'dotenv';
 *   dotenv.config();
 *
 * `dotenv.config()` lee el archivo `.env` en la carpeta backend/ y copia cada
 * línea KEY=valor al objeto global `process.env`.
 *
 * Ejemplo: OLLAMA_BASE_URL=http://localhost:11434  →  process.env.OLLAMA_BASE_URL
 *
 * Así cualquier archivo puede leer secretos sin hardcodearlos. El archivo `.env`
 * no debe subirse a Git (está listado en .gitignore).
 * ---------------------------------------------------------------------------
 */
require('dotenv').config();

const conectarDB = require('./config/database');
const app = require('./app');

/**
 * Punto de arranque del proceso Node: variables de entorno, MongoDB y servidor HTTP.
 *
 * La definición de rutas y middlewares vive en `app.js` para separar
 * configuración de la aplicación del binario que escucha el puerto.
 */
conectarDB();

// Mismo valor por defecto que frontend/vite.config.js (proxy /api → localhost:5001)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
