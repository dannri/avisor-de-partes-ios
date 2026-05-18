# AVISOR DE PARTES — versión iPad (PWA) — repo iOS (sandbox de cambios)

> ⚠️ Este repo es una **copia gemela** de `avisor-de-partes-ipad` para experimentar con cambios sin tocar la versión en producción. Misma app, mismo password gate, mismo Firebase. URL pública: https://dannri.github.io/avisor-de-partes-ios/

Versión web instalable de la app, pensada para iPad. Usa exactamente los mismos `app.js` / `app.css` / `fondo.jpg` que el APK, con un envoltorio PWA encima para que se pueda "instalar" desde Safari como si fuera una app nativa.

## Estructura

```
ios/
├── index.html           # HTML base (clon del APK + meta tags PWA)
├── manifest.json        # Manifiesto PWA
├── service-worker.js    # Cache offline
├── icon-180.png         # apple-touch-icon (iPad)
├── icon-512.png         # Icono PWA
└── assets/
    ├── app.js           # ← copiado de apk_decompiled_v2/assets/public/assets
    ├── app.css          # ← copiado
    └── fondo.jpg        # ← copiado
```

## Cómo instalarla en el iPad

1. Subir esta carpeta a algún sitio servido por **HTTPS** (obligatorio para que funcione el service worker / modo offline). Opciones:
   - **GitHub Pages**: subir la carpeta a un repo, activar Pages en Settings → Pages.
   - **Netlify Drop**: arrastrar la carpeta a https://app.netlify.com/drop. URL inmediata.
   - **Servidor interno** (intranet) con certificado HTTPS válido.
2. En el iPad, abrir Safari y entrar a esa URL.
3. Tocar el botón de **compartir** (cuadrado con flecha arriba) → **"Añadir a pantalla de inicio"**.
4. Le pone el nombre "AVISOR DE PARTES" y el icono. Desde ese momento se abre a pantalla completa, sin la barra de Safari, igual que una app del Store.

## Notas importantes

- **HTTPS obligatorio.** Sin HTTPS, Safari no registra el service worker → no funciona offline y el "Añadir a pantalla de inicio" pierde gracia (se sigue pudiendo, pero sin cache).
- **Primera carga necesita internet.** Luego puede funcionar sin conexión (service worker cachea todo).
- **Almacenamiento**: la app guarda los datos en `localStorage` / `sessionStorage` del iPad. Si el usuario borra los datos de Safari → se pierden.
- **App Store**: no se sube. Para Apple, esto es solo "una página web instalada". No requiere cuenta de desarrollador ni revisión.

## Cómo actualizar cuando se cambie el código

Si en el futuro tocas algo del APK, copia los archivos actualizados a la carpeta ipad:

```powershell
Copy-Item "apk_decompiled_v2\assets\public\assets\app.js"   "ipad\assets\" -Force
Copy-Item "apk_decompiled_v2\assets\public\assets\app.css"  "ipad\assets\" -Force
Copy-Item "apk_decompiled_v2\assets\public\assets\fondo.jpg" "ipad\assets\" -Force
```

Si quieres forzar a los iPads ya instalados a recoger la nueva versión, edita `service-worker.js` y sube el número en `CACHE_VERSION` (ej. `v1` → `v2`). El siguiente arranque del PWA borrará la caché vieja y descargará todo de nuevo.

## Comprobación rápida en local (Windows)

Puedes probar la PWA en el PC antes de subirla. Necesitas un servidor HTTP local (los archivos abiertos directamente con `file://` no permiten service workers):

```powershell
# Si tienes Python instalado:
cd ipad
python -m http.server 8080
# Luego abrir http://localhost:8080 en el navegador
```

Para probar en el iPad estando en la misma red WiFi, usa la IP de tu PC en lugar de `localhost` (ej. `http://192.168.1.50:8080`). Funcionará la app pero NO el modo offline (Safari exige HTTPS para service workers, salvo `localhost`).
