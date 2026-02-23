# Inicia MongoDB en el puerto 27017 usando datos dentro del proyecto (no requiere C:\data\db)
# Usar cuando MongoDB ya está instalado pero el servicio no está corriendo

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$DataPath = Join-Path $ProjectRoot "mongodb-data"
$Port = 27017

# Crear carpeta de datos si no existe
if (-not (Test-Path $DataPath)) {
    New-Item -ItemType Directory -Path $DataPath -Force | Out-Null
    Write-Host "Creada carpeta de datos: $DataPath" -ForegroundColor Green
}

# Buscar mongod en PATH o en ubicaciones típicas
$mongod = $null
if (Get-Command mongod -ErrorAction SilentlyContinue) {
    $mongod = "mongod"
} else {
    $paths = @(
        "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
    )
    foreach ($p in $paths) {
        if (Test-Path $p) {
            $mongod = $p
            break
        }
    }
}

if (-not $mongod) {
    Write-Host "MongoDB no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "Ejecuta como Administrador: .\scripts\Instalar-MongoDB.ps1" -ForegroundColor Yellow
    Write-Host "O usa MongoDB Atlas (gratis): ver README sección 'MongoDB Atlas'." -ForegroundColor Yellow
    exit 1
}

# Comprobar si ya hay algo escuchando en 27017
$listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listening) {
    Write-Host "MongoDB ya está corriendo en el puerto $Port." -ForegroundColor Green
    exit 0
}

Write-Host "Iniciando MongoDB en puerto $Port (datos en $DataPath)..." -ForegroundColor Cyan
Start-Process -FilePath $mongod -ArgumentList "--dbpath", $DataPath, "--port", $Port -WindowStyle Minimized
Start-Sleep -Seconds 2
$listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listening) {
    Write-Host "MongoDB está corriendo en localhost:$Port" -ForegroundColor Green
} else {
    Write-Host "Comprueba si MongoDB arrancó correctamente (puede tardar unos segundos)." -ForegroundColor Yellow
}
