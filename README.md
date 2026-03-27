<div align="center">
  <img src="client/public/logo.png" width="90" alt="LORE" />
  <h1>LORE POS</h1>
  <p>Sistema de punto de venta para Centro Social El Higuerón — Costa Rica</p>

  [![Deploy](https://img.shields.io/badge/Railway-live-brightgreen?logo=railway&logoColor=white)](https://lore-pos-server-production.up.railway.app)
  [![Stack](https://img.shields.io/badge/React_+_Node.js-fullstack-blue?logo=react)](https://react.dev)
  [![DB](https://img.shields.io/badge/MongoDB_Atlas-cloud-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
</div>

---

Sistema POS hecho a la medida para un negocio con dos zonas independientes — Bar y Restaurante. Maneja pedidos, cocina, caja y reportes desde cualquier dispositivo sin instalación.

**[→ Abrir sistema](https://lore-pos-server-production.up.railway.app)**

---

## Zonas

El sistema opera dos zonas completamente separadas que comparten cocina:

**Bar** — meseras toman pedidos con PIN, cuentas por cliente o barra, servicio del 10% los sábados, cobro desde caja o directo.

**Restaurante** — pedidos desde tablet, cuentas por mesa, todo pasa por caja para cobrar.

---

## Pantallas

| Pantalla | Quién la usa | Qué hace |
|---|---|---|
| Mesera | Mari, Mile, Lin, Temp Bar, Guido Bar | Tomar pedidos, agregar a cuentas, ver platos listos |
| Tablet Restaurante | Aaron / personal restaurante | Pedidos por mesa, manda a cocina automático |
| Cocina | Aaron | Ve todos los pedidos de bar y restaurante, marca listo y entregado |
| Caja Bar / Restaurante | Caja | Cobra, ve cuentas abiertas, historial del día |
| Admin | Guido, Lindsey, Ariel | Estadísticas, cierre del día en PDF, liquidación entre zonas, control de acceso |

---

## Stack

```
Frontend    React 18 + Vite + Tailwind CSS
Backend     Node.js + Express
Base datos  MongoDB Atlas (Mongoose)
Deploy      Railway — Docker, frontend + backend en un solo servicio
```

---

## Estructura

```
lore-pos/
├── server.js              — API Express + schemas Mongoose
├── Dockerfile
├── railway.toml
└── client/src/
    ├── App.jsx            — Estado global, sync, login, lógica de pedidos
    ├── api.js             — Fetch al servidor
    ├── constants.js       — Menú, licores, PINs, barras
    ├── ui.jsx             — Header, Toast, Spinner, impresión
    ├── menu.jsx           — MenuPanel, LicoresPanel, OtrosPanel
    ├── modals.jsx         — BillModal, PinModal, SelectorScreen
    ├── Cart.jsx           — Carrito de compras
    ├── MeseraScreen.jsx
    ├── CajaScreen.jsx
    ├── AdminScreen.jsx
    └── KitchenScreen.jsx
```

---

## Variables de entorno

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster/lore-pos
NODE_ENV=development
NPM_CONFIG_PRODUCTION=false
```

---

## Desarrollo local

```bash
git clone https://github.com/AriDsec/lore-pos-server.git
cd lore-pos-server

npm install
cd client && npm install && cd ..

# Agregar .env con MONGODB_URI

npm run dev               # Backend en :5000
cd client && npm run dev  # Frontend en :5173
```

---

## API

```
GET    /api/accounts/:zone/open     Cuentas abiertas
GET    /api/accounts/:zone/closed   Cuentas pagadas del día
POST   /api/accounts                Crear cuenta
PUT    /api/accounts/:id            Actualizar cuenta
POST   /api/accounts/:id/close      Cobrar y cerrar
DELETE /api/accounts/:id            Eliminar cuenta

GET    /api/kitchen/:zone           Pedidos de cocina activos
POST   /api/kitchen                 Crear pedido
PUT    /api/kitchen/:id             Cambiar estado
DELETE /api/kitchen/:id             Marcar entregado

GET    /api/config/:key             Configuración (servicio, meseras activas)
POST   /api/config/:key             Actualizar configuración
DELETE /api/admin/clear-day         Limpiar datos del día
GET    /health                      Estado del servidor
```

---

## Notas de operación

- Los PINs se configuran en `constants.js` — sección `PINES`
- El servicio del 10% se activa automático los sábados, se puede forzar desde Admin
- El cierre del día genera un PDF descargable con el resumen completo
- Limpiar el día borra solo cuentas pagadas y pedidos de cocina del día actual
- Si la DB no conecta revisar si el cluster de Atlas está pausado

---

<div align="center">
  <sub>Centro Social El Higuerón · Costa Rica · 2025</sub>
</div>
