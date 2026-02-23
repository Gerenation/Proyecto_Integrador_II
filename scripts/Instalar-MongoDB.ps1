# Requiere ejecutar PowerShell como Administrador (clic derecho -> Ejecutar como administrador)
# Instala MongoDB con Chocolatey y lo deja corriendo en el puerto 27017

$ErrorActionPreference = "Stop"

Write-Host "=== Instalador de MongoDB para SIVUR ===" -ForegroundColor Cyan
Write-Host ""

# Comprobar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador." -ForegroundColor Red
    Write-Host "Clic derecho en PowerShell -> 'Ejecutar como administrador'" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Si no puedes usar administrador, usa MongoDB Atlas (gratis):" -ForegroundColor Yellow
    Write-Host "1. Entra en https://www.mongodb.com/cloud/atlas/register" -ForegroundColor White
    Write-Host "2. Crea un cluster gratuito y obtén la cadena de conexión" -ForegroundColor White
    Write-Host "3. En backend/.env pon MONGODB_URI=<tu-cadena-de-conexion>" -ForegroundColor White
    exit 1
}

# Comprobar Chocolatey
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey no está instalado. Instalando Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host "Instalando MongoDB (puede tardar unos minutos)..." -ForegroundColor Cyan
choco install mongodb --yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "La instalación con Chocolatey falló. Prueba manualmente:" -ForegroundColor Red
    Write-Host "  En PowerShell (como Admin): choco install mongodb --yes" -ForegroundColor White
    exit 1
}

# Crear carpeta de datos por defecto por si no existe
$dataPath = "C:\data\db"
if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    Write-Host "Creada carpeta de datos: $dataPath" -ForegroundColor Green
}

# Intentar iniciar el servicio de MongoDB
$serviceName = "MongoDB"
if (Get-Service -Name $serviceName -ErrorAction SilentlyContinue) {
    Set-Service -Name $serviceName -StartupType Automatic
    Start-Service -Name $serviceName
    Write-Host "Servicio MongoDB iniciado." -ForegroundColor Green
} else {
    Write-Host "Servicio MongoDB no encontrado. Si mongod está en el PATH, ejecuta:" -ForegroundColor Yellow
    Write-Host "  .\scripts\Iniciar-MongoDB.ps1" -ForegroundColor White
}

Write-Host ""
Write-Host "MongoDB debería estar disponible en localhost:27017" -ForegroundColor Green
Write-Host "Prueba el registro en la app SIVU." -ForegroundColor Green
