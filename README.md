# 🚀 Arc Container - Professional App Manager

> La aplicación definitiva para gestionar múltiples servicios web en un solo lugar. Una alternativa moderna, gratuita y de código abierto a Rambox, Franz y similares.

![Arc Container Preview](https://img.shields.io/badge/Electron-37.2.4-9FEAF9?style=for-the-badge&logo=electron)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=for-the-badge)

## ✨ Características principales

### 🎨 **5 Interfaces profesionales**
- **Premium Edition** - Elegante y refinada (Recomendada)
- **Arc Style** - Ultra minimalista con efectos glass
- **Professional** - Completa como Discord/Slack
- **Debug** - Para desarrollo y testing
- **Original** - Estilo Rambox clásico

### 🔧 **Funcionalidades avanzadas**
- ✅ **Multi-sesión independiente** - Cada servicio mantiene su login
- ✅ **12+ servicios preconfigurados** - WhatsApp, Messenger, Discord, Gmail, etc.
- ✅ **Temas personalizables** - Claro, oscuro y automático
- ✅ **Configuración completa** - Modal con opciones avanzadas
- ✅ **Notificaciones en tiempo real** - Badges numerados
- ✅ **DevTools integrado** - Para debugging
- ✅ **User Agent actualizado** - Compatibilidad perfecta con WhatsApp Web
- ✅ **Rendimiento optimizado** - Menor uso de memoria que competidores

## 📱 Servicios incluidos

| Servicio | Estado | Notas |
|----------|--------|-------|
| � WhatsApp Web | ✅ Perfecto | User Agent actualizado |
| 💙 Messenger | ✅ Funcionando | - |
| 📱 Telegram | ✅ Funcionando | - |
| 🎮 Discord | ✅ Funcionando | - |
| 📧 Gmail | ✅ Funcionando | - |
| 📸 Instagram | ✅ Funcionando | - |
| 🐦 Twitter/X | ✅ Funcionando | - |
| 💼 LinkedIn | ✅ Funcionando | - |
| 💬 Slack | ✅ Funcionando | - |
| 👥 Teams | ✅ Funcionando | - |
| 📝 Notion | ✅ Funcionando | - |
| 🎵 Spotify | ✅ Funcionando | - |

## � Instalación

### Prerrequisitos
- [Node.js](https://nodejs.org/) v16 o superior
- [Git](https://git-scm.com/)

### Clonar e instalar
```bash
git clone https://github.com/tu-usuario/arc-container.git
cd arc-container
npm install
```

### Ejecutar
```bash
npm start
```

## 🎨 Cambiar interfaz

Usa el script incluido para cambiar entre las 5 interfaces disponibles:

```bash
# Windows PowerShell
.\switch-ui.ps1

# Selecciona una opción:
# 1. Premium Edition (Recomendada)
# 2. Arc Style
# 3. Professional
# 4. Debug
# 5. Original
```

### Para Linux
```bash
npm run build-linux
```

## ⚙️ Configuración con Nextcloud

### 1. Instalar Nextcloud
- Configura tu propio servidor Nextcloud
- Instala el cliente de escritorio en cada PC

### 2. Configurar Sincronización
La aplicación guarda su configuración en:
- **Windows**: `%APPDATA%/my-app-container/config.json`
- **macOS**: `~/Library/Application Support/my-app-container/config.json`
- **Linux**: `~/.config/my-app-container/config.json`

Configura Nextcloud para sincronizar esta carpeta entre dispositivos.

### 3. Estructura de Configuración
```json
{
  "services": [
    {
      "id": "whatsapp",
      "name": "WhatsApp",
      "url": "https://web.whatsapp.com/",
      "icon": "WA",
      "backgroundColor": "#25D366"
    }
  ]
}
```

## 🎯 Uso

### Atajos de Teclado
- `Ctrl/Cmd + 1-9`: Cambiar entre aplicaciones
- `Ctrl/Cmd + R`: Recargar aplicación actual
- `🔄`: Botón de recarga
- `🔧`: Abrir/cerrar DevTools
- `➕`: Agregar nuevo servicio

### Aplicaciones por Defecto
1. **WhatsApp Web** - Ctrl+1
2. **Facebook** - Ctrl+2  
3. **Gmail** - Ctrl+3
4. **Telegram Web** - Ctrl+4

## 🔒 Seguridad

- **Context Isolation**: Activado
- **Node Integration**: Desactivado en webviews
- **Web Security**: Activado
- **Particiones Persistentes**: Cada app tiene su propia sesión
- **Preload Scripts**: Para comunicación segura

## ⚠️ Limitaciones Conocidas

### Sincronización de Sesiones
- **Las sesiones activas (cookies) NO se sincronizan** entre PCs
- Los usuarios deben iniciar sesión en cada dispositivo
- Solo se sincroniza la configuración de la aplicación
- Esto es una limitación de seguridad inherente de las aplicaciones web

### Recursos
- Cada webview consume RAM (similar a una pestaña de Chrome)
- Recomendado para PCs con 8GB+ RAM

## 🐛 Problemas Comunes

### Las aplicaciones no cargan
- Verificar conexión a Internet
- Algunas apps pueden bloquear webviews
- Usar DevTools (🔧) para debuggear

### Alto consumo de RAM
- Normal, cada webview es una instancia de Chromium
- Cerrar aplicaciones no utilizadas

### Sesiones se pierden
- Las aplicaciones web pueden expirar sesiones por seguridad
- Re-iniciar sesión es normal y esperado

## 📁 Estructura del Proyecto

```
my-app-container/
├── main.js           # Proceso principal de Electron
├── preload.js        # Script de preload para seguridad
├── index.html        # Interfaz principal
├── package.json      # Configuración del proyecto
├── assets/           # Iconos y recursos
└── README.md         # Este archivo
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## ⭐ Agradecimientos

- [Electron](https://www.electronjs.org/) - Framework para aplicaciones de escritorio
- [electron-store](https://github.com/sindresorhus/electron-store) - Persistencia de configuración
- [Nextcloud](https://nextcloud.com/) - Solución de sincronización

## 🔮 Roadmap

- [ ] Interfaz de configuración avanzada
- [ ] Temas personalizables
- [ ] Notificaciones consolidadas
- [ ] Soporte para más aplicaciones
- [ ] Sistema de plugins
- [ ] Auto-updater
