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

export const closeAccount = (id, paymentMethod = 'efectivo', descuentoData = null, mixtoData = null) =>
  fetch(`${BASE}/accounts/${id}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paymentMethod,
      ...(descuentoData || {}),
      ...(mixtoData || {}),
    }),
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

export const markPendingPayment = (id, note = '') =>
  fetch(`${BASE}/accounts/${id}/pending`, {
    method: 'PUT', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ note })
  }).then(handleResponse);

export const approveAccount = (id) => fetch(`${BASE}/accounts/${id}/approve`, { method: 'PUT' }).then(handleResponse);
export const rejectAccount  = (id, reason) => fetch(`${BASE}/accounts/${id}/reject`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason }) }).then(handleResponse);

export const clearBar        = () => fetch(`${BASE}/admin/clear-bar`, { method: 'DELETE' }).then(handleResponse);
export const clearRestaurante = () => fetch(`${BASE}/admin/clear-restaurante`, { method: 'DELETE' }).then(handleResponse);

export const deleteAccount = (id) =>
  fetch(`${BASE}/accounts/${id}`, { method: 'DELETE' }).then(handleResponse);

export const getMeserasActivas = () =>
  fetch(`${BASE}/config/meseras_activas`).then(r => r.ok ? r.json() : null).catch(() => null);

export const setMeserasActivas = (val) =>
  fetch(`${BASE}/config/meseras_activas`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ value: val })
  }).then(handleResponse);

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
