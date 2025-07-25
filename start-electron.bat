@echo off
cd /d "C:\Users\MC MOVILES\trend\my-app-container"
echo Directorio actual: %CD%
echo.
echo Iniciando My App Container con Electron directo...
".\node_modules\.bin\electron.cmd" .
pause
