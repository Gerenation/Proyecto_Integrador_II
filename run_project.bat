@echo off
SETLOCAL

echo Iniciando backend...
start "SIVUR Backend" /D "%~dp0-2\backend" cmd /K npm start

echo Iniciando frontend...
start "SIVUR Frontend" /D "%~dp0-2\frontend" cmd /K npm run dev -- --open

echo.
echo Backend y frontend se estan iniciando en ventanas separadas.
echo Presiona una tecla para cerrar este lanzador.
pause >nul

ENDLOCAL
