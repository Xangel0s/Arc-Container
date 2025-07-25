# 🎨 Selector de Interfaz - Arc Container

Write-Host "🎨 Selector de Interfaz para Arc Container" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor DarkGray

# Mostrar opciones disponibles
Write-Host "`n📱 Interfaces disponibles:" -ForegroundColor Yellow
Write-Host "1. 🏆 Premium Edition (NUEVA - Recomendada)" -ForegroundColor Magenta
Write-Host "2. 🔥 Arc Style (Ultra Minimalista)" -ForegroundColor Green
Write-Host "3. 💼 Professional (Completa)" -ForegroundColor Blue  
Write-Host "4. 🔧 Debug (Testing)" -ForegroundColor Cyan
Write-Host "5. 📊 Original (Rambox Style)" -ForegroundColor Yellow

Write-Host "`n🎯 Selecciona una interfaz:" -ForegroundColor White
$selection = Read-Host "Ingresa el número (1-5)"

# Cambiar al directorio del proyecto
Set-Location "c:\Users\MC MOVILES\trend\my-app-container"

# Variables para los archivos
$mainJs = "main.js"
$backupMain = "main.js.backup"

# Crear backup si no existe
if (-not (Test-Path $backupMain)) {
    Copy-Item $mainJs $backupMain
    Write-Host "✅ Backup creado: main.js.backup" -ForegroundColor Green
}

# Función para actualizar main.js
function Update-MainJS {
    param($htmlFile)
    
    $content = Get-Content $mainJs -Raw
    $newContent = $content -replace "mainWindow\.loadFile\('.*?'\)", "mainWindow.loadFile('$htmlFile')"
    Set-Content $mainJs $newContent -NoNewline
    
    Write-Host "✅ main.js actualizado para usar: $htmlFile" -ForegroundColor Green
}

# Aplicar selección
switch ($selection) {
    "1" {
        Update-MainJS "index-premium.html"
        Write-Host "`n🏆 Interfaz Premium Edition activada!" -ForegroundColor Magenta
        Write-Host "• Diseño más elegante y refinado" -ForegroundColor Gray
        Write-Host "• Sidebar fijo de 70px con tooltips" -ForegroundColor Gray
        Write-Host "• User Agent actualizado para WhatsApp" -ForegroundColor Gray
        Write-Host "• Notificaciones simuladas" -ForegroundColor Gray
        Write-Host "• Mejor rendimiento y estabilidad" -ForegroundColor Gray
    }
    "2" {
        Update-MainJS "index-arc.html"
        Write-Host "`n🔥 Interfaz Arc Style activada!" -ForegroundColor Green
        Write-Host "• Ultra minimalista y moderna" -ForegroundColor Gray
        Write-Host "• Sidebar de 60px que se expande al hover" -ForegroundColor Gray
        Write-Host "• Inspirada en Arc Browser" -ForegroundColor Gray
    }
    "3" {
        Update-MainJS "index-professional.html"
        Write-Host "`n💼 Interfaz Professional activada!" -ForegroundColor Blue
        Write-Host "• Sidebar completo siempre visible" -ForegroundColor Gray
        Write-Host "• Máxima funcionalidad" -ForegroundColor Gray
        Write-Host "• Inspirada en Discord/Slack" -ForegroundColor Gray
    }
    "4" {
        Update-MainJS "debug-webview.html"
        Write-Host "`n🔧 Interfaz Debug activada!" -ForegroundColor Cyan
        Write-Host "• Para testing y desarrollo" -ForegroundColor Gray
        Write-Host "• Logs detallados y controles de debug" -ForegroundColor Gray
    }
    "5" {
        Update-MainJS "index.html"
        Write-Host "`n📊 Interfaz Original activada!" -ForegroundColor Yellow
        Write-Host "• Estilo Rambox clásico" -ForegroundColor Gray
        Write-Host "• Sidebar vertical con iconos" -ForegroundColor Gray
    }
    default {
        Write-Host "`n❌ Selección inválida. Manteniendo configuración actual." -ForegroundColor Red
        exit
    }
}

Write-Host "`n🚀 ¿Iniciar la aplicación?" -ForegroundColor Yellow
$launch = Read-Host "Presiona Enter para continuar o 'n' para salir"

if ($launch -ne "n") {
    Write-Host "`n⏳ Iniciando Arc Container..." -ForegroundColor Green
    Write-Host "=" * 50 -ForegroundColor DarkGray
    npm start
} else {
    Write-Host "`n👋 ¡Listo! Usa 'npm start' cuando quieras probar la interfaz." -ForegroundColor Yellow
}
