# SIVUR - Sistema Integrado de Vigilancia Urbana y Responsabilidad Ambiental

Sistema web para reporte y seguimiento de incidencias urbanas, alineado con el enfoque de ciudades sostenibles.

## Demo local del proyecto

- Frontend (Vite): `http://localhost:5173`
- Backend (Express): `http://localhost:5001`
- API base: `http://localhost:5001/api`

## Objetivo del Sprint 1 (MVP)

Implementar una plataforma funcional con:

- Registro e inicio de sesión de usuarios.
- Roles `ciudadano` y `admin`.
- Creación y listado de reportes.
- Cambio de estado de reportes (solo admin).
- UI moderna, responsive y consistente.
- Estructura lista para futuras integraciones (ej. chatbot e imágenes en backend).

## Funcionalidades implementadas

### Funcionalidad de negocio

- Registro de usuario ciudadano y administrador.
- Login, persistencia de sesión y logout.
- Creación de reportes con: título, categoría, ubicación, descripción.
- Adjuntar imagen en reporte (mock en frontend, preparado para integración backend real).
- Listado de reportes por rol:
  - Ciudadano: solo sus reportes.
  - Admin: todos los reportes.
- Cambio de estado (`Pendiente`, `En proceso`, `Resuelto`) para administradores.

### UI/UX y frontend

- Sistema de tema claro/oscuro con persistencia en `localStorage`.
- Navegación principal por secciones:
  - Crear reportes
  - Ver reportes atendidos
  - Perfil
  - Chatbot (placeholder)
- Sección desacoplada para IA con texto: **"Introducción de IA más adelante"**.
- Diseño responsive (móvil, tablet, escritorio).
- Sistema visual coherente:
  - Paleta corporativa con verde principal y naranja de acento.
  - Variables CSS centralizadas.
  - Microinteracciones en botones, inputs y tarjetas.
  - Login/registro integrados al mismo sistema visual del dashboard.

## Stack tecnológico

- **Frontend:** React + Vite + Axios
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB + Mongoose
- **Autenticación:** JWT + bcryptjs
- **Arquitectura:** Cliente-Servidor (API REST)

## Estructura del proyecto

```text
SIVU_Primera_Prueba/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reporteController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Usuario.js
│   │   └── Reporte.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reporteRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   ├── Instalar-MongoDB.ps1
│   └── Iniciar-MongoDB.ps1
├── run_project.bat
└── README.md
```

## Requisitos previos

- Node.js 18+ (recomendado)
- npm
- MongoDB local o MongoDB Atlas

## Ejecución rápida (Windows)

1. Asegúrate de tener MongoDB corriendo (ver sección [MongoDB](#mongodb)).
2. En la raíz del proyecto, ejecuta:

```powershell
.\run_project.bat
```

3. Se abrirán dos ventanas (backend y frontend).
4. Abre `http://localhost:5173`.

## Ejecución manual

### Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run dev
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## Variables de entorno

Archivo: `backend/.env`

Ejemplo mínimo:

```env
PORT=5001
JWT_SECRET=tu_secreto_super_seguro
```

`MONGODB_URI` es opcional:

- Si la defines, se usa esa conexión.
- Si **no** la defines, el backend usa una URI por usuario de Windows:
  - `mongodb://127.0.0.1:27017/sivu_<usuario>`

Esto evita conflictos de base de datos entre equipos/desarrolladores en local.

## MongoDB

Necesitas MongoDB escuchando en `localhost:27017`.

### Opción A - Local en Windows

- Instalar (PowerShell como administrador):

```powershell
.\scripts\Instalar-MongoDB.ps1
```

- Iniciar MongoDB local con datos en carpeta del proyecto:

```powershell
.\scripts\Iniciar-MongoDB.ps1
```

### Opción B - MongoDB Atlas

1. Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Obtén la cadena de conexión.
3. Define `MONGODB_URI` en `backend/.env`.

## Modelos de datos

### Usuario

- `nombre` (String, requerido)
- `email` (String, requerido, único)
- `password` (String, requerido, encriptado)
- `rol` (`ciudadano | admin`)

### Reporte

- `titulo` (String, requerido)
- `descripcion` (String, requerido)
- `categoria` (`Basura | Alumbrado | Hueco | Inseguridad | Otro`)
- `ubicacion` (String, requerido)
- `estado` (`Pendiente | En proceso | Resuelto`)
- `fecha` (Date)
- `usuarioId` (ObjectId -> Usuario)
- `imagenUrl` (futuro en backend; actualmente mock frontend)

## Roles y permisos

### Ciudadano

- Crear reportes.
- Ver solo sus reportes.
- No cambiar estado de reportes.

### Admin

- Crear reportes.
- Ver todos los reportes.
- Cambiar estado de cualquier reporte.

## API REST (resumen)

### Autenticación

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `GET /api/auth/perfil` (requiere token)

### Reportes

- `POST /api/reportes` (requiere token)
- `GET /api/reportes` (requiere token)
- `GET /api/reportes/:id` (requiere token)
- `PATCH /api/reportes/:id/estado` (requiere token + admin)

## Arquitectura y buenas prácticas aplicadas

- Backend con patrón MVC.
- Frontend modular por capas (`pages`, `components`, `services`, `context`, `styles`).
- Estado de autenticación centralizado en `AuthContext`.
- Tema de UI centralizado en `ThemeContext`.
- Estilos escalables con variables CSS y diseño responsive.
- Preparación para integración futura de imagen real (backend/cloud).

## Equipo de desarrollo

- Daniel Santiago Rodríguez Gerena
- Juan José Oquendo Jaramillo

## Próximos pasos

- Integración real de subida de imágenes en backend (ej. Cloudinary/S3).
- Geolocalización y mapas para reportes.
- Notificaciones y flujo de atención.
- Métricas y dashboard estadístico.

## Licencia

Proyecto académico para fines educativos.
