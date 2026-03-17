// ─────────────────────────────────────────────
// api.js — Todas las llamadas al backend
// La URL base se detecta automáticamente:
//   - En producción (Railway): mismo dominio
//   - En desarrollo local: proxy de Vite → localhost:5000
// ─────────────────────────────────────────────

const BASE = '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── CUENTAS ABIERTAS ──────────────────────────

export const getOpenAccounts = (zone) =>
  fetch(`${BASE}/accounts/${zone}/open`).then(handleResponse);

export const getPaidAccounts = (zone) =>
  fetch(`${BASE}/accounts/${zone}/closed`).then(handleResponse);

export const createAccount = (data) =>
  fetch(`${BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateAccount = (id, data) =>
  fetch(`${BASE}/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const closeAccount = (id, paymentMethod = 'efectivo') =>
  fetch(`${BASE}/accounts/${id}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentMethod }),
  }).then(handleResponse);

// ── COCINA ────────────────────────────────────

export const getKitchenOrders = (zone) =>
  fetch(`${BASE}/kitchen/${zone}`).then(handleResponse);

export const createKitchenOrder = (data) =>
  fetch(`${BASE}/kitchen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateKitchenOrder = (id, status) =>
  fetch(`${BASE}/kitchen/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handleResponse);

export const deleteKitchenOrder = (id) =>
  fetch(`${BASE}/kitchen/${id}`, { method: 'DELETE' }).then(handleResponse);

// ── REPORTES ──────────────────────────────────

export const getReport = (zone) =>
  fetch(`${BASE}/reports/${zone}`).then(handleResponse);

// ── REGISTRO DE ACCESO ────────────────────────
export const logAccess = (user, pin, action = 'login', selected = null) =>
  fetch(`${BASE}/access-log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, pin, action, selected }),
  }).then(r => r.json()).catch(() => null); // silencioso si falla

export const getAccessLog = () =>
  fetch(`${BASE}/access-log`).then(r => r.json());

// ── CONFIGURACIÓN GLOBAL ──────────────────────
export const getConfig = (key) =>
  fetch(`${BASE}/config/${key}`).then(r => r.json());

export const setConfig = (key, value) =>
  fetch(`${BASE}/config/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  }).then(r => r.json());
