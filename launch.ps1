# Script para iniciar My App Container
param(
    [switch]$Dev = $false
)

$projectPath = "C:\Users\MC MOVILES\trend\my-app-container"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    My App Container - Launcher" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que el directorio existe
if (!(Test-Path $projectPath)) {
    Write-Host "❌ Error: No se encontró el directorio del proyecto en:" -ForegroundColor Red
    Write-Host "$projectPath" -ForegroundColor Red
    exit 1
}

# Cambiar al directorio del proyecto
Set-Location $projectPath
Write-Host "📁 Directorio actual: $((Get-Location).Path)" -ForegroundColor Green

# Verificar que package.json existe
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json en el directorio actual" -ForegroundColor Red
    exit 1
}

Write-Host "✅ package.json encontrado" -ForegroundColor Green

# Verificar que node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado. Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ node_modules encontrado" -ForegroundColor Green
Write-Host ""

try {
    if ($Dev) {
        Write-Host "🚀 Iniciando en modo desarrollo..." -ForegroundColor Yellow
        npm run dev
    } else {
        Write-Host "🚀 Iniciando My App Container..." -ForegroundColor Yellow
        npm start
    }
} catch {
    Write-Host "❌ Error al ejecutar la aplicación: $($_.Exception.Message)" -ForegroundColor Red
    
    # Intentar con electron directo como fallback
    Write-Host "🔄 Intentando con electron directo..." -ForegroundColor Yellow
    try {
        & ".\node_modules\.bin\electron.cmd" .
    } catch {
        Write-Host "❌ Error también con electron directo: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Presiona Enter para salir..." -ForegroundColor Gray
Read-Host
