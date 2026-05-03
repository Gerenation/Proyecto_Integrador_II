@echo off
SETLOCAL

REM Carpeta base = donde está este .bat
SET "BASE_DIR=%~dp0"

echo ============================================
echo    Iniciando SIVUR (Backend y Frontend)
echo ============================================
echo.

REM Verificar Node/NPM disponibles
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js no esta instalado o no esta en PATH.
  echo Instala Node.js 18+ y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm no esta disponible en PATH.
  echo Reinstala Node.js y vuelve a intentar.
  pause
  exit /b 1
)

REM Intentar iniciar servicio MongoDB si existe (puede requerir permisos)
sc query MongoDB >nul 2>nul
if not errorlevel 1 (
  echo Verificando servicio MongoDB...
  net start MongoDB >nul 2>nul
)

REM Instalar dependencias si falta node_modules
if not exist "%BASE_DIR%backend\node_modules" (
  echo Instalando dependencias de backend...
  call npm --prefix "%BASE_DIR%backend" install
)

if not exist "%BASE_DIR%frontend\node_modules" (
  echo Instalando dependencias de frontend...
  call npm --prefix "%BASE_DIR%frontend" install
)

if not exist "%BASE_DIR%backend\.env" (
  echo [INFO] No existe backend\.env, copiando desde .env.example...
  copy "%BASE_DIR%backend\.env.example" "%BASE_DIR%backend\.env" >nul
)

REM Backend: usar modo desarrollo (nodemon) y puerto configurado en .env (5001)
echo Iniciando backend...
start "SIVUR Backend" /D "%BASE_DIR%backend" cmd /K npm run dev

REM Frontend: Vite en modo dev con proxy a backend
echo Iniciando frontend...
start "SIVUR Frontend" /D "%BASE_DIR%frontend" cmd /K npm run dev -- --open

echo.
echo Backend y frontend se estan iniciando en ventanas separadas.
echo Cuando carguen, abre en el navegador: http://localhost:5173/
echo Si backend falla por MongoDB, revisa que el servicio/local Mongo este activo.
echo Para estructurar reportes con IA, ejecuta Ollama en http://localhost:11434 ^(ollama serve^).
echo.
echo Presiona una tecla para cerrar este lanzador.
pause >nul

ENDLOCAL
