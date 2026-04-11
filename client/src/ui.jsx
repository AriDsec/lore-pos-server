import { useState } from "react";
import { LogOut } from 'lucide-react';

// ─────────────────────────────────────────────
// UI COMPONENTS — Spinner, Toast, Header, payBadge, imprimirTiquete
// ─────────────────────────────────────────────

export function Spinner() {
  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 border border-[#94cb47]/30 rounded-xl px-4 py-2 flex items-center gap-2 shadow-xl z-50">
      <div className="w-4 h-4 border-2 border-[#94cb47] border-t-transparent rounded-full animate-spin" />
      <span className="text-[#94cb47] text-xs font-bold">Guardando...</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────

export function Toast({ toasts, offline }) {
  const hasContent = (toasts && toasts.length > 0) || offline;
  if (!hasContent) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2.5 pointer-events-none" style={{minWidth: '280px', maxWidth: '90vw'}}>
      {offline && (
        <div className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border-2 bg-slate-900 border-orange-500 text-orange-100">
          <span className="text-2xl flex-shrink-0 animate-pulse">📡</span>
          <div>
            <div className="font-bold text-base leading-tight">Sin conexión al servidor</div>
            <div className="text-[#94cb47]/70 text-xs">Reintentando automáticamente...</div>
          </div>
        </div>
      )}
      {toasts && toasts.map(t => (
        <div key={t.id} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border-2 animate-fade-in
          ${t.type === 'error'   ? 'bg-red-950 border-red-500 text-red-100' :
            t.type === 'warning' ? 'bg-amber-950 border-amber-400 text-amber-100' :
                                   'bg-slate-900 border-[#94cb47] text-white'}`}>
          <span className="text-2xl flex-shrink-0">
            {t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : '✅'}
          </span>
          <span className="font-bold text-base leading-tight">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────

export function Header({ mesera, zona, onLogout, esBar }) {
  // esBar prop para distinguir zona cuando zona='Caja' no alcanza
  const nombreLocal = esBar !== undefined
    ? (esBar ? 'Centro Social El Higuerón' : 'Jale donde Lore')
    : (zona === 'Bar' ? 'Centro Social El Higuerón' : 'Jale donde Lore');
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-[#94cb47]/20 p-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="LORE" className="w-10 h-10 object-contain drop-shadow" />
          <div>
            <div className="text-[#94cb47] font-bold text-lg md:text-xl leading-tight">{zona}</div>
            <div className="text-white/70 text-sm md:text-base font-medium leading-tight">{nombreLocal}</div>
            <div className="text-[#94cb47]/60 text-xs md:text-sm">{mesera}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-lg font-bold transition shadow-lg">
          <LogOut size={16} /> Salir
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAY BADGE
// ─────────────────────────────────────────────

export const payBadge = (m) => {
  if (m === 'sinpe')   return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-blue-900/50 text-blue-300 border border-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">📱 Sinpe</span>;
  if (m === 'tarjeta') return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-purple-900/50 text-purple-300 border border-purple-600 px-2 py-0.5 rounded-full text-xs font-bold">💳 Tarjeta</span>;
  if (m === 'mixto')          return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-amber-900/50 text-amber-300 border border-amber-600 px-2 py-0.5 rounded-full text-xs font-bold">Efectivo + Tarjeta</span>;
  if (m === 'efectivo_sinpe') return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-teal-900/50 text-teal-300 border border-teal-600 px-2 py-0.5 rounded-full text-xs font-bold">Efectivo + Sinpe</span>;
  if (m === 'tarjeta_sinpe')  return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-indigo-900/50 text-indigo-300 border border-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">Tarjeta + Sinpe</span>;
  return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-green-900/50 text-green-300 border border-green-600 px-2 py-0.5 rounded-full text-xs font-bold">💵 Efectivo</span>;
};

// ─────────────────────────────────────────────
// ITEM BUTTON (menú regular)
// ─────────────────────────────────────────────

export function imprimirTiquete(order, zona) {
  const esBar = zona === 'bar';
  const metodoPago =
    order.paymentMethod === 'sinpe'          ? 'SINPE Movil' :
    order.paymentMethod === 'tarjeta'        ? 'Tarjeta' :
    order.paymentMethod === 'mixto'          ? `Efectivo &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + Tarjeta &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    order.paymentMethod === 'efectivo_sinpe' ? `Efectivo &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + SINPE &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    order.paymentMethod === 'tarjeta_sinpe'  ? `Tarjeta &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + SINPE &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    'Efectivo';

  const ubicacion = order.locationLabel || order.barra
    || ((order.table !== null && order.table !== undefined) ? `Mesa ${order.table}` : '');

  const now = new Date();
  const fecha = now.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora  = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

  const separador = '-'.repeat(40);

  let itemsText = '';
  (order.items || []).forEach(item => {
    const subtotal = `&#x20A1;${(item.price * item.quantity).toLocaleString()}`;
    const nombreLocal = item.name.length > 22 ? item.name.substring(0, 22) : item.name;
    const izq = `${item.quantity}x ${nombreLocal}`;
    itemsText += `${izq.padEnd(28)}${subtotal.padStart(12)}\n`;
    if (item.notes) itemsText += `   * ${item.notes}\n`;
  });

  const totalOriginal = order.totalOriginal || order.total || 0;
  const totalFinal    = order.total || 0;
  const descuento     = order.descuento || 0;
  const totalStr      = `&#x20A1;${totalFinal.toLocaleString()}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @media print {
      body { margin: 0; padding: 0; }
      .no-print { display: none !important; }
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      font-size: 12px;
      width: 72mm;
      margin: 0 auto;
      padding: 4px;
      color: #000;
      background: #fff;
    }
    .center { text-align: center; }
    .right  { text-align: right; }
    .bold   { font-weight: bold; }
    .large  { font-size: 15px; }
    .xl     { font-size: 18px; }
    .sep    { border-top: 1px dashed #000; margin: 4px 0; }
    .sep2   { border-top: 2px solid #000; margin: 4px 0; }
    pre     { font-family: inherit; font-size: inherit; margin: 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="center bold xl">Centro Social El Higueron</div>
  <div class="center">Donde Lore</div>
  <div class="center">Tel: 8888-8888</div>
  <div class="sep2"></div>
  <div>Fecha: ${fecha}</div>
  <div>Hora:  ${hora}</div>
  <div>Zona:  ${esBar ? 'Bar' : 'Restaurante'}</div>
  ${ubicacion ? `<div>Ubic:  ${ubicacion}</div>` : ''}
  ${order.type === 'takeout' ? '<div class="center bold">*** PARA LLEVAR ***</div>' : ''}
  ${order.clientName ? `<div>Cliente: ${order.clientName}</div>` : ''}
  ${order.mesera ? `<div>Mesera:  ${order.mesera}</div>` : ''}
  <div class="sep"></div>
  <pre>${itemsText}</pre>
  <div class="sep"></div>
  ${descuento > 0 ? `<div>Descuento: -&#x20A1;${descuento.toLocaleString()}</div>` : ''}
  <div class="sep2"></div>
  <div class="bold large right">TOTAL: ${totalStr}</div>
  <div class="sep2"></div>
  <div>Pago: ${metodoPago}</div>
  <div class="sep"></div>
  <div class="center">Gracias por su visita!</div>
  <br><br><br>
</body>
</html>`;

  const printDiv = document.createElement('div');
  printDiv.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;';
  document.body.appendChild(printDiv);

  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:0;height:0;border:none;';
  printDiv.appendChild(iframe);

  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      try { document.body.removeChild(printDiv); } catch(e) {}
    }, 1000);
  }, 300);
}
