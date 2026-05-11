# SIVUR - Sistema Integrado de Vigilancia Urbana y Responsabilidad Ambiental

**Plataforma web colaborativa con IA local para reporte y seguimiento de incidencias urbanas.** 

Ciudadanos pueden reportar problemas urbanos (basura, baches, alumbrado, ruido, inseguridad, contaminación) utilizando **3 modos innovadores:**
1. **Modo Manual** - Formulario tradicional  
2. **Modo IA (Ollama + Llama 3)** - Texto libre procesado automáticamente 
3. **Modo Voz** - Dictado en español con Web Speech API 

Administradores gestionan y dan seguimiento a reportes con datos completos del reportante. Sprint 3 completo con gestión avanzada de perfiles e integración de IA local.

**Versión actual:** Sprint 3   
**Stack:** React 18 + Vite | Express.js | MongoDB + GridFS | JWT | Ollama (Llama 3) | Nodemailer  
**Estado:** MVP funcional - Producción-ready (pruebas de aceptación) 

---

##  Tabla de Contenidos

- [Demo local](#demo-local-del-proyecto)
- [Objetivos por Sprint](#objetivos-por-sprint)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
- [Modos de creación de reportes](#modos-de-creación-de-reportes)
- [Integración IA (Ollama + Llama 3)](#integración-ia-ollama--llama-3)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Ejecución rápida](#ejecución-rápida)
- [Modelos de datos](#modelos-de-datos)
- [Roles y permisos](#roles-y-permisos)
- [API REST](#api-rest)
- [Casos de uso](#casos-de-uso)
- [Configuración](#configuración)
- [Próximos pasos](#próximos-pasos)

---

##  Demo local del proyecto

- **Frontend (Vite + React):** `http://localhost:5173`
- **Backend (Express):** `http://localhost:5001`
- **API base:** `http://localhost:5001/api`
- **Ollama (opcional):** `http://localhost:11434`

**Características principales disponibles:**
-  Registro/Login con JWT
-  Crear reportes en **3 modos** (manual, IA con Llama 3, voz)
-  Editar perfil (nombre, dirección, foto)
-  Cambiar estado de reportes (admin)
-  Ver información completa del reportante
-  Tema claro/oscuro
-  Notificaciones por email

---

##  Qué hay de nuevo en Sprint 3

###  Modos de Creación de Reportes (Innovador)
- **Modo Manual:** Formulario tradicional con validación
- **Modo IA (Ollama):** Procesa texto libre con Llama 3 local 
  - Extrae automáticamente: título, descripción, categoría, ubicación
  - Las imágenes **NUNCA** se envían a IA (privacidad garantizada)
  - Fallback automático si Ollama no disponible
- **Modo Voz:** Dictado en español con Web Speech API 
  - Texto → procesamiento igual a Modo IA
  - Editable antes de enviar

###  Gestión Avanzada de Perfiles
- Editar nombre (antes solo dirección)
- Subir/cambiar foto de perfil
- Fotos cargadas correctamente desde GridFS
- Ruta pública: `/api/files/:id/public` (sin autenticación)

###  Información Completa del Reportante
En cada reporte ahora se muestra:
- Nombre, email, dirección
- Tipo y número de identificación
- Foto de perfil del reportante
- Disponible en API completo

###  Mejoras UX
- Tema claro/oscuro persistente
- Animaciones suaves (Framer Motion)
- Indicadores de carga
- Toast notifications mejoradas
- Voice dictation en tiempo real

---

##  Objetivos por Sprint

### Sprint 1  (MVP Inicial)

 **Completado:**
- Registro e inicio de sesión de usuarios
- Roles `ciudadano` y `admin`
- Creación y listado de reportes
- Cambio de estado de reportes (solo admin)
- UI moderna, responsive y consistente
- Estructura lista para futuras integraciones

### Sprint 2  (Mejoras de Seguridad y Almacenamiento)

 **Completado:**
- GridFS para almacenamiento de imágenes en MongoDB
- Fotos de perfil con carga de archivos
- Imágenes en reportes
- Notificaciones por correo (Nodemailer)
- **Integración con Ollama para procesamiento de texto con IA local (Llama 3)**

### Sprint 3  (Gestión de Perfiles y IA Avanzada) **← VERSIÓN ACTUAL**

 **Completado:**
- **Edición de nombre de usuario** (antes solo dirección)
- **Cargar y editar fotos de perfil correctamente**
- **Ruta pública para fotos** (`/api/files/:id/public`) sin autenticación
- **Información completa del reportante en cada reporte:**
  - Nombre, correo, dirección
  - Tipo de documento y número de identificación
- **Mejor UX:** Modal de edición de perfil mejorado
- **3 modos de creación de reportes:**
  - Modo manual (formulario tradicional)
  - **Modo IA (Ollama + Llama 3):** Procesa descripción en texto libre
  - **Modo voz:** Web Speech API (dictado en español)
- **Procesamiento inteligente con Ollama:**
  - Extrae automáticamente: título, descripción, categoría, ubicación
  - Nunca envía imágenes a IA (privacidad)
  - Fallback graceful si Ollama no está disponible
  - Timeout configurable (120s default)
- **Mejoras de UX:**
  - Tema claro/oscuro persistente
  - Animaciones con Framer Motion
  - Voice dictation en español con correcciones en tiempo real
  - Indicadores de carga y progreso

---

##  Funcionalidades implementadas

###  Modos de Creación de Reportes (Sprint 3)

SIVUR ofrece **3 modos innovadores** para crear reportes:

#### Modo 1 - Manual (Tradicional)
- Llenar formulario completo: **título, descripción, categoría, ubicación**
- Subir foto opcional (JPEG, PNG, GIF, WebP)
- Validación de campos mínimos
- Ideal para reportes detallados

#### Modo 2️ - IA Inteligente (Ollama + Llama 3) 
- Escribir **texto libre/natural:** "Hay un hueco grande en la calle 5, es peligroso"
- **Backend invoca Ollama locally** (Llama 3 por defecto)
- IA **extrae automáticamente:**
  - **Título** → "Hueco en calle 5"
  - **Descripción** → "Hay un hueco grande que es peligroso"
  - **Categoría** → "Hueco" (de 8 opciones)
  - **Ubicación** → "Calle 5" (o ubicación más específica)
-  **Las imágenes NUNCA se envían a IA** (privacidad)
-  **Fallback automático** si Ollama no disponible
-  **Timeout de 120 segundos**

#### Modo 3️ - Dictado por Voz  (Nuevo en Sprint 3)
- **Web Speech API** (navegador nativo)
- 🇪🇸 **Español** como idioma principal
- Convertir **voz → texto** automáticamente
- Editar transcripción antes de enviar
- Procesado igual que Modo IA (texto libre)
-  Solo en navegadores compatibles (Chrome, Edge, Firefox)

---

##  Integración IA (Ollama + Llama 3)

### Configuración

1. **Instalar Ollama** desde [ollama.ai](https://ollama.ai)
2. **Descargar modelo Llama 3:**
   ```bash
   ollama pull llama3
   ```
3. **Iniciar Ollama:**
   ```bash
   ollama serve
   ```
4. **Configurar backend** (ver [Configuración](#configuración))

### Características

- **Modelo local:** Funciona sin conexión a internet
- **Privacidad:** Datos nunca salen del servidor
- **Bajo latency:** ~1-5 segundos por reporte (depende de hardware)
- **Configurable:** Cambiar modelo, timeout, endpoint en `.env`
- **Graceful degradation:** Si falla IA, reportes pueden crearse manualmente
- **JSON parsing:** Extrae campos estructurados con precisión

### Ejemplo de procesamiento

**Input:**
```
"Reporto basura acumulada en la esquina de Calle 50 con Carrera 10, 
hay restos de construcción y vidrios rotos. Esto es un peligro para los peatones"
```

**Output (por Llama 3):**
```json
{
  "titulo": "Basura acumulada en esquina Calle 50 y Carrera 10",
  "descripcion": "Hay restos de construcción y vidrios rotos que ponen en peligro a peatones",
  "categoria": "Basura",
  "ubicacion": "Calle 50 con Carrera 10"
}
```

### Soporte de Errores

- `InvalidReportError` → Campos requeridos faltantes
- `LlmParseError` → IA no pudo extraer campos
- `LlmServiceError` → Conexión a Ollama fallida
- **Fallback:** Crear reporte en modo manual o rechazar con mensaje claro

---

##  Funcionalidades implementadas

### Autenticación y Gestión de Usuarios

#### Registro
-  Registro de ciudadanos y administradores
-  Validación de email único
-  Contraseña encriptada con bcryptjs (10 salts)
-  Campos requeridos: nombre, email, contraseña, dirección, tipo y número de identificación
-  Tipo de identificación: CC, Pasaporte, Extranjería
-  Token JWT automático después del registro (válido por 30 días)

#### Login
-  Inicio de sesión con email y contraseña
-  Generación de JWT de 30 días
-  Persistencia en `localStorage` del navegador
-  Restauración automática de sesión al recargar página

#### Perfil de Usuario
-  **Editar nombre** (mínimo 2 caracteres)
-  Editar dirección
-  **Subir y editar foto de perfil** (convertida a base64, almacenada en GridFS)
-  Ver datos de identificación (no editable desde perfil)
-  Ver rol actual (Ciudadano / Administrador)
-  **Fotos de perfil cargan correctamente** en rutas públicas

#### Logout
-  Limpiar token y datos de usuario
-  Redirigir a login

### Gestión de Reportes

#### Crear Reportes
-  **Modo manual:** Ingresar título, descripción, categoría, ubicación, imagen (opcional)
-  **Modo con IA (Ollama + Llama 3):** Procesar texto libre con modelo local LLM 
-  **Modo voz (dictado en español):** Web Speech API + procesamiento como IA 
-  Categorías disponibles: Basura, Alumbrado, Hueco, Inseguridad, Ruido, Contaminación, Seguridad, Otro
-  Validación de campos mínimos
-  Fallback automático si Ollama no está disponible
-  Adjuntar imagen (máx ~5 MB, almacenada en GridFS)
-  **Las imágenes NUNCA se envían a IA** (privacidad garantizada)

#### Listado de Reportes
-  **Ciudadano:** Ve solo sus reportes
-  **Administrador:** Ve todos los reportes del sistema
-  Filtros disponibles:
  - Por estado (Pendiente, En proceso, Resuelto)
  - Por búsqueda de título/descripción
  - Por rango de fechas
  - Por nombre de usuario (solo admin)
-  **Información completa del reportante:**
  - Nombre, correo, dirección
  - Tipo y número de identificación
  - Fecha del reporte

#### Cambiar Estado del Reporte
-  **Solo administrador** puede cambiar estado
-  Estados disponibles: Pendiente → En proceso → Resuelto
-  Cambio visual inmediato en la UI
-  Notificación automática al ciudadano por correo

#### Notificaciones por Correo
-  Confirmación de reporte creado
-  Datos incluidos: título, estado, categoría, ubicación, nombre y email del reportante
-  Servicio opcional (graceful degradation si SMTP no configurado)
-  Envío **asincrónico** (no bloquea la operación)
-  Notificación automática cuando estado cambia (pendiente → resuelto)

### Gestión de Archivos (GridFS)

#### Fotos de Perfil
-  Almacenadas en MongoDB GridFS (colección `sivur_fs`)
-  Ruta **pública** (sin autenticación): `/api/files/:id/public`
-  Cache de 24 horas para optimizar rendimiento
-  Eliminación de foto anterior al subir nueva
-  Metadatos: tipo ('perfil'), userId

#### Imágenes de Reportes
-  Almacenadas en MongoDB GridFS
-  Ruta **autenticada** (requiere JWT): `/api/files/:id`
-  Verificación de permisos: creador, admin, o usuario del reporte
-  Metadatos: tipo ('reporte'), creatorId

### UI/UX y Frontend

#### Tema y Diseño
-  Sistema de tema claro/oscuro con persistencia en `localStorage`
-  Diseño responsive (móvil, tablet, escritorio)
-  Paleta corporativa:
  - Verde principal (#1b854d)
  - Naranja de acento (#f97316)
  - Colores neutros escalables
-  Variables CSS centralizadas
-  Microinteracciones en botones, inputs, tarjetas
-  Animaciones suaves con Framer Motion

#### Navegación Principal
-  Crear reporte
-  Listar reportes / Reportes atendidos
-  Perfil de usuario
-  Administración (solo admin)
-  Chatbot (placeholder para futuras integraciones)

#### Componentes Reutilizables
-  Button (primario, secundario, ghost)
-  Card (contenedores flexibles)
-  Input (texto con validación)
-  Modal (edición de perfil, confirmaciones)
-  SelectField (dropdowns)
-  Textarea (descripciones largas)
-  PageLoader (pantalla de carga)
-  UserAvatar (foto con fallback a inicial)

#### Notificaciones
-  Toast notifications (react-hot-toast)
-  Posicionamiento superior
-  Estilos adaptados al tema actual
-  Duración: 3.8 segundos

#### Dictado por Voz  (Sprint 3)
-  **Web Speech API** integrada en navegador
-  🇪🇸 **Español** como idioma de reconocimiento
-  Actualización en tiempo real mientras habla
-  Editar transcripción antes de enviar
-  Control de inicio/parada
-  Fallback para navegadores no compatibles
-  Manejo de errores (micrófono bloqueado, sin permisos)

#### Administración (Admin Panel)
-  Listar usuarios (filtrar por rol)
-  Ver detalles de cada usuario
-  Acceso a reportes de usuario específico
-  Cambiar estado de reportes desde lista

---

##  Estructura del proyecto

```
SIVU_Primera_Prueba/
│
├── backend/
│   ├── config/
│   │   └── database.js                 # Conexión a MongoDB
│   │
│   ├── controllers/
│   │   ├── authController.js           # Registro, login, perfil (GET/PATCH)
│   │   ├── reporteController.js        # CRUD reportes, cambiar estado
│   │   ├── adminController.js          # Listar usuarios
│   │   └── fileController.js           # Descargar archivos (público/autenticado)
│   │
│   ├── middleware/
│   │   └── auth.js                     # JWT verification, role checks
│   │
│   ├── models/
│   │   ├── Usuario.js                  # Schema usuario + bcrypt
│   │   └── Reporte.js                  # Schema reporte
│   │
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth/*
│   │   ├── reporteRoutes.js            # /api/reportes/*
│   │   ├── adminRoutes.js              # /api/admin/*
│   │   └── fileRoutes.js               # /api/files/*
│   │
│   ├── services/
│   │   ├── emailService.js             # Nodemailer (Confirmación reportes)
│   │   ├── gridfsStore.js              # Subir/descargar desde GridFS
│   │   ├── ollama.js                   # Cliente Ollama (IA local)
│   │   └── (otros servicios futuros)
│   │
│   ├── utils/
│   │   ├── imageBuffer.js              # Convertir base64 a Buffer
│   │   └── serializers.js              # Serializar Usuario + Reporte
│   │
│   ├── app.js                          # Express app (middlewares, rutas)
│   ├── server.js                       # Punto de entrada (dotenv, DB, listen)
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── branding/                   # Logos, assets
│   │
│   ├── src/
│   │   ├── app/
│   │   │   └── App.jsx                 # Raíz de rutas y proveedores
│   │   │
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminUsuariosPanel.jsx
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── branding/
│   │   │   │   └── EmvariasLogo.jsx
│   │   │   ├── chatbot/
│   │   │   │   └── ChatbotPlaceholder.jsx
│   │   │   ├── layout/
│   │   │   │   ├── DashboardHeader.jsx
│   │   │   │   ├── MainNavigation.jsx
│   │   │   │   ├── ProfilePanel.jsx    # Editar perfil + foto
│   │   │   │   ├── ThemeToggle.jsx
│   │   │   │   └── UserAvatar.jsx
│   │   │   ├── reportes/
│   │   │   │   ├── FormularioReporte.jsx
│   │   │   │   └── ListaReportes.jsx   # Mostrar reportes + datos reportante
│   │   │   └── ui/ (componentes reutilizables)
│   │   │
│   │   ├── constants/
│   │   │   ├── dashboardNav.js
│   │   │   ├── reporteCategories.js
│   │   │   └── tipoIdentificacion.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Sesión JWT + usuario
│   │   │   └── ThemeContext.jsx        # Tema claro/oscuro
│   │   │
│   │   ├── hooks/
│   │   │   ├── useReducedMotion.js
│   │   │   └── useVoiceDictation.js
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Registro.jsx
│   │   │   └── dashboard/
│   │   │       └── Dashboard.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                  # Cliente Axios + interceptores
│   │   │   ├── authService.js
│   │   │   ├── reporteService.js
│   │   │   └── adminService.js
│   │   │
│   │   ├── styles/
│   │   │   └── app.css                 # Estilos centralizados + variables CSS
│   │   │
│   │   ├── utils/
│   │   │   └── mediaUrl.js             # Resolver URLs de archivos
│   │   │
│   │   ├── main.jsx
│   │   └── (otros archivos)
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   ├── Instalar-MongoDB.ps1
│   └── Iniciar-MongoDB.ps1
│
├── run_project.bat                     # Script de inicio rápido (Windows)
└── README.md
```

---

##  Stack tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Base de datos:** MongoDB 4+
- **ORM:** Mongoose 8
- **Autenticación:** JWT (jsonwebtoken) + bcryptjs
- **Almacenamiento:** GridFS (archivos en MongoDB)
- **Email:** Nodemailer
- **IA/LLM:** Ollama (API local)
- **Cors:** cors middleware

### Frontend
- **Librería UI:** React 18
- **Build tool:** Vite 5
- **HTTP Client:** Axios
- **Ruteo:** React Router DOM 6
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React
- **Notificaciones:** react-hot-toast
- **Reconocimiento de voz:** react-speech-recognition

### DevTools
- **Backend:** Nodemon (dev)
- **Frontend:** ESLint, Prettier (opcional)

---

##  Requisitos previos

- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior
- **MongoDB** 4.0+ (local o Atlas)
- **Windows 10+** (para usar `run_project.bat`)

### Verificar instalación

```bash
node --version    # v18.x.x
npm --version     # 9.x.x
mongod --version  # v4.x.x
```

---

##  Ejecución rápida

### Método 1: Automatizado (Windows)

1. Asegurate de que MongoDB esté corriendo
2. En la raíz del proyecto:

```batch
run_project.bat
```

Se abrirán dos ventanas automáticamente (backend en 5001, frontend en 5173).

### Método 2: Manual

#### Backend

```bash
cd backend
npm install
cp .env.example .env          # Editar con tus valores
npm run dev                   # Inicia en puerto 5001
```

#### Frontend

```bash
cd frontend
npm install
npm run dev                   # Inicia en puerto 5173
```

#### Acceso

Abre `http://localhost:5173` en tu navegador.

---

##  Modelos de datos

### Usuario

```javascript
{
  _id: ObjectId,
  nombre: String,              // Editable
  email: String,              // Único, no editable
  password: String,           // Encriptado con bcrypt
  rol: Enum['ciudadano', 'admin'],
  direccion: String,          // Editable
  tipoIdentificacion: Enum['CC', 'Pasaporte', 'Extranjeria'],
  numeroIdentificacion: String, // Único, no editable
  fotoPerfilFileId: ObjectId, // Referencia a GridFS
  createdAt: Date,
  updatedAt: Date
}
```

### Reporte

```javascript
{
  _id: ObjectId,
  titulo: String,             // 3-100 caracteres
  descripcion: String,        // 10+ caracteres
  categoria: Enum['Basura', 'Alumbrado', 'Hueco', 'Inseguridad', 'Ruido', 'Contaminacion', 'Seguridad', 'Otro'],
  ubicacion: String,
  estado: Enum['Pendiente', 'En proceso', 'Resuelto'],
  fecha: Date,
  usuarioId: ObjectId,        // Referencia a Usuario (poblado)
  imagenFileId: ObjectId,     // Referencia a GridFS (opcional)
  imagen: String,             // Legado (base64, deprecado)
  createdAt: Date,
  updatedAt: Date
}
```

### Serialización en respuestas API

#### Usuario (usuarioPublico)
```json
{
  "id": "...",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "rol": "ciudadano",
  "direccion": "Calle 5 #23-45",
  "tipoIdentificacion": "CC",
  "numeroIdentificacion": "1234567890",
  "fotoPerfilUrl": "/api/files/507f1f77bcf86cd799439011/public"
}
```

#### Reporte (serializeReporte)
```json
{
  "_id": "...",
  "titulo": "Hueco en calle principal",
  "descripcion": "Hay un hueco grande en...",
  "categoria": "Hueco",
  "ubicacion": "Calle 5 entre carreras 3 y 4",
  "estado": "Pendiente",
  "fecha": "2026-05-03T14:30:00Z",
  "usuarioId": {...},           // Poblado con datos usuario
  "usuarioInfo": {
    "id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "direccion": "Calle 5 #23-45",
    "tipoIdentificacion": "CC",
    "numeroIdentificacion": "1234567890"
  },
  "imagenUrl": "/api/files/507f1f77bcf86cd799439012",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 👥 Roles y permisos

### Ciudadano

| Acción | Permitido | Notas |
|--------|----------|-------|
| Registrarse | ✅ | Rol por defecto |
| Editar perfil | ✅ | Nombre, dirección, foto |
| Crear reporte | ✅ | Solo el suyo |
| Ver reportes | ✅ | Solo los suyos |
| Cambiar estado | ❌ | |
| Ver todos los reportes | ❌ | |
| Listar usuarios | ❌ | |
| Panel admin | ❌ | |

### Administrador

| Acción | Permitido | Notas |
|--------|----------|-------|
| Registrarse | ✅ | Requiere rol en signup |
| Editar perfil | ✅ | Nombre, dirección, foto |
| Crear reporte | ✅ | Como ciudadano normal |
| Ver reportes | ✅ | Todos del sistema |
| Cambiar estado | ✅ | Cualquier reporte |
| Ver todos los reportes | ✅ | Filtro por usuario, estado, fecha |
| Listar usuarios | ✅ | Filtro por rol |
| Panel admin | ✅ | Acceso completo |

---

##  API REST

### Base URL
```
http://localhost:5001/api
```

### Headers
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

---

###  Autenticación

#### POST `/auth/registro`
Crear nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "MiContraseña123!",
  "rol": "ciudadano",
  "direccion": "Calle 5 #23-45",
  "tipoIdentificacion": "CC",
  "numeroIdentificacion": "1234567890"
}
```

**Response:** 201 Created
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nombre": "Juan Pérez",
    ...
  }
}
```

#### POST `/auth/login`
Iniciar sesión.

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "MiContraseña123!"
}
```

**Response:** 200 OK
```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {...}
}
```

#### GET `/auth/perfil`
Obtener perfil del usuario autenticado.

**Headers:** Requiere `Authorization: Bearer <token>`

**Response:** 200 OK
```json
{
  "usuario": {...}
}
```

#### PATCH `/auth/perfil`
Actualizar perfil (nombre, dirección, foto).

**Headers:** Requiere `Authorization: Bearer <token>`

**Body:**
```json
{
  "nombre": "Juan Carlos",
  "direccion": "Carrera 3 #5-20",
  "fotoPerfil": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response:** 200 OK
```json
{
  "mensaje": "Perfil actualizado",
  "usuario": {...}
}
```

---

###  Reportes

#### POST `/reportes`
Crear reporte (3 modos: manual, IA, voz).

**Modo Manual:**
```json
{
  "modo": "manual",
  "titulo": "Hueco en calle principal",
  "descripcion": "Hay un hueco grande que pone en peligro...",
  "categoria": "Hueco",
  "ubicacion": "Calle 5 entre carreras 3 y 4",
  "imagen": "data:image/jpeg;base64,..."
}
```

**Modo IA (Ollama + Llama 3):**
```json
{
  "mensaje": "Hay un hueco grande en la calle 5, es peligroso",
  "imagen": "data:image/jpeg;base64,..."
}
```

**Modo Voz (Web Speech API → IA):**
```json
{
  "mensaje": "Reporto acumulación de basura en la esquina de la iglesia",
  "modoVoz": true,
  "imagen": "data:image/jpeg;base64,..."
}
```

**Response:** 201 Created
```json
{
  "mensaje": "Reporte creado exitosamente",
  "reporte": {...},
  "iaDisponible": true,
  "modoUsado": "ia|manual|voz"
}
```

#### GET `/reportes`
Listar reportes con filtros.

**Parámetros opcionales:**
- `q`: Búsqueda en título/descripción
- `estado`: Pendiente | En proceso | Resuelto
- `desde`: Fecha inicio (YYYY-MM-DD)
- `hasta`: Fecha fin (YYYY-MM-DD)
- `usuarioId`: Filtro por usuario (solo admin)
- `nombreUsuario`: Búsqueda por nombre usuario (solo admin)

**Response:** 200 OK
```json
{
  "total": 15,
  "reportes": [...]
}
```

#### GET `/reportes/:id`
Obtener reporte específico.

**Response:** 200 OK
```json
{
  "reporte": {...}
}
```

#### PATCH `/reportes/:id/estado`
Cambiar estado del reporte (solo admin).

**Body:**
```json
{
  "estado": "En proceso"
}
```

**Response:** 200 OK
```json
{
  "mensaje": "Estado actualizado",
  "reporte": {...}
}
```

---

###  Archivos

#### GET `/files/:id/public`
Descargar foto de perfil (sin autenticación).

**Response:** 200 OK (imagen en stream)

#### GET `/files/:id`
Descargar archivo (requiere autenticación y permisos).

**Response:** 200 OK (imagen en stream)

---

###  Administración

#### GET `/admin/usuarios`
Listar usuarios (solo admin).

**Parámetros opcionales:**
- `rol`: admin | ciudadano

**Response:** 200 OK
```json
{
  "cantidad": 25,
  "usuarios": [...]
}
```

---

##  Casos de uso

### Caso 1: Ciudadano reporta un hueco

1. **Registro:** Ciudadano se registra con sus datos
2. **Login:** Accede al dashboard
3. **Crear reporte:** 
   - Elige "Modo manual" o describe el problema en texto libre
   - Adjunta foto del hueco
   - Selecciona ubicación exacta
4. **Confirmación:** Recibe email confirmando su reporte
5. **Seguimiento:** Puede ver su reporte en "Listar reportes"
6. **Resolución:** Admin cambio el estado a "Resuelto", ciudadano recibe notificación

### Caso 2: Administrador da seguimiento

1. **Login:** Admin accede al dashboard
2. **Ver todos los reportes:** Filtra por estado, fecha, usuario
3. **Cambiar estado:** 
   - Reporte llega en estado "Pendiente"
   - Admin lo cambia a "En proceso" para indicar que se está atendiendo
   - Finalmente a "Resuelto" cuando se arregla
4. **Contactar ciudadano:** Ve los datos completos del reportante (email, dirección, teléfono)
5. **Seguimiento estadístico:** Observa métricas (futura integración)

### Caso 3: Edición de perfil

1. **Login:** Usuario accede a su perfil
2. **Editar perfil:**
   - Cambiar nombre a nombre legal actual
   - Actualizar dirección
   - Subir foto de perfil (JPG/PNG)
3. **Guardar:** Los cambios se reflejan inmediatamente
4. **Compartir:** Su foto aparece en reportes que crea

### Caso 4: Reportante anónimo (futuro)

- Crear reportes sin requerir login
- Solo proporcionar datos contacto
- Ideal para denuncias anónimas

---

##  Configuración

### Variables de entorno - Backend

Crear archivo `backend/.env`:

```env
# Servidor
PORT=5001
NODE_ENV=development

# Base de datos
MONGODB_URI=mongodb://127.0.0.1:27017/sivu_desarrollo
# Si NO especificas MONGODB_URI, usa: mongodb://127.0.0.1:27017/sivu_<usuario_windows>

# Autenticación JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion_MAS_DE_32_CARACTERES

# Email (Nodemailer) - Opcional, graceful degradation
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_app_google
SMTP_FROM=noreply@sivur.com

# IA Local (Ollama + Llama 3) - Opcional
# Asegúrate de ejecutar: ollama serve
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
OLLAMA_TIMEOUT_MS=120000
OLLAMA_JSON_FORMAT=true

# Nota: Si OLLAMA_JSON_FORMAT=true y Ollama retorna vacío, 
# cambia a false (algunos modelos no soportan JSON forzado)
```

### Configuración de Ollama (IA Local)

**Paso 1: Instalar Ollama**
```bash
# Descargar desde https://ollama.ai
# O si ya está instalado:
ollama --version
```

**Paso 2: Descargar modelo Llama 3**
```bash
ollama pull llama3  # ~4.7 GB
```

**Paso 3: Iniciar Ollama**
```bash
ollama serve
# Escucha en http://localhost:11434
```

**Paso 4: Probar endpoint**
```bash
curl http://localhost:11434/api/tags
# Debe listar modelos disponibles
```

**Paso 5: Configurar backend**
- Añadir variables en `backend/.env` (ver arriba)
- Backend auto-detecta Ollama y habilita modo IA

**Paso 6: Probar en frontend**
- Crear reporte en modo "IA" o "Voz"
- Ver procesamiento en tiempo real
- Logs en consola del backend

### Email (Nodemailer) - Configuración

**Con Gmail:**
1. Habilitar "Contraseñas de aplicación" en Google Account
2. Usar en `SMTP_PASS`
3. `SMTP_USER` = email de Google

**Con otro SMTP:**
- Cambiar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Ejemplo Outlook: smtp-mail.outlook.com:587

**Graceful Degradation:**
- Si SMTP no configurado → No se envían emails pero reportes se crean ok
- Si credenciales incorrectas → Warning en logs, reportes se crean ok

### Variables de entorno - Frontend

El frontend en modo desarrollo usa proxy de Vite hacia `http://localhost:5001/api`. En producción, configura en `vite.config.js`:

```javascript
import.meta.env.VITE_API_ORIGIN  // Configurable en .env.production
```

### MongoDB

#### Opción 1: Local en Windows

```powershell
# Instalar (admin)
.\scripts\Instalar-MongoDB.ps1

# Iniciar
.\scripts\Iniciar-MongoDB.ps1
```

#### Opción 2: MongoDB Atlas

1. Crear cuenta en [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Obtener connection string:
   ```
   mongodb+srv://usuario:contraseña@cluster.mongodb.net/sivu
   ```
4. Añadir a `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/sivu
   ```

---

##  Flujo de autenticación

```
┌─────────────────┐
│    Frontend     │
└────────┬────────┘
         │
         │ 1. POST /auth/registro (credenciales)
         │
         ▼
┌─────────────────────────────────┐
│  Backend - authController.js    │
│  • Validar email único          │
│  • Hash password (bcryptjs)     │
│  • Crear usuario en MongoDB     │
└────────┬────────────────────────┘
         │
         │ 2. Generar JWT (30 días)
         │
         ▼
┌─────────────────────────────────┐
│  Frontend - localStorage        │
│  • Guardar token                │
│  • Guardar usuario              │
│  • Restaurar en page reload     │
└────────┬────────────────────────┘
         │
         │ 3. Peticiones autenticadas
         │    Authorization: Bearer <token>
         │
         ▼
┌─────────────────────────────────┐
│  Backend - auth middleware      │
│  • Verificar token (JWT_SECRET) │
│  • Buscar usuario               │
│  • Agregar req.usuario          │
└─────────────────────────────────┘
```

---

##  Arquitectura y patrones

### Backend

```
Express App (app.js)
├── CORS Middleware
├── JSON Body Parser (8mb limit)
├── Routes (con middleware JWT)
│   ├── /api/auth (público + privado)
│   ├── /api/reportes (privado)
│   ├── /api/admin (privado + admin)
│   └── /api/files (privado + público)
└── Error Handler
```

### Frontend

```
App.jsx
├── ThemeProvider (contexto de tema)
├── AuthProvider (contexto de autenticación)
├── Router (React Router v6)
│   ├── /login (público)
│   ├── /registro (público)
│   ├── /dashboard (protegido)
│   │   ├── Crear Reporte
│   │   ├── Listar Reportes
│   │   ├── Perfil
│   │   └── Admin (solo admin)
│   └── / (redirección)
└── Toaster (notificaciones)
```

---

##  Troubleshooting

### "MongoDB no está conectado"
- Verificar que MongoDB esté corriendo: `net start MongoDB`
- Confirmar URI en `.env`: `MONGODB_URI=mongodb://127.0.0.1:27017/sivu_usuario`
- Para Atlas: usar connection string con contraseña

### "Token no válido"
- JWT expiró (30 días)
- Usuario fue eliminado
- Sesión en otro navegador/dispositivo
- Solución: Hacer login nuevamente

### "Foto de perfil no carga"
- Verificar ruta: debe ser `/api/files/{id}/public` (sin `/`)
- Verificar que la foto se subió (GridFS activo)
- Limpiar cache del navegador
- Usar DevTools → Network para ver si 404 o error de permisos

### "Ollama no disponible / Modo IA no funciona" 
- Verificar que Ollama esté corriendo: `ollama serve`
- Verificar endpoint en `.env`: `OLLAMA_BASE_URL=http://localhost:11434`
- Verificar que Llama 3 está descargado: `ollama list`
  - Si no: `ollama pull llama3`
- Revisar logs del backend para ver error exacto
- Backend usa **fallback automático** → reportes se crean en modo manual
- Probar manualmente: `curl http://localhost:11434/api/tags`

### "Ollama retorna JSON vacío"
- Modelo no soporta JSON forzado
- Solución: Cambiar en `.env`: `OLLAMA_JSON_FORMAT=false`
- Algunos modelos no soportan `format: json` en API

### "Dictado por voz no funciona" 🎤
- Navegador no soporta Web Speech API (Opera, Safari antiguo)
-  **HTTPS requerido en producción** (localhost funciona en HTTP)
- Verificar permisos de micrófono en navegador
- Probar en Chrome, Edge, Firefox (recomendado)
- Ver consola del navegador para errores específicos

### "Correo no se envía"
- SMTP no configurado en `.env` (graceful degradation - reportes se crean ok)
- Credenciales SMTP incorrectas
- IP/dominio no permitido por proveedor
- Con Gmail: usar "Contraseña de aplicación" no contraseña normal
- Revisar logs backend: `console.warn('[email]...')`
- Probar credenciales: `nodemailer.createTransport({...}).verify()`

### "Reportes sin información del usuario"
- Verificar que usuario esté poblado en BD: check `usuarioId` ref
- Backend debe hacer `.populate('usuarioId')`
- Si es legado (base64): convertir a GridFS y actualizar `imagenFileId`

### "Imagen de reporte muy grande o se tarda en subir"
- Comprimir foto antes de enviar (frontend)
- Máximo 5MB configurado en backend
- Reducir calidad JPEG a 0.7-0.8 en base64

---

##  Próximos pasos (Roadmap)

### Sprint 4: Geolocalización y Mapas 
- [ ] Integración con Google Maps / Leaflet
- [ ] Marcar ubicación en mapa al crear reporte
- [ ] Ver reportes en mapa (clustering)
- [ ] Autocomplete de direcciones (Google Places API)
- [ ] Detectar ubicación por GPS
- [ ] Mostrar zona de cobertura de municipios

### Sprint 5: Notificaciones en Tiempo Real 
- [ ] WebSockets para actualizaciones live
- [ ] Notificaciones push en navegador
- [ ] Notificaciones SMS (Twilio)
- [ ] Historial de cambios en reportes
- [ ] Comentarios en reportes (admin ↔ ciudadano)
- [ ] Menciones y tags

### Sprint 6: Analytics y Dashboard 
- [ ] Dashboard admin con métricas
- [ ] Reportes por mes, categoría, estado, zona
- [ ] Gráficos (Chart.js o similar)
- [ ] Exportar reportes (PDF, CSV)
- [ ] KPIs de respuesta y resolución
- [ ] Heatmap de incidencias por zona

### Sprint 7: Seguridad Avanzada 
- [ ] Two-Factor Authentication (2FA) con TOTP
- [ ] Rate limiting en APIs
- [ ] Validación CSRF
- [ ] Logs de auditoría (quién, qué, cuándo)
- [ ] Encriptación de datos sensibles
- [ ] Backup automático de BD

### Sprint 8: Chatbot IA Avanzado 
- [ ] Chatbot con IA integrado (Ollama o API)
- [ ] Asistente para crear reportes
- [ ] FAQ automático por categoría
- [ ] Clasificación automática mejorada
- [ ] Sugerencias de reportes duplicados
- [ ] Análisis de sentimiento

### Sprint 9: App Móvil 
- [ ] React Native / Expo
- [ ] Sincronización offline-first
- [ ] Acceso a cámara nativa
- [ ] GPS nativo
- [ ] Notificaciones push
- [ ] Escaneo de códigos QR

### Sprint 10: Integraciones Externas 
- [ ] API pública para terceros
- [ ] Webhooks para eventos
- [ ] SSO (Single Sign-On)
- [ ] Integración con servicios municipales
- [ ] Exportación a sistemas SCADA
- [ ] Integración con ciudades inteligentes (IoT)

### Sprint 11+: Innovaciones Futuras 
- [ ] IA multimodal (imagen + texto en reportes)
- [ ] Detección automática de tipo de incidencia por foto
- [ ] Ruta óptima para equipos de mantenimiento
- [ ] Predicción de zonas problemáticas
- [ ] Gamificación (puntos, rankings)
- [ ] Portal de transparencia pública

---

##  Equipo de desarrollo

- **Daniel Santiago Rodríguez Gerena** - Full Stack
- **Juan José Oquendo Jaramillo** - Full Stack

---

##  Licencia

Proyecto académico para fines educativos e investigación. No comercial.

**Copyright © 2026 SIVUR - Emvarias**

---

##  Contacto y Soporte

Para reportar bugs, sugerencias o preguntas:
- GitHub Issues (futuro)
- Email: soporte@sivur.local
- Documentación: Este README

---

##  Checklist de Implementación por Sprint

###  Sprint 1 (MVP) - Completado
- [x] Autenticación JWT básica
- [x] Registro y login
- [x] Modelo Usuario + Reporte
- [x] CRUD de reportes
- [x] Cambio de estado (admin)
- [x] UI responsive
- [x] Tema claro/oscuro

###  Sprint 2 - Completado
- [x] GridFS para imágenes
- [x] Fotos de perfil
- [x] Imágenes en reportes
- [x] Nodemailer (confirmación reportes)
- [x] Cliente Ollama (IA local)
- [x] Fallback manual sin IA

###  Sprint 3 - Completado ⭐
- [x] Editar nombre usuario
- [x] Editar dirección
- [x] Subir foto de perfil
- [x] Fotos cargan correctamente
- [x] Ruta pública `/api/files/:id/public`
- [x] Mostrar documento + dirección + email en reportes
- [x] Datos completos de reportante en API
- [x] **Modo IA (Ollama + Llama 3)** procesamiento de texto libre
- [x] **Modo Voz (Web Speech API)** con dictado en español
- [x] **3 modos de creación de reportes** completos
- [x] Fallback automático si Ollama no disponible
- [x] Información completa del reportante en cada reporte

###  Sprint 4 (Próximo)
- [ ] Mapas interactivos (Google Maps / Leaflet)
- [ ] Geolocalización automática
- [ ] Clustering de reportes por zona

---

**Última actualización:** 11 de Mayo de 2026  
**Versión:** 3.0.0 (Sprint 3 - Completo)  
**Modelo IA:** Llama 3 (vía Ollama)  
**Status:**  Producción-ready (MVP funcional actualizado)

