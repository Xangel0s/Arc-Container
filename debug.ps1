# Script de Debug para My App Container
Write-Host "🔍 Iniciando My App Container en modo DEBUG..." -ForegroundColor Cyan

# Cambiar al directorio del proyecto
Set-Location "c:\Users\MC MOVILES\trend\my-app-container"

Write-Host "📁 Directorio actual: $(Get-Location)" -ForegroundColor Yellow

# Verificar archivos principales
$files = @("package.json", "main.js", "index.html", "preload.js")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file NO EXISTE" -ForegroundColor Red
    }
}

# Verificar dependencias
Write-Host "`n📦 Verificando dependencias..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules no existe. Ejecutando npm install..." -ForegroundColor Yellow
    npm install
}

# Mostrar información del sistema
Write-Host "`n💻 Información del sistema:" -ForegroundColor Cyan
Write-Host "Node.js: $(node --version)" -ForegroundColor Yellow
Write-Host "NPM: $(npm --version)" -ForegroundColor Yellow

# Ejecutar la aplicación con logs detallados
Write-Host "`n🚀 Iniciando aplicación..." -ForegroundColor Cyan
Write-Host "Si la aplicación no muestra las páginas web:" -ForegroundColor Yellow
Write-Host "1. Presiona F12 para abrir DevTools" -ForegroundColor Yellow
Write-Host "2. Ve a la pestaña Console" -ForegroundColor Yellow
Write-Host "3. Busca errores en rojo" -ForegroundColor Yellow
Write-Host "4. Usa el archivo debug-webview.html para tests" -ForegroundColor Yellow

Write-Host "`n📋 Comandos útiles mientras la app está ejecutándose:" -ForegroundColor Cyan
Write-Host "• Para probar webviews: abre debug-webview.html en la app" -ForegroundColor Gray
Write-Host "• Para recargar: Ctrl+R" -ForegroundColor Gray
Write-Host "• Para DevTools: F12" -ForegroundColor Gray
Write-Host "• Para cerrar: Ctrl+C en esta terminal" -ForegroundColor Gray

Write-Host "`n⏳ Ejecutando: npm start" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor DarkGray

# Ejecutar la aplicación
npm start
