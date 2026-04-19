# MB Electronics — Invoice Generator

## Deploy en Vercel (gratis)

### Paso 1 — Sube a GitHub
1. Crea un repo nuevo en github.com
2. Sube esta carpeta completa

### Paso 2 — Conecta con Vercel
1. Ve a vercel.com → Sign in con tu cuenta de GitHub
2. Click "Add New Project"
3. Selecciona tu repo
4. Click "Deploy" — ¡listo!

Vercel te da un link tipo: https://mb-invoice.vercel.app
Puedes abrirlo en cualquier dispositivo, en cualquier browser.

## Estructura
```
/api/parse-invoice.js  ← Backend (llama a Anthropic)
/public/index.html     ← Frontend completo
/vercel.json           ← Configuración de Vercel
```
