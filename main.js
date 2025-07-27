const { app, BrowserWindow, ipcMain, Notification, nativeImage, Tray, Menu, globalShortcut, screen } = require('electron');
const path = require('path');
const iconConfig = require('./icon-config');
const Store = require('electron-store');

app.commandLine.appendSwitch('--disable-features', 'CrossOriginOpenerPolicy');
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const store = new Store();
const APP_ID = 'com.arccontainer.app.v2';

app.setName('Arc Container');
app.setAppUserModelId(APP_ID);

if (process.platform === 'win32') {
    try {
        const iconPath = path.join(__dirname, 'assets', 'logo.ico');
        const fs = require('fs');
        if (fs.existsSync(iconPath)) {
            app.setPath('userData', path.join(app.getPath('appData'), 'Arc Container'));
            console.log('✅ Windows app icon configured');
        }
    } catch (error) {
        console.log('⚠️ Could not configure Windows app icon:', error.message);
    }
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
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0f0f0f',
        vibrancy: 'dark',
        transparent: false,
        webPreferences: {
            enableRemoteModule: true,
            plugins: true,
            partition: 'persist:arc-container',
            nodeIntegration: true,
            webviewTag: true,
            contextIsolation: false,
            spellcheck: false
        },
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        show: false,
        roundedCorners: true,
        shadow: true,
        thickFrame: false,
        skipTaskbar: false,
        title: 'Arc Container'
    });

    // Cargar el archivo HTML principal
    mainWindow.loadFile('index-premium.html');

    // Mostrar ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        console.log('🎉 Arc Container window ready and shown');
        
        // Configurar para que aparezca en la barra de inicio
        if (process.platform === 'win32') {
            try {
                // Configurar detalles de la aplicación para Windows
                const iconPath = path.join(__dirname, 'assets', 'logo.ico');
                const fs = require('fs');
                if (fs.existsSync(iconPath)) {
                    mainWindow.setAppDetails({
                        appId: 'com.arccontainer.app',
                        appIconPath: iconPath,
                        appIconIndex: 0,
                        relaunchDisplayName: 'Arc Container',
                        relaunchCommand: process.execPath
                    });
                    console.log('✅ Windows taskbar icon configured');
                } else {
                    console.log('⚠️ Icon file not found for taskbar');
                }
            } catch (error) {
                console.log('⚠️ Could not configure Windows taskbar icon:', error.message);
            }
        }
        
        // Mostrar notificación de bienvenida después de un delay
        setTimeout(showWelcomeNotification, 3000);
        
        // Configurar icono de la barra de tareas después de que la ventana esté completamente cargada
        setTimeout(() => {
            configureTaskbarIcon();
        }, 2000);
    });
    
    // Función para configurar el icono de la barra de tareas
    function configureTaskbarIcon() {
        if (process.platform === 'win32' && iconConfig.exists()) {
            try {
                mainWindow.setAppDetails(iconConfig.windowsConfig);
                mainWindow.setIcon(iconConfig.iconPath);
                mainWindow.flashFrame(false);
                mainWindow.focus();
                
                setTimeout(() => {
                    mainWindow.setIcon(iconConfig.iconPath);
                    console.log('✅ Taskbar icon configured successfully');
                }, 500);
            } catch (error) {
                console.log('⚠️ Could not configure taskbar icon:', error.message);
            }
        }
    }

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
        
        // Ajustar el tamaño cuando se restaura para que sea más pequeño
        setTimeout(() => {
            if (!mainWindow.isMaximized()) {
                const { screen } = require('electron');
                const primaryDisplay = screen.getPrimaryDisplay();
                const { width, height } = primaryDisplay.workAreaSize;
                
                // Calcular un tamaño más pequeño (como una ventana de Chrome)
                const newWidth = Math.min(1100, width * 0.8);
                const newHeight = Math.min(750, height * 0.8);
                
                // Centrar la ventana
                const x = Math.round((width - newWidth) / 2);
                const y = Math.round((height - newHeight) / 2);
                
                mainWindow.setBounds({ x, y, width: newWidth, height: newHeight });
                console.log('📐 Window resized to:', newWidth, 'x', newHeight);
            }
        }, 100);
    });

    // Crear el system tray
    createTray();

    // Configurar atajos de teclado para mover la ventana
    setupWindowMovementShortcuts();

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
            console.log('📱 Window restored from maximized state');
        } else {
            mainWindow.maximize();
            console.log('📱 Window maximized');
        }
    }
});

ipcMain.handle('get-window-state', () => {
    if (mainWindow) {
        return mainWindow.isMaximized();
    }
    return false;
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
    let trayIcon;
    const iconPath = path.join(__dirname, 'assets', 'logo.ico');
    
    try {
        const fs = require('fs');
        if (fs.existsSync(iconPath)) {
            trayIcon = nativeImage.createFromPath(iconPath);
            console.log('✅ Using main application logo for tray');
        } else {
            throw new Error('Icon file does not exist');
        }
    } catch (error) {
        trayIcon = nativeImage.createEmpty();
    }
    
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

function setupWindowMovementShortcuts() {
    if (process.platform !== 'win32') return;

    function moveWindow(direction) {
        if (!mainWindow || mainWindow.isMaximized()) return;

        const primaryDisplay = screen.getPrimaryDisplay();
        const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
        const currentBounds = mainWindow.getBounds();
        
        let newX = currentBounds.x;
        let newY = currentBounds.y;
        const step = 50;

        switch (direction) {
            case 'up':
                newY = Math.max(0, currentBounds.y - step);
                break;
            case 'down':
                newY = Math.min(screenHeight - currentBounds.height, currentBounds.y + step);
                break;
            case 'left':
                newX = Math.max(0, currentBounds.x - step);
                break;
            case 'right':
                newX = Math.min(screenWidth - currentBounds.width, currentBounds.x + step);
                break;
        }

        mainWindow.setPosition(newX, newY);
        console.log(`🔄 Window moved ${direction}: (${newX}, ${newY})`);
    }

    const shortcuts = [
        { combo: 'Alt+Up', direction: 'up' },
        { combo: 'Alt+Down', direction: 'down' },
        { combo: 'Alt+Left', direction: 'left' },
        { combo: 'Alt+Right', direction: 'right' },
        { combo: 'CommandOrControl+Shift+Up', direction: 'up' },
        { combo: 'CommandOrControl+Shift+Down', direction: 'down' },
        { combo: 'CommandOrControl+Shift+Left', direction: 'left' },
        { combo: 'CommandOrControl+Shift+Right', direction: 'right' }
    ];

    shortcuts.forEach(({ combo, direction }) => {
        const registered = globalShortcut.register(combo, () => moveWindow(direction));
        if (registered) {
            console.log(`✅ Shortcut registered: ${combo} (move ${direction})`);
        }
    });
}
