const { app, BrowserWindow, ipcMain, Notification, nativeImage, Tray, Menu } = require('electron');
const path = require('path');

// Configuración EXACTA de Rambox Community (Electron 13.6.3) - CONFIGURACIÓN MÍNIMA QUE FUNCIONA
// SOLO el switch crítico que usa Rambox para solucionar CSP
app.commandLine.appendSwitch('--disable-features', 'CrossOriginOpenerPolicy');

// Importar electron-store de forma compatible con Electron 13.x
const Store = require('electron-store');
const store = new Store();

// Suprimir warnings de seguridad en desarrollo
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

// Configurar nombre de la aplicación
app.setName('Arc Container');
app.setAppUserModelId('com.arccontainer.app');

// Manejar cuando se inicia desde la barra de inicio
if (process.platform === 'win32') {
    app.setAppUserModelId('com.arccontainer.app');
}

// Prevenir múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    console.log('🔄 Another instance is running, quitting');
    app.quit();
    return;
}

let mainWindow;
let tray;

function createWindow() {
    // Crear la ventana principal
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        frame: false, // Remover marco por defecto para diseño personalizado
        titleBarStyle: 'hidden', // Ocultar barra de título nativa
        backgroundColor: '#0f0f0f', // Color de fondo oscuro
        vibrancy: 'dark', // Efecto de transparencia (macOS)
        transparent: false,
        webPreferences: {
            // Configuración EXACTA de Rambox Community - Solo lo esencial que funciona
            enableRemoteModule: true, // Rambox usa true
            plugins: true, // Rambox usa true - IMPORTANTE para WASM
            partition: 'persist:arc-container', // Como Rambox usa persist:rambox
            nodeIntegration: true, // Rambox usa true
            webviewTag: true, // Rambox usa true
            contextIsolation: false, // Rambox usa false
            spellcheck: false // Rambox usa false
            // SIN webSecurity: false - Rambox NO lo usa
            // SIN allowRunningInsecureContent - Rambox NO lo usa  
            // SIN experimentalFeatures - Rambox NO lo usa
        },
        // Usar ícono por defecto de Electron para mejor compatibilidad
        // icon: path.join(__dirname, 'assets', 'image-removebg-preview.png'), // Logo principal de la aplicación
        show: false, // No mostrar hasta que esté listo
        roundedCorners: true, // Esquinas redondeadas (Windows 11)
        shadow: true, // Sombra de ventana
        thickFrame: false, // Marco delgado
        skipTaskbar: false, // Mostrar en la barra de tareas
        title: 'Arc Container' // Título para la barra de tareas
    });

    // Cargar el archivo HTML principal
    mainWindow.loadFile('index-premium.html');

    // Mostrar ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('🎉 Arc Container window ready and shown');
        
        // Configurar para que aparezca en la barra de inicio
        if (process.platform === 'win32') {
                            // Configurar detalles de la aplicación para Windows
                // mainWindow.setAppDetails({
                //     appId: 'com.arccontainer.app',
                //     appIconPath: path.join(__dirname, 'assets', 'image-removebg-preview.png'),
                //     appIconIndex: 0,
                //     relaunchDisplayName: 'Arc Container',
                //     relaunchCommand: process.execPath
                // });
        }
        
        // Mostrar notificación de bienvenida después de un delay
        setTimeout(showWelcomeNotification, 3000);
    });

    // Prevenir cierre accidental
    mainWindow.on('close', (event) => {
        console.log('🔄 Window close requested');
        // Obtener configuración de "cerrar a la bandeja"
        const settings = store.get('arcContainerSettings', {});
        const closeToTray = settings.closeToTray !== false; // Por defecto true
        
        if (closeToTray) {
            console.log('🔄 Minimizing to tray instead of closing');
            event.preventDefault();
            mainWindow.hide();
        } else {
            console.log('❌ Closing application completely');
            // Limpiar el tray
            if (tray) {
                tray.destroy();
            }
        }
    });

    // Manejar cierre de ventana
    mainWindow.on('closed', () => {
        console.log('❌ Window closed');
        mainWindow = null;
    });

    // Manejar cierre completo de la aplicación
    app.on('before-quit', () => {
        console.log('🔄 Application quitting');
        // Limpiar el tray
        if (tray) {
            tray.destroy();
        }
    });

    // Manejar cuando se hace clic en la aplicación desde la barra de tareas
    app.on('second-instance', () => {
        console.log('🔄 Second instance detected, focusing main window');
        if (mainWindow) {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.show();
            mainWindow.focus();
        }
    });

    // Detectar cambios en el estado de maximización
    mainWindow.on('maximize', () => {
        console.log('📱 Window maximized');
        mainWindow.webContents.send('window-state-changed', true);
    });

    mainWindow.on('unmaximize', () => {
        console.log('📱 Window unmaximized');
        mainWindow.webContents.send('window-state-changed', false);
    });

    // Crear el system tray
    createTray();

    // Configuración de webviews EXACTA de Rambox - Solo lo esencial
    mainWindow.webContents.on('will-attach-webview', (event, webPreferences, params) => {
        console.log('Creating webview for:', params.src);
        
        // Configuración IDÉNTICA a Rambox que funciona sin errores CSP
        // Solo configurar lo que Rambox configura - nada más
        webPreferences.nodeIntegration = false; // Rambox usa false para webviews
        webPreferences.plugins = true; // Rambox usa true - CRÍTICO para WASM
        webPreferences.enableRemoteModule = true; // Rambox usa true
        webPreferences.contextIsolation = false; // Rambox usa false
        webPreferences.spellcheck = false; // Rambox usa false
        // SIN webSecurity, allowRunningInsecureContent, etc. - Rambox NO los usa
        
        // User Agent moderno para servicios que requieren Chrome reciente
        if (params.src.includes('spotify')) {
            // Spoofing más agresivo para Spotify - simular Chrome 120 completo
            webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            webPreferences.webSecurity = false; // Deshabilitar para Spotify específicamente
            webPreferences.experimentalFeatures = true; // Habilitar features experimentales
            console.log('🎵 Spotify: Using AGGRESSIVE Chrome spoofing + webSecurity disabled');
        } else if (params.src.includes('instagram')) {
            webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            console.log('📷 Instagram: Using modern Chrome User Agent');
        } else if (params.src.includes('discord')) {
            webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
            console.log('🎮 Discord: Using modern Chrome User Agent');
        }
        
        // Partición por servicio para mejor aislamiento (como Rambox)
        // DETECCIÓN SIMPLIFICADA: Basada en partición
        // El HTML ya asigna partition = `persist:${serviceId}`
        const serviceIdFromPartition = params.partition ? params.partition.replace('persist:', '') : null;
        const isWhatsAppBusiness = serviceIdFromPartition === 'whatsapp-business';
        
        console.log('🔍 Service detection:', { 
            src: params.src, 
            partition: params.partition, 
            serviceId: serviceIdFromPartition,
            isWhatsAppBusiness: isWhatsAppBusiness 
        });
        
        const serviceId = serviceIdFromPartition || 
                         (params.src.includes('web.whatsapp.com') ? 'whatsapp' : 
                          params.src.includes('messenger') ? 'messenger' :
                          params.src.includes('telegram') ? 'telegram' :
                          params.src.includes('discord') ? 'discord' :
                          params.src.includes('gmail') ? 'gmail' :
                          params.src.includes('instagram') ? 'instagram' :
                          params.src.includes('twitter') ? 'twitter' :
                          params.src.includes('linkedin') ? 'linkedin' :
                          params.src.includes('slack') ? 'slack' :
                          params.src.includes('teams') ? 'teams' :
                          params.src.includes('notion') ? 'notion' :
                          params.src.includes('spotify') ? 'spotify' : 'default');
        
        webPreferences.partition = `persist:${serviceId}`;
        
        // User Agent específico para WhatsApp Business (como Rambox)
        // IMPORTANTE: NO usar "WhatsAppBusiness" en el User Agent porque WhatsApp
        // redirecciona automáticamente a business.whatsapp.com
        if (isWhatsAppBusiness) {
            // Usar el MISMO User Agent que WhatsApp normal para evitar redirección
            webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
            console.log('🏢 WhatsApp Business: Using STANDARD User Agent to avoid business.whatsapp.com redirect');
        } else if (params.src.includes('web.whatsapp.com')) {
            webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
            console.log('💬 WhatsApp Personal: Using standard User Agent');
        }
        
        console.log('Webview configured with EXACT Rambox settings for:', params.src);
    });

    // Manejar nuevas ventanas
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Abrir enlaces externos en el navegador predeterminado
        require('electron').shell.openExternal(url);
        return { action: 'deny' };
    });

    // Abrir DevTools en desarrollo (comentar en producción)
    // mainWindow.webContents.openDevTools();
}

// Eventos de la aplicación
app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC handlers para comunicación con el renderer
ipcMain.handle('get-config', () => {
    return store.get('appConfig', getDefaultConfig());
});

ipcMain.handle('save-config', (event, config) => {
    store.set('appConfig', config);
    return true;
});

ipcMain.handle('get-last-active-service', () => {
    return store.get('lastActiveService', 'whatsapp');
});

ipcMain.handle('save-last-active-service', (event, serviceId) => {
    store.set('lastActiveService', serviceId);
    return true;
});

// Manejadores para controles de ventana
ipcMain.handle('minimize-window', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

ipcMain.handle('toggle-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.handle('close-window', () => {
    if (mainWindow) {
        // Obtener configuración de "cerrar a la bandeja"
        const settings = store.get('arcContainerSettings', {});
        const closeToTray = settings.closeToTray !== false; // Por defecto true
        
        if (closeToTray) {
            console.log('🔄 Minimizing to tray instead of closing');
            mainWindow.hide();
        } else {
            console.log('❌ Closing application');
            mainWindow.close();
        }
    }
});

// Handler para obtener configuración
ipcMain.handle('get-settings', () => {
    return store.get('arcContainerSettings', {});
});

// Handler para guardar configuración
ipcMain.handle('save-settings', (event, settings) => {
    store.set('arcContainerSettings', settings);
    return true;
});

// ================ SISTEMA DE NOTIFICACIONES ================

// Función para crear notificaciones con estilo Arc Container
function createArcNotification(title, body, service = 'arc-container') {
    if (!Notification.isSupported()) return;

    // Configuración específica por servicio
    const serviceConfig = getServiceNotificationConfig(service);
    
    const notification = new Notification({
        title: serviceConfig.emoji ? `${serviceConfig.emoji} ${title}` : `🚀 ${title}`,
        body: body,
        icon: path.join(__dirname, 'assets', 'icon.png'),
        silent: false,
        timeoutType: 'default',
        urgency: 'normal'
    });

    notification.on('click', () => {
        // Enfocar la ventana principal cuando se haga clic en la notificación
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
            // Opcional: cambiar al servicio específico
            mainWindow.webContents.send('focus-service', service);
        }
    });

    notification.show();
    return notification;
}

// Configuración de notificaciones por servicio
function getServiceNotificationConfig(serviceId) {
    const configs = {
        'whatsapp': { name: 'WhatsApp', emoji: '💬', color: '#25D366' },
        'messenger': { name: 'Messenger', emoji: '💬', color: '#0084FF' },
        'telegram': { name: 'Telegram', emoji: '✈️', color: '#0088CC' },
        'discord': { name: 'Discord', emoji: '🎮', color: '#5865F2' },
        'gmail': { name: 'Gmail', emoji: '📧', color: '#EA4335' },
        'instagram': { name: 'Instagram', emoji: '📷', color: '#E4405F' },
        'twitter': { name: 'Twitter', emoji: '🐦', color: '#1DA1F2' },
        'linkedin': { name: 'LinkedIn', emoji: '💼', color: '#0077B5' },
        'slack': { name: 'Slack', emoji: '💬', color: '#4A154B' },
        'teams': { name: 'Teams', emoji: '👥', color: '#6264A7' },
        'notion': { name: 'Notion', emoji: '📝', color: '#000000' },
        'spotify': { name: 'Spotify', emoji: '🎵', color: '#1DB954' },
        'arc-container': { name: 'Arc Container', emoji: '🚀', color: '#007AFF' }
    };
    return configs[serviceId] || configs['arc-container'];
}

// Manejador IPC para mostrar notificaciones desde el renderer
ipcMain.handle('show-notification', (event, { title, body, service }) => {
    return createArcNotification(title, body, service);
});

// Notificación de bienvenida al iniciar
function showWelcomeNotification() {
    setTimeout(() => {
        createArcNotification(
            'Bienvenido a Arc Container',
            'Tu centro de comando para todas las aplicaciones web. ¡Todo listo para usar!',
            'arc-container'
        );
    }, 2000); // Esperar 2 segundos después del inicio
}

// Configuración por defecto
function getDefaultConfig() {
    return {
        services: [
            {
                id: "whatsapp",
                name: "WhatsApp",
                url: "https://web.whatsapp.com/",
                icon: "fab fa-whatsapp",
                backgroundColor: "#25D366",
                enabled: true,
                position: 1
            },
            {
                id: "messenger",
                name: "Messenger",
                url: "https://www.messenger.com/",
                icon: "fab fa-facebook-messenger",
                backgroundColor: "#1877F2",
                enabled: true,
                position: 2
            },
            {
                id: "telegram",
                name: "Telegram",
                url: "https://web.telegram.org/",
                icon: "fab fa-telegram-plane",
                backgroundColor: "#0088cc",
                enabled: true,
                position: 3
            },
            {
                id: "discord",
                name: "Discord",
                url: "https://discord.com/app",
                icon: "fab fa-discord",
                backgroundColor: "#5865F2",
                enabled: true,
                position: 4
            },
            {
                id: "gmail",
                name: "Gmail",
                url: "https://mail.google.com/mail/u/0/",
                icon: "fas fa-envelope", 
                backgroundColor: "#EA4335",
                enabled: true,
                position: 5
            },
            {
                id: "instagram",
                name: "Instagram",
                url: "https://www.instagram.com/direct/inbox/",
                icon: "fab fa-instagram",
                backgroundColor: "#E4405F",
                enabled: true,
                position: 6
            },
            {
                id: "twitter",
                name: "Twitter/X",
                url: "https://twitter.com/",
                icon: "fab fa-twitter",
                backgroundColor: "#1DA1F2",
                enabled: true,
                position: 7
            },
            {
                id: "linkedin",
                name: "LinkedIn",
                url: "https://www.linkedin.com/messaging/",
                icon: "fab fa-linkedin",
                backgroundColor: "#0A66C2",
                enabled: true,
                position: 8
            },
            {
                id: "slack",
                name: "Slack",
                url: "https://app.slack.com/",
                icon: "fab fa-slack",
                backgroundColor: "#4A154B",
                enabled: true,
                position: 9
            },
            {
                id: "teams",
                name: "Microsoft Teams",
                url: "https://teams.microsoft.com/",
                icon: "fab fa-microsoft",
                backgroundColor: "#6264A7",
                enabled: true,
                position: 10
            },
            {
                id: "notion",
                name: "Notion",
                url: "https://www.notion.so/",
                icon: "fas fa-sticky-note",
                backgroundColor: "#000000",
                enabled: true,
                position: 11
            },
            {
                id: "spotify",
                name: "Spotify",
                url: "https://open.spotify.com/?_gl=1",
                icon: "fab fa-spotify",
                backgroundColor: "#1DB954",
                enabled: true,
                position: 12
            }
        ],
        preferences: {
            theme: "default",
            autoStartLastService: true,
            showNotifications: true,
            minimizeToTray: true,
            startMinimized: false,
            closeToTray: true
        }
    };
}

// ================ SYSTEM TRAY ================

function createTray() {
    // Crear ícono del tray con ícono por defecto para mejor compatibilidad
    let trayIcon;
    
    try {
        // Intentar usar el logo principal de la aplicación
        const iconPath = path.join(__dirname, 'assets', 'image-removebg-preview.png');
        trayIcon = nativeImage.createFromPath(iconPath);
        console.log('✅ Using main application logo for tray');
    } catch (error) {
        console.log('⚠️ Logo not found, using default Electron icon');
        // Usar ícono por defecto de Electron
        trayIcon = nativeImage.createEmpty();
    }
    
    // En Windows, el ícono del tray debe ser de 16x16 píxeles
    const trayIcon16 = trayIcon.resize({ width: 16, height: 16 });
    
    tray = new Tray(trayIcon16);
    tray.setToolTip('Arc Container - Centro de aplicaciones web');
    
    // Crear menú contextual del tray
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '📦 Mostrar Arc Container',
            click: () => {
                if (mainWindow) {
                    if (mainWindow.isMinimized()) {
                        mainWindow.restore();
                    }
                    mainWindow.show();
                    mainWindow.focus();
                }
            }
        },
        { type: 'separator' },
        {
            label: '💬 WhatsApp',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('switch-to-service', 'whatsapp');
                }
            }
        },
        {
            label: '💬 Messenger',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('switch-to-service', 'messenger');
                }
            }
        },
        {
            label: '📧 Gmail',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('switch-to-service', 'gmail');
                }
            }
        },
        {
            label: '🎮 Discord',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('switch-to-service', 'discord');
                }
            }
        },
        { type: 'separator' },
        {
            label: '⚙️ Configuración',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                    mainWindow.focus();
                    mainWindow.webContents.send('open-settings');
                }
            }
        },
        { type: 'separator' },
        {
            label: '❌ Salir',
            click: () => {
                app.quit();
            }
        }
    ]);
    
    tray.setContextMenu(contextMenu);
    
    // Click en el ícono del tray para mostrar/ocultar la ventana
    tray.on('click', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                if (mainWindow.isMinimized()) {
                    mainWindow.restore();
                }
                mainWindow.show();
                mainWindow.focus();
            }
        }
    });
    
    console.log('📱 System tray created');
}
