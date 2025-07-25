const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Configurar argumentos de línea de comandos para evitar errores de cache
app.commandLine.appendSwitch('--disable-web-security');
app.commandLine.appendSwitch('--disable-features', 'VizDisplayCompositor');
app.commandLine.appendSwitch('--ignore-certificate-errors');
app.commandLine.appendSwitch('--ignore-ssl-errors');
app.commandLine.appendSwitch('--ignore-certificate-errors-spki-list');
app.commandLine.appendSwitch('--disable-gpu-sandbox');

// Importar electron-store con ES6 import syntax
let Store;
let store;

// Función para inicializar store de forma asíncrona
async function initStore() {
    const { default: ElectronStore } = await import('electron-store');
    Store = ElectronStore;
    store = new Store();
}

let mainWindow;

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
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false, // Deshabilitado temporalmente para debug
            enableRemoteModule: false,
            allowRunningInsecureContent: true,
            experimentalFeatures: true,
            webviewTag: true, // Habilitar webview tags
            preload: path.join(__dirname, 'preload.js'),
            partition: 'persist:main'
        },
        icon: path.join(__dirname, 'assets', 'icon.png'), // Opcional: agregar icono
        show: false, // No mostrar hasta que esté listo
        roundedCorners: true, // Esquinas redondeadas (Windows 11)
        shadow: true, // Sombra de ventana
        thickFrame: false // Marco delgado
    });

    // Cargar el archivo HTML principal
    mainWindow.loadFile('index-premium.html');

    // Mostrar ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Manejar cierre de ventana
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Configuración de seguridad para webviews simplificada para debug
    mainWindow.webContents.on('will-attach-webview', (event, webPreferences, params) => {
        console.log('Creating webview for:', params.src);
        
        // Configurar webPreferences para cada webview
        webPreferences.nodeIntegration = false;
        webPreferences.contextIsolation = true;
        webPreferences.enableRemoteModule = false;
        webPreferences.webSecurity = false; // Temporalmente false para debug
        webPreferences.allowRunningInsecureContent = true;
        
        // Configurar User Agent para simular Chrome más reciente
        webPreferences.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
        
        // Log para debug
        console.log('Webview allowed:', params.src);
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
app.whenReady().then(async () => {
    await initStore();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        if (!store) await initStore();
        createWindow();
    }
});

// IPC handlers para comunicación con el renderer
ipcMain.handle('get-config', () => {
    if (!store) return getDefaultConfig();
    return store.get('appConfig', getDefaultConfig());
});

ipcMain.handle('save-config', (event, config) => {
    if (!store) return false;
    store.set('appConfig', config);
    return true;
});

ipcMain.handle('get-last-active-service', () => {
    if (!store) return 'whatsapp';
    return store.get('lastActiveService', 'whatsapp');
});

ipcMain.handle('save-last-active-service', (event, serviceId) => {
    if (!store) return false;
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
        mainWindow.close();
    }
});

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
                url: "https://open.spotify.com/",
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
