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
  const nombreLocal = esBar
    ? 'CENTRO SOCIAL EL HIGUERÓN'
    : 'RESTAURANTE JALE DONDE LORE';
  const propietario = 'Guido Marvin Fernández Herrera';
  const cedula      = 'Cédula: 1-0526-0613';
  const telefono    = 'Tel: 2416-4453';

  const now   = new Date();
  const fecha = now.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora  = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

  const metodoPago =
    order.paymentMethod === 'sinpe'          ? 'SINPE Móvil' :
    order.paymentMethod === 'tarjeta'        ? 'Tarjeta' :
    order.paymentMethod === 'mixto'          ? `Efectivo &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + Tarjeta &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    order.paymentMethod === 'efectivo_sinpe' ? `Efectivo &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + SINPE &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    order.paymentMethod === 'tarjeta_sinpe'  ? `Tarjeta &#x20A1;${(order.efectivoMixto||0).toLocaleString()} + SINPE &#x20A1;${(order.tarjetaMixto||0).toLocaleString()}` :
    'Efectivo';

  const ubicacion = order.locationLabel || order.barra
    || ((order.table && order.table > 0) ? `Mesa ${order.table}` : '');

  const separador = '-'.repeat(40);

  let itemsText = '';
  (order.items || []).forEach(item => {
    const subtotal = `&#x20A1;${(item.price * item.quantity).toLocaleString()}`;
    const nombreLocal = item.name.length > 22 ? item.name.substring(0, 22) : item.name;
    const izq = `${item.quantity}x ${nombreLocal}`;
    itemsText += `${izq.padEnd(28)}${subtotal.padStart(12)}
`;
    if (item.notes) itemsText += `   * ${item.notes}
`;
  });

  const totalStr = `&#x20A1;${(order.total||0).toLocaleString()}`;
  const hayDescuento = order.descuento && order.descuento > 0;
  const totalOriginalStr = hayDescuento ? `&#x20A1;${order.totalOriginal.toLocaleString()}` : null;
  const descuentoStr = hayDescuento ? `&#x20A1;${order.descuento.toLocaleString()}` : null;

  const contenido = `
<html>
<head>
<meta charset="UTF-8">
<title>Tiquete</title>
<style>
  /* Para impresora térmica: seleccionar tamaño 80mm o 58mm en el diálogo */
  @page {
    size: 80mm auto;
    margin: 3mm 2mm;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Courier New', Courier, monospace;
    font-size: 10.5px;
    width: 76mm;
    color: #000 !important;
    background: #fff !important;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .centro { text-align: center; }
  .derecha { text-align: right; }
  .bold { font-weight: bold; }
  .separador { border-top: 1px dashed #000; margin: 3px 0; }
  .separador-doble { border-top: 2px solid #000; margin: 4px 0; }
  pre { font-family: inherit; font-size: inherit; white-space: pre-wrap; }
  .total-box { border: 2px solid #000; padding: 4px 6px; margin: 5px 0; text-align: center; }
  .total-num { font-size: 18px; font-weight: bold; }
  /* Instrucción solo visible en pantalla, no al imprimir */
  .instruccion {
    background: #fff3cd;
    border: 1px solid #ffc107;
    padding: 6px;
    margin-bottom: 8px;
    font-size: 10px;
    text-align: center;
    border-radius: 4px;
  }
  @media print { .instruccion { display: none; } }
</style>
</head>
<body>

<div class="instruccion">
  ⚙️ En el diálogo de impresión:<br>
  Seleccione tamaño <b>80mm</b> (o 58mm según su impresora)<br>
  Márgenes: <b>Mínimo</b> · Sin encabezado/pie de página
</div>

<div class="centro bold">${nombreLocal}</div>
<div class="centro">${propietario}</div>
<div class="centro">${cedula}</div>
<div class="centro">${telefono}</div>
<div class="separador-doble"></div>

<div class="centro bold">TIQUETE DE VENTA</div>
<div class="separador"></div>

<table style="width:100%;font-size:11px">
  <tr><td>Fecha:</td><td class="derecha">${fecha}</td></tr>
  <tr><td>Hora:</td><td class="derecha">${hora}</td></tr>
  <tr><td>Zona:</td><td class="derecha">${esBar ? 'Bar' : 'Restaurante'}</td></tr>
  ${ubicacion ? `<tr><td>Ubicación:</td><td class="derecha">${ubicacion}</td></tr>` : ''}
  ${order.type === 'takeout' ? `<tr><td>Tipo:</td><td class="derecha bold">PARA LLEVAR</td></tr>` : ''}
  ${order.clientName ? `<tr><td>Cliente:</td><td class="derecha">${order.clientName}</td></tr>` : ''}
  ${order.mesera ? `<tr><td>Atendió:</td><td class="derecha">${order.mesera}</td></tr>` : ''}
</table>

<div class="separador"></div>
<div class="bold">DESCRIPCIÓN</div>
<div class="separador"></div>

<pre>${itemsText}</pre>

<div class="separador-doble"></div>
${hayDescuento ? `
<table style="width:100%;font-size:11px;margin-bottom:4px">
  <tr>
    <td>Subtotal:</td>
    <td class="derecha">${totalOriginalStr}</td>
  </tr>
  <tr>
    <td>Descuento:</td>
    <td class="derecha" style="font-weight:bold">- ${descuentoStr}</td>
  </tr>
</table>
<div class="separador"></div>
` : ''}
<div class="total-box">
  <div>TOTAL COBRADO</div>
  <div class="total-num">${totalStr}</div>
  <div>Forma de pago: ${metodoPago}</div>
</div>

<div class="separador"></div>
<div class="centro" style="font-size:10px">¡Gracias por su visita!</div>
<div class="centro" style="font-size:9px;margin-top:4px">Este tiquete es su comprobante de compra</div>
<br><br>

</body>
</html>`;

  // Imprimir sin abrir ventana nueva — compatible con PWA Android
  // Crea un div temporal sobre la app, imprime solo ese contenido y lo elimina
  // Crear iframe para que el HTML del tiquete use sus propios estilos
  const printDiv = document.createElement('div');
  printDiv.id = 'lore-print-area';
  printDiv.style.cssText = 'display:none;';
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:100%;height:600px;border:none;';
  printDiv.appendChild(iframe);
  document.body.appendChild(printDiv);
  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(contenido);
  doc.close();

  // Agregar estilos de impresión al head
  const style = document.createElement('style');
  style.id = 'lore-print-style';
  style.innerHTML = `
    @media print {
      body > *:not(#lore-print-area) { display: none !important; }
      #lore-print-area { display: block !important; }
      #lore-print-area iframe { width: 100%; height: 100vh; border: none; }
    }
    @media screen {
      #lore-print-area { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    window.print();
    // Limpiar después de imprimir
    setTimeout(() => {
      try { document.body.removeChild(printDiv); } catch(e) {}
      try { document.head.removeChild(style); } catch(e) {}
    }, 1000);
  }, 300);
}