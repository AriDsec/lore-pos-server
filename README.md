# 🍽️ LORE POS — Sistema de Pedidos

## Estructura del proyecto
```
lore-pos/
├── server.js          ← Backend Express + MongoDB
├── package.json       ← Dependencias del servidor
├── railway.toml       ← Config de Railway
├── .env               ← Variables de entorno (NO subir a GitHub)
├── .gitignore
└── client/            ← Frontend React (Vite + Tailwind)
    ├── src/
    │   ├── App.jsx    ← El POS completo
    │   ├── api.js     ← Llamadas al backend
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 PASOS PARA PONER EN LÍNEA

### 1. Subir los archivos a GitHub
Copia todos estos archivos a tu repo de GitHub (respetando la estructura).
El `.env` NO se sube — se configura directamente en Railway.

### 2. Configurar variables de entorno en Railway
En tu proyecto de Railway → Settings → Variables → agregar:
```
MONGODB_URI = tu_connection_string_de_mongodb_atlas
```
El string se ve así:
`mongodb+srv://usuario:password@cluster.mongodb.net/lore-pos?retryWrites=true&w=majority`

### 3. Configurar el Build Command en Railway
En Railway → Settings → Build:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

O Railway lo detecta solo con el `railway.toml` incluido.

### 4. Deploy
Railway hace el deploy automáticamente cuando subes a GitHub.
El proceso será:
1. Instala dependencias del servidor (`npm install`)
2. Construye el frontend (`cd client && npm install && npm run build`)
3. El build queda en `/public`
4. Inicia el servidor (`node server.js`)

### 5. Verificar que funciona
Visita: `https://tu-app.railway.app/health`
Deberías ver: `{ "status": "OK", "db": "connected" }`

---

## 💻 Para desarrollo local

### Primera vez:
```bash
# Instalar dependencias del servidor
npm install

# Instalar dependencias del cliente
cd client && npm install && cd ..

# Crear archivo .env con tu MongoDB URI
echo "MONGODB_URI=tu_connection_string" > .env
```

### Correr en desarrollo (dos terminales):
```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

El frontend estará en `http://localhost:5173`
El backend estará en `http://localhost:5000`
Vite redirige `/api` al backend automáticamente.

---

## 📱 Usar en varios dispositivos
Una vez deployado en Railway, todos los dispositivos usan la misma URL.
Los datos se sincronizan automáticamente cada 8 segundos.
