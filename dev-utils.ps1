# Script de utilidades para My App Container

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    My App Container - Utilidades" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Show-Menu {
    Write-Host "Selecciona una opción:" -ForegroundColor Green
    Write-Host "1. Ejecutar aplicación (desarrollo)" -ForegroundColor White
    Write-Host "2. Ejecutar aplicación (producción)" -ForegroundColor White
    Write-Host "3. Construir para Windows" -ForegroundColor White
    Write-Host "4. Mostrar ubicación de configuración" -ForegroundColor White
    Write-Host "5. Limpiar node_modules y reinstalar" -ForegroundColor White
    Write-Host "6. Ver logs de la aplicación" -ForegroundColor White
    Write-Host "7. Abrir carpeta del proyecto" -ForegroundColor White
    Write-Host "0. Salir" -ForegroundColor Red
    Write-Host ""
}

function Start-DevApp {
    Write-Host "Iniciando aplicación en modo desarrollo..." -ForegroundColor Yellow
    npm run dev
}

function Start-ProdApp {
    Write-Host "Iniciando aplicación..." -ForegroundColor Yellow
    npm start
}

function Build-App {
    Write-Host "Construyendo aplicación para Windows..." -ForegroundColor Yellow
    npm run build-win
}

function Show-ConfigLocation {
    $configPath = "$env:APPDATA\my-app-container"
    Write-Host "Ubicación de configuración:" -ForegroundColor Green
    Write-Host $configPath -ForegroundColor Cyan
    
    if (Test-Path $configPath) {
        Write-Host "✓ La carpeta existe" -ForegroundColor Green
        Write-Host "Archivos encontrados:" -ForegroundColor Yellow
        Get-ChildItem $configPath | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
    } else {
        Write-Host "✗ La carpeta no existe (se creará al ejecutar la app)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Para sincronizar con Nextcloud, configura esta carpeta en tu cliente." -ForegroundColor Blue
}

function Clean-Install {
    Write-Host "Limpiando instalación..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "✓ node_modules eliminado" -ForegroundColor Green
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Force "package-lock.json"
        Write-Host "✓ package-lock.json eliminado" -ForegroundColor Green
    }
    
    Write-Host "Reinstalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dependencias reinstaladas" -ForegroundColor Green
}

function Show-Logs {
    $logsPath = "$env:APPDATA\my-app-container\logs"
    Write-Host "Buscando logs en: $logsPath" -ForegroundColor Yellow
    
    if (Test-Path $logsPath) {
        Get-ChildItem $logsPath -Filter "*.log" | Sort-Object LastWriteTime -Descending | Select-Object -First 5 | ForEach-Object {
            Write-Host "📄 $($_.Name) - $($_.LastWriteTime)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "No se encontraron logs. La aplicación creará logs al ejecutarse." -ForegroundColor Yellow
    }
}

function Open-ProjectFolder {
    Write-Host "Abriendo carpeta del proyecto..." -ForegroundColor Yellow
    Invoke-Item .
}

# Bucle principal
do {
    Show-Menu
    $choice = Read-Host "Ingresa tu opción"
    
    switch ($choice) {
        "1" { Start-DevApp }
        "2" { Start-ProdApp }
        "3" { Build-App }
        "4" { Show-ConfigLocation }
        "5" { Clean-Install }
        "6" { Show-Logs }
        "7" { Open-ProjectFolder }
        "0" { 
            Write-Host "¡Hasta luego!" -ForegroundColor Green
            break 
        }
        default { 
            Write-Host "Opción no válida. Intenta de nuevo." -ForegroundColor Red 
        }
    }
    
    if ($choice -ne "0") {
        Write-Host ""
        Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
        Read-Host
        Clear-Host
    }
} while ($choice -ne "0")
