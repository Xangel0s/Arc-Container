const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Configuración
    getConfig: () => ipcRenderer.invoke('get-config'),
    saveConfig: (config) => ipcRenderer.invoke('save-config', config),
    
    // Último servicio activo
    getLastActiveService: () => ipcRenderer.invoke('get-last-active-service'),
    saveLastActiveService: (serviceId) => ipcRenderer.invoke('save-last-active-service', serviceId),
    
    // Controles de ventana
    minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
    toggleMaximize: () => ipcRenderer.invoke('toggle-maximize'),
    closeWindow: () => ipcRenderer.invoke('close-window'),
    
    // Sistema de notificaciones
    showNotification: (title, body, service) => ipcRenderer.invoke('show-notification', { title, body, service }),
    
    // Información del sistema
    platform: process.platform,
    
    // Eventos personalizados
    onNotification: (callback) => ipcRenderer.on('notification', callback),
    onFocusService: (callback) => ipcRenderer.on('focus-service', callback),
    removeNotificationListener: () => ipcRenderer.removeAllListeners('notification'),
    removeFocusServiceListener: () => ipcRenderer.removeAllListeners('focus-service')
});
