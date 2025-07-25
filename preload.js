const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Configuración
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: (config) => ipcRenderer.invoke('save-config', config),
    
    // Último servicio activo
    getLastActiveService: () => ipcRenderer.invoke('get-last-active-service'),
    saveLastActiveService: (serviceId) => ipcRenderer.invoke('save-last-active-service', serviceId),
    
    // Información del sistema
    platform: process.platform,
    
    // Eventos personalizados (para futuras funcionalidades)
    onNotification: (callback) => ipcRenderer.on('notification', callback),
    removeNotificationListener: () => ipcRenderer.removeAllListeners('notification')
});
