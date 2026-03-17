// Service Worker — LORE POS
// Solo maneja la instalación PWA, no cachea para evitar conflictos

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// No interceptar ninguna petición — dejar que todo vaya a la red normalmente
// El beneficio de PWA (pantalla completa, ícono) funciona sin cachear
