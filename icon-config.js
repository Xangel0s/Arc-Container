// Configuración específica para el icono de la aplicación
const path = require('path');
const fs = require('fs');

const iconConfig = {
    // Ruta del icono
    iconPath: path.join(__dirname, 'assets', 'icon.ico'),
    
    // Verificar que el archivo existe
    exists: function() {
        return fs.existsSync(this.iconPath);
    },
    
    // Obtener información del archivo
    getInfo: function() {
        if (this.exists()) {
            const stats = fs.statSync(this.iconPath);
            return {
                path: this.iconPath,
                size: stats.size,
                modified: stats.mtime
            };
        }
        return null;
    },
    
    // Configuración para Windows
    windowsConfig: {
        appId: 'com.arccontainer.app.v2',
        appIconPath: path.join(__dirname, 'assets', 'icon.ico'),
        appIconIndex: 0,
        relaunchDisplayName: 'Arc Container',
        relaunchCommand: process.execPath
    }
};

module.exports = iconConfig; 