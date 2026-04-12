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

  let itemsRows = '';
  (order.items || []).forEach(item => {
    const subtotal = (item.price * item.quantity).toLocaleString();
    itemsRows += `
      <tr>
        <td class="qty">${item.quantity}x</td>
        <td class="name">${item.name}${item.notes ? `<br><span class="note">* ${item.notes}</span>` : ''}</td>
        <td class="price">&#x20A1;${subtotal}</td>
      </tr>`;
  });

  const totalFinal = order.total || 0;
  const descuento  = order.descuento || 0;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Tiquete</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 13px;
      font-weight: bold;
      color: #000;
      background: #fff;
      width: 72mm;
      padding: 4px 2px 4px 8px;
    }

    /* ── Encabezado ── */
    .header { text-align: center; margin-bottom: 7px; }
    .header .local {
      font-size: 17px;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      line-height: 1.3;
    }
    .header .sub {
      font-size: 11px;
      margin-top: 2px;
      line-height: 1.6;
    }

    /* ── Separadores ── */
    .sep  { border-top: 1px dashed #000; margin: 6px 0; }
    .sep2 { border-top: 2px solid  #000; margin: 6px 0; }

    /* ── Info de la orden ── */
    .info { font-size: 12px; line-height: 1.7; }
    .info .row { display: flex; }
    .info .label { min-width: 58px; font-weight: bold; }
    .info .llevar {
      text-align: center;
      font-weight: bold;
      font-size: 13px;
      margin: 3px 0;
      border: 1px solid #000;
      padding: 2px 0;
    }

    /* ── Items ── */
    table { width: 100%; border-collapse: collapse; margin: 2px 0; }
    td { vertical-align: top; padding: 2px 0; font-size: 13px; line-height: 1.5; }
    td.qty   { width: 24px; font-weight: bold; white-space: nowrap; }
    td.name  { word-break: break-word; }
    td.price { text-align: right; white-space: nowrap; padding-left: 6px; width: 1%; }
    .note    { font-size: 11px; color: #444; }

    /* ── Totales ── */
    .totales { font-size: 12px; line-height: 1.7; }
    .totales .row { display: flex; justify-content: space-between; white-space: nowrap; }
    .totales .row span:last-child { padding-left: 8px; }
    .totales .total-row {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: bold;
      margin: 3px 0;
      white-space: nowrap;
    }
    .totales .total-row span:last-child { padding-left: 8px; }

    /* ── Pie ── */
    .pie { text-align: center; font-size: 11px; margin-top: 4px; line-height: 1.6; }
    .pie .gracias { font-size: 12px; font-weight: bold; margin-bottom: 2px; }

    @page   { size: 72mm auto; margin: 0; }
    @media print { html, body { width: 72mm; } }
  </style>
</head>
<body>

  <div class="header">
    <div class="local">Centro Social<br>El Higuer&#243;n</div>
    <div class="sub">
      Guido Fern&#225;ndez Herrera<br>
      C&#233;d: 1-0526-0613<br>
      Tel: 2416-4453<br>
      Cerbatana de Puriscal
    </div>
  </div>

  <div class="sep2"></div>

  <div class="info">
    <div class="row"><span class="label">Fecha:</span><span>${fecha}</span></div>
    <div class="row"><span class="label">Hora:</span><span>${hora}</span></div>
    <div class="row"><span class="label">Zona:</span><span>${esBar ? 'Bar' : 'Restaurante'}</span></div>
    ${ubicacion ? `<div class="row"><span class="label">Ubic:</span><span>${ubicacion}</span></div>` : ''}
    ${order.type === 'takeout' ? '<div class="llevar">&#9733; PARA LLEVAR &#9733;</div>' : ''}
    ${order.clientName ? `<div class="row"><span class="label">Cliente:</span><span>${order.clientName}</span></div>` : ''}
    ${order.mesera ? `<div class="row"><span class="label">Mesera:</span><span>${order.mesera}</span></div>` : ''}
  </div>

  <div class="sep"></div>

  <table>${itemsRows}</table>

  <div class="sep"></div>

  <div class="totales">
    ${descuento > 0 ? `<div class="row"><span>Descuento:</span><span>-&#x20A1;${descuento.toLocaleString()}</span></div>` : ''}
    ${(() => { const svc = (order.items||[]).filter(i => i.conServicio).reduce((s,i) => s + Math.round(i.price * i.quantity / 11), 0); return svc > 0 ? `<div class="row"><span>Servicio 10%:</span><span>&#x20A1;${svc.toLocaleString()}</span></div>` : ''; })()}
  </div>

  <div class="sep2"></div>
  <div class="totales">
    <div class="total-row">
      <span>TOTAL</span>
      <span>&#x20A1;${totalFinal.toLocaleString()}</span>
    </div>
  </div>
  <div class="sep2"></div>

  <div class="totales">
    <div class="row"><span>Pago:</span><span>${metodoPago}</span></div>
  </div>

  <div class="sep"></div>

  <div class="pie">
    <div class="gracias">&#9829; Gracias por su visita &#9829;</div>
    <div>Vuelva pronto</div>
  </div>

</body>
</html>`;

  const printDiv = document.createElement('div');
  printDiv.id = 'lore-tiquete-print';
  printDiv.style.cssText = 'display:none;';
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:72mm;height:800px;border:none;';
  printDiv.appendChild(iframe);
  document.body.appendChild(printDiv);

  const style = document.createElement('style');
  style.id = 'lore-tiquete-print-style';
  style.innerHTML = '@media print { body > *:not(#lore-tiquete-print) { display:none!important; } #lore-tiquete-print { display:block!important; } } @media screen { #lore-tiquete-print { display:none!important; } }';
  document.head.appendChild(style);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open(); doc.write(html); doc.close();

  setTimeout(() => {
    try { iframe.contentWindow.print(); } catch(e) {}
    setTimeout(() => {
      try { document.body.removeChild(printDiv); } catch(e) {}
      try { document.head.removeChild(style); } catch(e) {}
    }, 1000);
  }, 300);
}
