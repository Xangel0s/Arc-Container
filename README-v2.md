# 🚀 My App Container - Versión Rambox Style

Un contenedor de aplicaciones web avanzado desarrollado con Electron que funciona como **Rambox**, **Franz** o **Ferdi**. Permite gestionar múltiples cuentas de servicios web con perfiles independientes y sincronización via Nextcloud.

## ✨ Nuevas Características v2.0

### 🎯 **Funcionalidades Tipo Rambox**
- **12+ Servicios Preconfigurados**: WhatsApp, Messenger, Telegram, Discord, Gmail, Instagram, Twitter/X, LinkedIn, Slack, Teams, Notion, Spotify
- **Perfiles Independientes**: Cada servicio mantiene su propia sesión y datos
- **Badges de Notificación**: Contadores visuales de mensajes no leídos
- **Indicadores de Estado**: Loading, conectado, error para cada servicio
- **Gestión Visual**: Habilitar/deshabilitar servicios desde la interfaz
- **Menú Contextual**: Click derecho en los iconos para opciones avanzadas

### 🎨 **Interfaz Mejorada**
- **Sidebar Expandido**: Más espacio para iconos y mejor organización
- **Toolbar Inferior**: Acceso rápido a funciones principales
- **Modal de Configuración**: Gestión visual de servicios
- **Tema Oscuro**: Soporte para modo oscuro (en desarrollo)
- **Responsive**: Adaptación a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves y feedback visual

### 🔧 **Controles Avanzados**
- **Configuración Visual**: Modal para habilitar/deshabilitar servicios
- **Gestión de Notificaciones**: Silenciar todas las notificaciones
- **Recarga Inteligente**: Recargar servicios individuales
- **DevTools**: Acceso a herramientas de desarrollo
- **Agregar Servicios**: Añadir nuevos servicios personalizados

## 📱 **Servicios Incluidos**

### 🟢 **Habilitados por Defecto**
1. **WhatsApp Web** - `Ctrl+1`
2. **Messenger** - `Ctrl+2` 
3. **Telegram Web** - `Ctrl+3`
4. **Discord** - `Ctrl+4`
5. **Gmail** - `Ctrl+5`
6. **Instagram DM** - `Ctrl+6`
7. **Twitter/X** - `Ctrl+7`
8. **LinkedIn Messages** - `Ctrl+8`

### 🟡 **Disponibles (Deshabilitados)**
9. **Slack**
10. **Microsoft Teams**
11. **Notion**
12. **Spotify**
13. **YouTube**
14. **Netflix**
15. **Twitch**

## 🎮 **Controles y Atajos**

### ⌨️ **Atajos de Teclado**
- `Ctrl+1-9`: Cambiar entre servicios
- `Ctrl+R`: Recargar servicio actual
- `F12`: Abrir DevTools
- `Ctrl+,`: Configuración (próximamente)

### 🖱️ **Controles de Mouse**
- **Click Izquierdo**: Cambiar de servicio
- **Click Derecho**: Menú contextual (próximamente)
- **Hover**: Vista previa y efectos visuales

### 🎛️ **Toolbar Superior**
- 🔄 **Recargar**: Refresca el servicio actual
- 🔧 **DevTools**: Herramientas de desarrollador
- ⚙️ **Configuración**: Gestionar servicios

### 🎛️ **Toolbar Inferior**
- 🔕 **Silenciar**: Silenciar todas las notificaciones
- 📱 **Gestionar**: Habilitar/deshabilitar servicios
- 🌙 **Tema**: Cambiar entre tema claro/oscuro
- ➖ **Minimizar**: Minimizar aplicación

## 🔧 **Configuración Avanzada**

### 📁 **Estructura de Configuración**
```json
{
  "services": [
    {
      "id": "whatsapp",
      "name": "WhatsApp",
      "url": "https://web.whatsapp.com/",
      "icon": "WA",
      "backgroundColor": "#25D366",
      "enabled": true,
      "position": 1
    }
  ],
  "preferences": {
    "theme": "default",
    "autoStartLastService": true,
    "showNotifications": true,
    "minimizeToTray": true,
    "notificationSound": true,
    "badgeCount": true
  }
}
```

### ⚙️ **Personalización**
- **Habilitar/Deshabilitar**: Servicios desde la interfaz
- **Reordenar**: Cambiar posición de los servicios
- **Colores**: Personalizar colores de fondo
- **URLs**: Modificar URLs de servicios
- **Iconos**: Cambiar iconos de servicios

## 🚀 **Instalación y Uso**

### 💿 **Instalación Rápida**
```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd my-app-container

# Instalar dependencias
npm install

# Ejecutar aplicación
npm start
```

### 🖥️ **Scripts Disponibles**
```bash
npm start           # Ejecutar aplicación
npm run dev         # Modo desarrollo con logs
npm run build-win   # Construir para Windows
npm run build-mac   # Construir para macOS
npm run build-linux # Construir para Linux
```

### 🛠️ **Scripts de Utilidades**
```powershell
# Windows PowerShell
.\dev-utils.ps1     # Menú interactivo
.\launch.ps1        # Launcher avanzado

# Windows Batch
start-app.bat       # Inicio rápido
start-electron.bat  # Inicio directo con Electron
```

## ☁️ **Sincronización con Nextcloud**

### 📂 **Ubicaciones de Configuración**
- **Windows**: `%APPDATA%\my-app-container\`
- **macOS**: `~/Library/Application Support/my-app-container/`
- **Linux**: `~/.config/my-app-container/`

### 🔄 **Qué se Sincroniza**
- ✅ Lista de servicios configurados
- ✅ Preferencias de la aplicación
- ✅ Posición y estado de servicios
- ✅ Configuraciones visuales
- ❌ Sesiones/cookies (por seguridad)

### 📋 **Setup Nextcloud**
1. Instalar cliente Nextcloud en cada PC
2. Configurar sincronización de la carpeta de configuración
3. ¡Listo! La configuración se sincroniza automáticamente

## 🔒 **Seguridad y Privacidad**

### 🛡️ **Características de Seguridad**
- **Context Isolation**: Aislamiento total entre servicios
- **Particiones Persistentes**: Cada servicio tiene su propia sesión
- **No Node Integration**: Los servicios web no pueden acceder a Node.js
- **User Agent**: User agent nativo para mejor compatibilidad
- **Popup Blocking**: Control de ventanas emergentes

### 🔐 **Privacidad**
- **Datos Locales**: Todas las sesiones se almacenan localmente
- **Sin Telemetría**: No se envían datos a servidores externos
- **Control Total**: Tú decides qué servicios usar

## 🎨 **Personalización Visual**

### 🌈 **Temas**
- **Tema Claro**: Interfaz clara y moderna
- **Tema Oscuro**: Modo oscuro para menor fatiga visual (próximamente)
- **Personalizable**: Colores y estilos modificables

### 📱 **Responsive Design**
- **Desktop**: Optimizado para escritorio
- **Laptop**: Adaptación a pantallas medianas
- **Tablet**: Interfaz táctil (próximamente)

## 🔮 **Próximas Funcionalidades**

### 🚧 **En Desarrollo**
- [ ] Menú contextual completo
- [ ] Tema oscuro funcional
- [ ] Minimizar a system tray
- [ ] Notificaciones nativas del sistema
- [ ] Auto-updater
- [ ] Soporte para plugins
- [ ] Profiles múltiples por servicio
- [ ] Backup automático de configuración

### 💡 **Ideas Futuras**
- [ ] Integración con calendarios
- [ ] Comandos de voz
- [ ] Modo picture-in-picture
- [ ] Grabador de pantalla integrado
- [ ] VPN integrada
- [ ] Traducción automática

## 🆘 **Solución de Problemas**

### ❗ **Problemas Comunes**

**1. Los servicios no cargan**
```bash
# Limpiar caché
rm -rf %APPDATA%\my-app-container\Partitions
npm start
```

**2. Error de Store constructor**
```bash
# Reinstalar dependencias
npm run clean-install
```

**3. Configuración no se guarda**
```bash
# Verificar permisos de escritura
# Ejecutar como administrador si es necesario
```

### 🔧 **Logs y Debug**
```bash
# Ejecutar con logs detallados
npm run dev

# Abrir DevTools en la aplicación
F12 o botón 🔧
```

## 📊 **Requisitos del Sistema**

### 💻 **Mínimos**
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB (8GB recomendado)
- **Espacio**: 500MB
- **Internet**: Conexión estable

### 🚀 **Recomendados**
- **RAM**: 8GB+
- **CPU**: Multi-core
- **SSD**: Para mejor rendimiento
- **Pantalla**: 1920x1080+

## 🤝 **Contribuir**

### 🔧 **Para Desarrolladores**
1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Crear Pull Request

### 🐛 **Reportar Bugs**
- Usar GitHub Issues
- Incluir logs y screenshots
- Especificar OS y versión

## 📄 **Licencia**

Este proyecto está bajo la **Licencia MIT**. Ver `LICENSE` para más detalles.

## 🙏 **Agradecimientos**

- **Electron Team** - Framework base
- **Rambox** - Inspiración de diseño
- **Franz/Ferdi** - Conceptos de funcionalidad
- **Nextcloud** - Solución de sincronización

---

**¿Te gusta el proyecto? ⭐ ¡Dale una estrella en GitHub!**
