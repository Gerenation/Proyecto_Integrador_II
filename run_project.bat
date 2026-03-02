@echo off
SETLOCAL

REM Carpeta base = donde está este .bat
SET "BASE_DIR=%~dp0"

echo ============================================
echo    Iniciando SIVUR (Backend y Frontend)
echo ============================================
echo.

REM Backend: usar modo desarrollo (nodemon) y puerto configurado en .env (5001)
echo Iniciando backend...
start "SIVUR Backend" /D "%BASE_DIR%backend" cmd /K npm run dev

REM Frontend: Vite en modo dev con proxy a backend
echo Iniciando frontend...
start "SIVUR Frontend" /D "%BASE_DIR%frontend" cmd /K npm run dev -- --open

echo.
echo Backend y frontend se estan iniciando en ventanas separadas.
echo Cuando carguen, abre en el navegador: http://localhost:5173/
echo.
echo Presiona una tecla para cerrar este lanzador.
pause >nul

ENDLOCAL
