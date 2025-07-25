# Guía de Configuración con Nextcloud

## 🔄 Configuración de Sincronización

### Paso 1: Preparar Nextcloud

1. **Instalar Nextcloud Server** (si no lo tienes):
   - Opción fácil: [Nextcloud Provider](https://nextcloud.com/providers/) o [Nextcloud hosting](https://nextcloud.com/buy/)
   - Autoalojamiento: [Documentación oficial](https://docs.nextcloud.com/server/latest/admin_manual/installation/)

2. **Instalar Cliente de Escritorio**:
   - Descargar desde: https://nextcloud.com/install/#install-clients
   - Instalar en cada PC donde uses la aplicación

### Paso 2: Configurar Carpeta de Sincronización

#### Ubicaciones de Configuración por SO:

**Windows:**
```
%APPDATA%\my-app-container\
```
Ruta completa: `C:\Users\[usuario]\AppData\Roaming\my-app-container\`

**macOS:**
```
~/Library/Application Support/my-app-container/
```

**Linux:**
```
~/.config/my-app-container/
```

#### Configurar Nextcloud Client:

1. Abrir cliente de Nextcloud
2. Ir a "Configuración" → "Sincronización"
3. Agregar nueva carpeta sincronizada:
   - **Carpeta local**: La ruta de configuración de tu SO (ver arriba)
   - **Carpeta remota**: `/AppContainer-Config/` (o el nombre que prefieras)
4. Activar sincronización bidireccional

### Paso 3: Estructura de Archivos Sincronizados

```
Nextcloud/AppContainer-Config/
├── config.json              # Configuración principal
├── user-preferences.json    # Preferencias del usuario
└── custom-services.json     # Servicios personalizados
```

### Paso 4: Configuración Avanzada

#### Archivo config.json completo:
```json
{
  "version": "1.0.0",
  "lastUpdate": "2025-01-20T10:30:00Z",
  "services": [
    {
      "id": "whatsapp",
      "name": "WhatsApp",
      "url": "https://web.whatsapp.com/",
      "icon": "WA",
      "backgroundColor": "#25D366",
      "enabled": true,
      "position": 1
    },
    {
      "id": "facebook",
      "name": "Facebook Messenger",
      "url": "https://www.messenger.com/",
      "icon": "FB",
      "backgroundColor": "#1877F2",
      "enabled": true,
      "position": 2
    },
    {
      "id": "gmail",
      "name": "Gmail",
      "url": "https://mail.google.com/mail/u/0/",
      "icon": "GM",
      "backgroundColor": "#EA4335",
      "enabled": true,
      "position": 3
    },
    {
      "id": "telegram",
      "name": "Telegram",
      "url": "https://web.telegram.org/",
      "icon": "TG",
      "backgroundColor": "#0088cc",
      "enabled": true,
      "position": 4
    },
    {
      "id": "discord",
      "name": "Discord",
      "url": "https://discord.com/app",
      "icon": "DC",
      "backgroundColor": "#5865F2",
      "enabled": false,
      "position": 5
    }
  ],
  "preferences": {
    "theme": "default",
    "autoStartLastService": true,
    "showNotifications": true,
    "minimizeToTray": true
  }
}
```

## 🔧 Resolución de Problemas

### Problema: Configuración no se sincroniza

**Solución:**
1. Verificar que Nextcloud esté funcionando:
   ```bash
   # En el cliente de Nextcloud, verificar estado
   ```
2. Comprobar permisos de la carpeta
3. Reiniciar aplicación después de cambios

### Problema: Conflictos de sincronización

**Solución:**
1. Nextcloud creará archivos `.conflict` automáticamente
2. Resolver manualmente eligiendo la versión correcta
3. Eliminar archivos de conflicto

### Problema: Aplicación no detecta cambios

**Solución:**
1. La aplicación se actualiza al reiniciar
2. Implementar watcher de archivos (desarrollo futuro)

## 🚀 Mejoras Futuras

### Sincronización en Tiempo Real
```javascript
// Propuesta para watcher de configuración
const chokidar = require('chokidar');

const watcher = chokidar.watch(configPath);
watcher.on('change', () => {
  // Recargar configuración automáticamente
  loadConfiguration();
});
```

### Backup Automático
```javascript
// Crear backups con timestamp
const backup = {
  timestamp: new Date().toISOString(),
  config: currentConfig,
  version: app.getVersion()
};
```

## 📱 Servicios Adicionales Sugeridos

```json
{
  "id": "notion",
  "name": "Notion",
  "url": "https://www.notion.so/",
  "icon": "NO",
  "backgroundColor": "#000000"
},
{
  "id": "slack",
  "name": "Slack",
  "url": "https://app.slack.com/",
  "icon": "SL", 
  "backgroundColor": "#4A154B"
},
{
  "id": "trello",
  "name": "Trello",
  "url": "https://trello.com/",
  "icon": "TR",
  "backgroundColor": "#0079BF"
},
{
  "id": "spotify",
  "name": "Spotify",
  "url": "https://open.spotify.com/",
  "icon": "SP",
  "backgroundColor": "#1DB954"
}
```

## 🔐 Consideraciones de Seguridad

### Lo que SÍ se sincroniza:
- ✅ Lista de servicios configurados
- ✅ Preferencias de la aplicación
- ✅ Temas y configuraciones visuales
- ✅ Atajos personalizados

### Lo que NO se sincroniza (por seguridad):
- ❌ Cookies de sesión
- ❌ Tokens de autenticación
- ❌ Datos de navegación privados
- ❌ Cache de aplicaciones web

Esto es por diseño y garantiza la seguridad de tus cuentas.
