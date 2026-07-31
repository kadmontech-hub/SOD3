# Deploy en GitHub y Vercel

## Opción 1 — GitHub + Vercel Dashboard

1. Descomprimí el ZIP.
2. Creá un repositorio vacío en GitHub.
3. Subí **el contenido de la carpeta**, no la carpeta contenedora adicional.
4. En Vercel, elegí **Add New → Project**.
5. Importá el repositorio.
6. Vercel leerá `vercel.json`; no cambies Framework Preset, Build Command ni Output Directory.
7. Presioná **Deploy**.

La versión actual no requiere variables de entorno.

## Opción 2 — Git CLI

```bash
git init
git add .
git commit -m "Initial SØD Ecosystem release"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Después importá el repo desde Vercel.

## Opción 3 — Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

## Desarrollo local

```bash
npm run dev
```

Abrí `http://127.0.0.1:4173`.

## Validación

```bash
npm run validate
```

## Persistencia

- Perfil, onboarding, Journey, colección, Bitácora y contenido editable se guardan localmente en el navegador.
- `/api/dialogue` y `/api/health` funcionan como Vercel Functions.
- Esto permite desplegar sin credenciales ni base de datos.
- Para sincronización entre dispositivos, el próximo paso es conectar PostgreSQL/Redis y autenticación real.
