# Arc Container

Un gestor profesional de aplicaciones web construido con Electron, inspirado en Rambox.

## 🚀 Características

- **Múltiples servicios**: Administra WhatsApp, Telegram, Discord, Gmail y más en una sola aplicación
- **WhatsApp Business**: Soporte completo para WhatsApp Business con detección automática
- **Administrador de apps**: Sistema avanzado para habilitar/deshabilitar servicios y agregar nuevos
- **Plantillas rápidas**: Acceso rápido a configuraciones predefinidas de servicios populares
- **Múltiples instancias**: Soporte para múltiples cuentas del mismo servicio
- **Configuración persistente**: Todas las configuraciones se guardan automáticamente
- **Interfaz moderna**: Diseño clean con tema oscuro/claro

## 🎯 Servicios Soportados

- **Mensajería**: WhatsApp, WhatsApp Business, Telegram, Discord, Messenger, Slack
- **Email**: Gmail
- **Social**: Instagram, Twitter/X, LinkedIn
- **Productividad**: Microsoft Teams, Notion
- **Entretenimiento**: Spotify

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/Xangel0s/Arc-Container.git
cd Arc-Container
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación:
```bash
npm start
```

## 🔧 Desarrollo

Para ejecutar en modo desarrollo con logging habilitado:
```bash
npm run dev
```

Para construir la aplicación:
```bash
npm run build
```

## 🏗️ Construido con

- **Electron 13.6.3**: Framework principal
- **electron-store**: Persistencia de configuraciones
- **Font Awesome**: Iconografía
- **HTML5/CSS3/JavaScript**: Interfaz de usuario

## ✨ Administrador de Aplicaciones

El administrador de aplicaciones permite:
- Habilitar/deshabilitar servicios existentes
- Agregar nuevos servicios personalizados
- Configurar múltiples instancias
- Usar plantillas rápidas para servicios populares
- Personalizar nombres, URLs e iconos

## 📋 Notas Técnicas

- **WhatsApp Business**: Utiliza la misma interfaz web que WhatsApp normal pero con User Agent específico para diferenciación
- **Configuración CSP**: Optimizado para evitar errores de Content Security Policy
- **Particiones**: Cada servicio ejecuta en su propia partición para mejor aislamiento

## 📄 Licencia

MIT License - ve el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una branch para tu feature
3. Commit tus cambios
4. Push a la branch
5. Abre un Pull Request

---

**Arc Container** - Tu centro de comando para aplicaciones web 🚀
