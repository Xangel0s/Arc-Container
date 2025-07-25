# Debug Guide para My App Container

## 🔍 Solución de Problemas - Webviews No Cargan

### Pasos para Diagnosticar:

1. **Abrir DevTools en la Aplicación Principal**
   - Presiona `F12` o usa el botón 🔧
   - Ve a la pestaña Console
   - Busca errores en rojo

2. **Verificar que los Webviews se Crean**
   - En la consola deberías ver:
     ```
     Initializing App Container...
     Loading configuration...
     Loaded services: [WhatsApp, Messenger, Telegram, ...]
     Creating sidebar...
     Creating webviews...
     Created webview for WhatsApp
     Created webview for Messenger
     ...
     Created X webviews
     ```

3. **Verificar Cambio de Servicios**
   - Al hacer click en un icono deberías ver:
     ```
     Switching to service: whatsapp
     Successfully switched to whatsapp
     ```

4. **Verificar Estado de los Webviews**
   - Deberías ver mensajes como:
     ```
     WhatsApp started loading
     WhatsApp DOM ready
     WhatsApp finished loading
     ```

### 🚨 Problemas Comunes:

#### 1. **Los webviews no se ven**
```javascript
// En DevTools, ejecuta:
document.querySelectorAll('webview').forEach((wv, i) => {
    console.log(`Webview ${i}:`, {
        id: wv.id,
        src: wv.src,
        display: wv.style.display,
        partition: wv.partition
    });
});
```

#### 2. **Error de configuración**
```javascript
// Verificar configuración cargada:
console.log('Services:', appContainer.services);
console.log('Webviews:', appContainer.webviews);
```

#### 3. **Webview Tag no habilitado**
- Verificar que `webviewTag: true` esté en main.js
- Verificar que `contextIsolation: true` esté configurado

### 🔧 Comandos de Debug:

#### Ejecutar en DevTools:
```javascript
// Ver todos los webviews
Array.from(document.querySelectorAll('webview')).map(wv => ({
    id: wv.id,
    visible: wv.style.display !== 'none',
    src: wv.src
}))

// Cambiar manualmente a un servicio
appContainer.switchToService('whatsapp')

// Ver servicios disponibles
appContainer.services.map(s => s.name)

// Recrear interfaz
appContainer.recreateInterface()
```

### 📋 Checklist de Verificación:

- [ ] La aplicación Electron se abre sin errores
- [ ] Se ven los iconos en el sidebar izquierdo
- [ ] Los iconos tienen los colores correctos (verde, azul, etc.)
- [ ] Al hacer click en un icono, se activa (borde blanco)
- [ ] El área principal muestra contenido web (no solo gris)
- [ ] En DevTools no hay errores críticos en rojo
- [ ] Los webviews se crean correctamente según los logs

### 🛠️ Soluciones Rápidas:

#### Si no se ven las páginas web:
1. Presiona `Ctrl+R` para recargar el servicio actual
2. Usa el botón 🔄 (recargar)
3. Cierra y reabre la aplicación
4. Verifica tu conexión a internet

#### Si hay errores de configuración:
```bash
# Limpiar configuración
rmdir /s "%APPDATA%\my-app-container" 
npm start
```

#### Si los webviews no se crean:
1. Verifica que `webviewTag: true` esté en main.js
2. Comprueba que no hay errores de sintaxis en index.html
3. Asegúrate de que Electron esté actualizado

### 🎯 URLs de Prueba:

Si las URLs de los servicios no funcionan, prueba estas alternativas:

- **WhatsApp**: `https://web.whatsapp.com/`
- **Messenger**: `https://www.messenger.com/`  
- **Telegram**: `https://web.telegram.org/a/`
- **Discord**: `https://discord.com/app`
- **Gmail**: `https://mail.google.com/`

### 📞 Obtener Ayuda:

1. Copia los logs de la consola
2. Toma screenshot de la aplicación
3. Ejecuta `npm --version` y `node --version`
4. Indica tu sistema operativo y versión
