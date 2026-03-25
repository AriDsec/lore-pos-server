import { Header, payBadge, ItemsModal, Spinner } from './components.jsx';
import { useState, useEffect } from 'react';
import * as api from './api.js';

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg gap-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-bold text-sm whitespace-nowrap">{value}</span>
    </div>
  );
}

export function AdminScreen({ barPaid, restPaid, loading, onLogout, setPaidOrders, showToast }) {
  const [viewItemsOrder, setViewItemsOrder] = useState(null);
  const [accessLog, setAccessLog] = useState([]);
  const [showConfirmLimpiar, setShowConfirmLimpiar] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  // Servicio 10% — automático los sábados, persiste en localStorage
  const isSabado = new Date().getDay() === 6;
  const [servicioActivo, setServicioActivo] = useState(() => {
    const saved = localStorage.getItem('lore_servicio');
    if (saved !== null) return saved === 'true';
    return isSabado; // default: activo si es sábado
  });
  const [numMeseras, setNumMeseras] = useState(() => {
    return parseInt(localStorage.getItem('lore_num_meseras') || '3');
  });

  const toggleServicio = (val) => {
    setServicioActivo(val);
    localStorage.setItem('lore_servicio', String(val));
    api.setConfig('servicio_activo', val).catch(() => {}); // guardar en servidor
  };

  const changeNumMeseras = (n) => {
    setNumMeseras(n);
    localStorage.setItem('lore_num_meseras', String(n));
  };

  const [meserasActivas, setMeserasActivas] = useState({});

  useEffect(() => {
    api.getAccessLog().then(setAccessLog).catch(() => {});
    api.getMeserasActivas().then(cfg => {
      if (cfg && cfg.value) setMeserasActivas(cfg.value);
    }).catch(() => {});
  }, []);

  const toggleMesera = async (nombre) => {
    const updated = { ...meserasActivas, [nombre]: meserasActivas[nombre] === false ? true : false };
    setMeserasActivas(updated);
    await api.setMeserasActivas(updated).catch(() => {});
  };

  const meseras = ['Mari', 'Mile', 'Lin', 'Temp Bar'];

  const totalBarCobrado  = barPaid.reduce((s, o) => s + o.total, 0);
  const totalRestCobrado = restPaid.reduce((s, o) => s + o.total, 0);
  const grandTotal = totalBarCobrado + totalRestCobrado;
  const totalDescuentosBar  = barPaid.reduce((s, o) => s + (o.descuento || 0), 0);
  const totalDescuentosRest = restPaid.reduce((s, o) => s + (o.descuento || 0), 0);
  const totalDescuentos = totalDescuentosBar + totalDescuentosRest;

  // Comida que el Bar vendió → el Restaurante la cocinó → Bar le debe al Restaurante
  const barFoodTotal = barPaid.reduce((s, o) =>
    s + (o.items||[]).filter(i => i.category === 'food')
      .reduce((a, i) => a + i.price * i.quantity, 0), 0);

  // Bebidas alcohólicas y cervezas que el Restaurante vendió → son del inventario del Bar → Restaurante le debe al Bar
  // Excluye soda (batidos, refrescos, sin alcohol) porque esos son del Restaurante
  const restAlcoholTotal = restPaid.reduce((s, o) =>
    s + (o.items||[]).filter(i => ['alcoholic', 'beverage'].includes(i.category))
      .reduce((a, i) => a + i.price * i.quantity, 0), 0);

  // Saldo: positivo = Bar le paga al Restaurante, negativo = Restaurante le paga al Bar
  const deudaBar = barFoodTotal - restAlcoholTotal;

  // Cálculo del servicio 10% — solo bar, ya incluido en precios
  // Si precio = base * 1.10, entonces servicio = precio - base = precio * (1/11)
  const totalServicio = servicioActivo ? Math.round(totalBarCobrado / 11) : 0;
  const porMesera     = numMeseras > 0 ? Math.round(totalServicio / numMeseras) : 0;

  const countMethod = (arr, m) => arr.filter(o => (o.paymentMethod || 'efectivo') === m).length;
  const sumMethod   = (arr, m) => arr.filter(o => (o.paymentMethod || 'efectivo') === m).reduce((s, o) => s + o.total, 0);

  const descargarCierrePDF = () => {
    const now   = new Date();
    const fecha = now.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const hora  = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

    const barFoodTotal2  = barPaid.reduce((s,o) => s+(o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0),0);
    const barDrinkTotal  = barPaid.reduce((s,o) => s+(o.items||[]).filter(i=>i.category!=='food').reduce((a,i)=>a+i.price*i.quantity,0),0);
    const restFoodTotal  = restPaid.reduce((s,o) => s+(o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0),0);
    const restDrinkTotal = restPaid.reduce((s,o) => s+(o.items||[]).filter(i=>i.category!=='food').reduce((a,i)=>a+i.price*i.quantity,0),0);

    const methodLabel = (m) =>
      m === 'sinpe'          ? 'Sinpe' :
      m === 'tarjeta'        ? 'Tarjeta' :
      m === 'mixto'          ? 'Efectivo + Tarjeta' :
      m === 'efectivo_sinpe' ? 'Efectivo + Sinpe' :
      m === 'tarjeta_sinpe'  ? 'Tarjeta + Sinpe' :
      'Efectivo';

    const sortedBar  = [...barPaid].sort((a,b) => new Date(a.closedAt) - new Date(b.closedAt));
    const sortedRest = [...restPaid].sort((a,b) => new Date(a.closedAt) - new Date(b.closedAt));
    const cuentasBarHTML  = sortedBar.map(o => {
      const hora = o.closedAt ? new Date(o.closedAt).toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'}) : '';
      return `<tr><td>${hora}</td><td>${o.mesera}</td><td>${o.locationLabel || o.barra || 'Mesa ' + o.table}${o.clientName ? ' — ' + o.clientName : ''}</td><td style="text-align:center">${methodLabel(o.paymentMethod)}</td><td style="text-align:right">&#x20A1;${o.total.toLocaleString()}${o.descuento > 0 ? ` <span style="color:#d97706;font-size:10px">(-&#x20A1;${o.descuento.toLocaleString()})</span>` : ''}</td></tr>`;
    }).join('');
    const cuentasRestHTML = sortedRest.map(o => {
      const hora = o.closedAt ? new Date(o.closedAt).toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'}) : '';
      return `<tr><td>${hora}</td><td>${o.mesera}</td><td>${o.locationLabel || o.barra || 'Mesa ' + o.table}${o.clientName ? ' — ' + o.clientName : ''}</td><td style="text-align:center">${methodLabel(o.paymentMethod)}</td><td style="text-align:right">&#x20A1;${o.total.toLocaleString()}${o.descuento > 0 ? ` <span style="color:#d97706;font-size:10px">(-&#x20A1;${o.descuento.toLocaleString()})</span>` : ''}</td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Cierre de Caja — LORE ${fecha}</title>
<style>
* { margin:0;padding:0;box-sizing:border-box; }
body { font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;padding:30px; }
.header { text-align:center;border-bottom:3px solid #059669;padding-bottom:16px;margin-bottom:24px; }
.header h1 { font-size:28px;color:#94cb47;letter-spacing:4px; }
.header p { color:#666;margin-top:4px; }
.total-box { background:#94cb47;color:white;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px; }
.total-box .monto { font-size:36px;font-weight:bold;margin-top:4px; }
.grid { display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px; }
.card { border:1px solid #ddd;border-radius:10px;padding:16px; }
.card h2 { font-size:16px;color:#94cb47;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:8px; }
.row { display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0; }
.row:last-child { border:none; }
.row .label { color:#666; }
.row .val { font-weight:bold; }
.total-row { display:flex;justify-content:space-between;background:#f0fde8;padding:10px 12px;border-radius:8px;margin-top:10px; }
.total-row .val { color:#94cb47;font-weight:bold;font-size:16px; }
.liquidacion { border:2px solid #f59e0b;border-radius:10px;padding:16px;margin-bottom:24px;background:#fffbeb; }
.liquidacion h2 { color:#d97706;font-size:16px;margin-bottom:12px; }
.saldo-final { background:${deudaBar >= 0 ? '#fff7ed' : '#f0fdf4'};border:2px solid ${deudaBar >= 0 ? '#f59e0b' : '#059669'};border-radius:8px;padding:12px;margin-top:12px;display:flex;justify-content:space-between;align-items:center; }
.saldo-monto { font-size:22px;font-weight:bold;color:${deudaBar >= 0 ? '#d97706' : '#059669'}; }
table { width:100%;border-collapse:collapse;font-size:12px; }
th { background:#f1f5f9;text-align:left;padding:8px; }
td { padding:6px 8px;border-bottom:1px solid #f0f0f0; }
.section-title { font-size:15px;font-weight:bold;color:#333;margin:20px 0 10px; }
.footer { text-align:center;color:#999;font-size:11px;margin-top:30px;border-top:1px solid #eee;padding-top:16px; }
@media print { body { padding:15px; } }
</style>
</head>
<body>
<div class="header"><h1>🍽️ LORE</h1><p class="fecha">${fecha}</p><p style="color:#999;font-size:12px">Generado a las ${hora}</p></div>
<div class="total-box"><div>💰 Total del Día</div><div class="monto">&#x20A1;${grandTotal.toLocaleString()}</div>${totalDescuentos > 0 ? `<div style="font-size:12px;margin-top:4px;color:#fcd34d">Descuentos: -&#x20A1;${totalDescuentos.toLocaleString()}</div>` : ''}</div>
<div class="grid">
  <div class="card"><h2>🍺 Bar</h2>
    <div class="row"><span class="label">Cuentas cobradas</span><span class="val">${barPaid.length}</span></div>
    <div class="row"><span class="label">Comida</span><span class="val">&#x20A1;${barFoodTotal2.toLocaleString()}</span></div>
    <div class="row"><span class="label">Bebidas</span><span class="val">&#x20A1;${barDrinkTotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Total Bar</span><span class="val">&#x20A1;${totalBarCobrado.toLocaleString()}</span></div>
  </div>
  <div class="card"><h2>🍽️ Restaurante</h2>
    <div class="row"><span class="label">Cuentas cobradas</span><span class="val">${restPaid.length}</span></div>
    <div class="row"><span class="label">Comida</span><span class="val">&#x20A1;${restFoodTotal.toLocaleString()}</span></div>
    <div class="row"><span class="label">Bebidas</span><span class="val">&#x20A1;${restDrinkTotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Total Restaurante</span><span class="val">&#x20A1;${totalRestCobrado.toLocaleString()}</span></div>
  </div>
</div>
<div class="liquidacion"><h2>🍺 Liquidación con Bar</h2>
  <div class="row"><span class="label">Comida vendida por Bar (cocinada por Restaurante)</span><span class="val">&#x20A1;${barFoodTotal.toLocaleString()}</span></div>
  <div class="row"><span class="label">Licores y cervezas vendidos por Restaurante (inventario Bar)</span><span class="val">&#x20A1;${restAlcoholTotal.toLocaleString()}</span></div>
  <div class="saldo-final"><div><div style="font-weight:bold">SALDO FINAL</div><div style="font-size:11px;color:#666">${deudaBar >= 0 ? '📤 Bar nos paga' : '📥 Nosotros le pagamos al Bar'}</div></div><div class="saldo-monto">&#x20A1;${Math.abs(deudaBar).toLocaleString()}</div></div>
</div>
${barPaid.length > 0 ? `<div class="section-title">📋 Detalle — Bar (${barPaid.length})</div>
<div style="display:flex;gap:12px;margin-bottom:8px;font-size:12px">
<span style="background:#14532d;color:#86efac;padding:3px 10px;border-radius:20px">Efectivo: ${countMethod(barPaid,'efectivo')} — &#x20A1;${sumMethod(barPaid,'efectivo').toLocaleString()}</span>
${countMethod(barPaid,'sinpe')>0?`<span style="background:#1e3a5f;color:#93c5fd;padding:3px 10px;border-radius:20px">Sinpe: ${countMethod(barPaid,'sinpe')} — &#x20A1;${sumMethod(barPaid,'sinpe').toLocaleString()}</span>`:''}
${countMethod(barPaid,'tarjeta')>0?`<span style="background:#3b1f6e;color:#d8b4fe;padding:3px 10px;border-radius:20px">Tarjeta: ${countMethod(barPaid,'tarjeta')} — &#x20A1;${sumMethod(barPaid,'tarjeta').toLocaleString()}</span>`:''}
${countMethod(barPaid,'mixto')>0?`<span style="background:#78350f;color:#fcd34d;padding:3px 10px;border-radius:20px">Efectivo+Tarjeta: ${countMethod(barPaid,'mixto')} — &#x20A1;${sumMethod(barPaid,'mixto').toLocaleString()}</span>`:''}
${countMethod(barPaid,'efectivo_sinpe')>0?`<span style="background:#134e4a;color:#5eead4;padding:3px 10px;border-radius:20px">Efectivo+Sinpe: ${countMethod(barPaid,'efectivo_sinpe')} — &#x20A1;${sumMethod(barPaid,'efectivo_sinpe').toLocaleString()}</span>`:''}
${countMethod(barPaid,'tarjeta_sinpe')>0?`<span style="background:#1e1b4b;color:#a5b4fc;padding:3px 10px;border-radius:20px">Tarjeta+Sinpe: ${countMethod(barPaid,'tarjeta_sinpe')} — &#x20A1;${sumMethod(barPaid,'tarjeta_sinpe').toLocaleString()}</span>`:''}
</div>
<table><thead><tr><th>Hora</th><th>Mesera</th><th>Mesa / Barra</th><th style="text-align:center">Pago</th><th style="text-align:right">Total</th></tr></thead><tbody>${cuentasBarHTML}</tbody></table>` : ''}
${restPaid.length > 0 ? `<div class="section-title">📋 Detalle — Restaurante (${restPaid.length})</div>
<div style="display:flex;gap:12px;margin-bottom:8px;font-size:12px">
<span style="background:#14532d;color:#86efac;padding:3px 10px;border-radius:20px">Efectivo: ${countMethod(restPaid,'efectivo')} — &#x20A1;${sumMethod(restPaid,'efectivo').toLocaleString()}</span>
${countMethod(restPaid,'sinpe')>0?`<span style="background:#1e3a5f;color:#93c5fd;padding:3px 10px;border-radius:20px">Sinpe: ${countMethod(restPaid,'sinpe')} — &#x20A1;${sumMethod(restPaid,'sinpe').toLocaleString()}</span>`:''}
${countMethod(restPaid,'tarjeta')>0?`<span style="background:#3b1f6e;color:#d8b4fe;padding:3px 10px;border-radius:20px">Tarjeta: ${countMethod(restPaid,'tarjeta')} — &#x20A1;${sumMethod(restPaid,'tarjeta').toLocaleString()}</span>`:''}
${countMethod(restPaid,'mixto')>0?`<span style="background:#78350f;color:#fcd34d;padding:3px 10px;border-radius:20px">Efectivo+Tarjeta: ${countMethod(restPaid,'mixto')} — &#x20A1;${sumMethod(restPaid,'mixto').toLocaleString()}</span>`:''}
${countMethod(restPaid,'efectivo_sinpe')>0?`<span style="background:#134e4a;color:#5eead4;padding:3px 10px;border-radius:20px">Efectivo+Sinpe: ${countMethod(restPaid,'efectivo_sinpe')} — &#x20A1;${sumMethod(restPaid,'efectivo_sinpe').toLocaleString()}</span>`:''}
${countMethod(restPaid,'tarjeta_sinpe')>0?`<span style="background:#1e1b4b;color:#a5b4fc;padding:3px 10px;border-radius:20px">Tarjeta+Sinpe: ${countMethod(restPaid,'tarjeta_sinpe')} — &#x20A1;${sumMethod(restPaid,'tarjeta_sinpe').toLocaleString()}</span>`:''}
</div>
<table><thead><tr><th>Hora</th><th>Mesera</th><th>Mesa / Barra</th><th style="text-align:center">Pago</th><th style="text-align:right">Total</th></tr></thead><tbody>${cuentasRestHTML}</tbody></table>` : ''}
<div class="footer">LORE POS — Cierre de Caja ${fecha}</div>
</body></html>`;

    // Imprimir sin abrir ventana nueva — compatible con PWA Android
    const printDiv = document.createElement('div');
    printDiv.id = 'lore-admin-print';
    printDiv.style.cssText = 'display:none;';
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width:100%;height:800px;border:none;';
    printDiv.appendChild(iframe);
    document.body.appendChild(printDiv);

    const style = document.createElement('style');
    style.id = 'lore-admin-print-style';
    style.innerHTML = '@media print { body > *:not(#lore-admin-print) { display:none!important; } #lore-admin-print { display:block!important; } } @media screen { #lore-admin-print { display:none!important; } }';
    document.head.appendChild(style);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();

    setTimeout(() => {
      try { iframe.contentWindow.print(); } catch(e) {}
      setTimeout(() => {
        try { document.body.removeChild(printDiv); } catch(e) {}
        try { document.head.removeChild(style); } catch(e) {}
      }, 1500);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {loading && <Spinner />}
      <Header mesera="Admin" zona="Control" onLogout={onLogout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">

        <div className="bg-gradient-to-r from-[#94cb47]/20 to-[#7ab035]/20 border border-[#94cb47]/30 rounded-2xl p-6 shadow-2xl flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="text-white/80 text-base">💰 Total del Día</div>
            <div className="text-4xl md:text-6xl font-bold text-white mt-1">₡{grandTotal.toLocaleString()}</div>
            {totalDescuentos > 0 && (
              <div className="text-amber-400 text-sm mt-1">
                Descuentos aplicados: -₡{totalDescuentos.toLocaleString()}
              </div>
            )}
          </div>
          <button onClick={descargarCierrePDF} className="bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 border border-white/30">
            📄 Descargar Cierre del Día
          </button>
          <button
            onClick={() => { setShowConfirmLimpiar(true); setConfirmInput(''); }}
            className="bg-red-900/40 hover:bg-red-900/70 text-red-300 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 border border-red-500/40"
          >
            🗑️ Limpiar Día
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['🍺 Bar', barPaid, totalBarCobrado], ['🍽️ Restaurante', restPaid, totalRestCobrado]].map(([titulo, paid, total]) => (
            <div key={titulo} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-4 shadow-2xl space-y-3">
              <h3 className="text-white font-bold text-xl">{titulo}</h3>
              <StatRow label="Cuentas cobradas" value={paid.length} />
              <StatRow label="Comida vendida" value={`₡${paid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category==='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
              <StatRow label="Bebidas vendidas" value={`₡${paid.reduce((s,o)=>s+(o.items||[]).filter(i=>i.category!=='food').reduce((a,i)=>a+i.price*i.quantity,0),0).toLocaleString()}`} />
              <div className="border-t border-slate-700 pt-2 space-y-1">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Forma de pago</div>
                {['efectivo','sinpe','tarjeta','mixto','efectivo_sinpe','tarjeta_sinpe'].map(m => {
                  const t = paid.filter(o=>(o.paymentMethod||'efectivo')===m).reduce((s,o)=>s+o.total,0);
                  const c = paid.filter(o=>(o.paymentMethod||'efectivo')===m).length;
                  if (c === 0) return null;
                  return (
                    <div key={m} className="flex justify-between items-center">
                      <span className="text-sm">{payBadge(m)}</span>
                      <span className="text-white text-sm font-bold">₡{t.toLocaleString()} <span className="text-slate-400 font-normal text-xs">({c})</span></span>
                    </div>
                  );
                })}
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <div className="text-white/80 text-xs">Total</div>
                <div className="text-2xl font-bold text-white">₡{total.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-[#94cb47]/40 p-5 shadow-2xl">
          <h3 className="text-[#94cb47] font-bold text-xl mb-4">🍺 Liquidación con Bar</h3>
          <div className="space-y-3 mb-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-wrap justify-between items-center gap-2">
              <div>
                <div className="text-slate-400 text-sm">Comida vendida por Bar</div>
                <div className="text-xs text-slate-500">Cocinada por Restaurante → Bar nos debe esto</div>
              </div>
              <div className="text-xl font-bold text-[#94cb47] whitespace-nowrap">₡{barFoodTotal.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-wrap justify-between items-center gap-2">
              <div>
                <div className="text-slate-400 text-sm">Licores y cervezas vendidos por Restaurante</div>
                <div className="text-xs text-slate-500">Del inventario del Bar → Nosotros le debemos esto (excluye batidos y sin alcohol)</div>
              </div>
              <div className="text-xl font-bold text-[#94cb47] whitespace-nowrap">₡{restAlcoholTotal.toLocaleString()}</div>
            </div>
            <div className={`rounded-xl p-4 border flex justify-between items-center gap-3 ${deudaBar >= 0 ? 'bg-[#94cb47]/20 border-[#94cb47]' : 'bg-[#94cb47]/40 border-[#94cb47]'}`}>
              <div>
                <div className="text-slate-300 text-sm font-bold">SALDO FINAL</div>
                <div className="text-xs text-slate-400">{deudaBar >= 0 ? '📤 Bar nos paga esto' : '📥 Nosotros le pagamos al Bar'}</div>
              </div>
              <div className={`text-2xl font-bold whitespace-nowrap ${deudaBar >= 0 ? 'text-[#94cb47]' : 'text-[#94cb47]'}`}>
                ₡{Math.abs(deudaBar).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ── Servicio 10% Meseras (Sábados) ── */}
        <div className={`rounded-2xl border-2 p-5 shadow-2xl ${servicioActivo ? 'bg-gradient-to-br from-[#94cb47]/10 to-slate-900 border-[#94cb47]/40' : 'bg-slate-800/50 border-slate-600/40'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className={`font-bold text-xl ${servicioActivo ? 'text-[#94cb47]' : 'text-slate-400'}`}>
                💜 Servicio 10% — Meseras
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                {isSabado ? '📅 Hoy es sábado — activo automáticamente' : '📅 No es sábado — activar manualmente si aplica'}
              </p>
            </div>
            <button
              onClick={() => toggleServicio(!servicioActivo)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition border ${servicioActivo ? 'bg-[#94cb47] hover:bg-[#7ab035] text-black border-[#94cb47]' : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-500'}`}
            >
              {servicioActivo ? '✅ Activo' : '⭕ Inactivo'}
            </button>
          </div>

          {servicioActivo && (
            <div className="space-y-3">
              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <div className="text-slate-300 text-sm">Servicio extraído del total Bar</div>
                  <div className="text-xs text-slate-500">₡{totalBarCobrado.toLocaleString()} ÷ 11 (10% ya incluido en precios)</div>
                </div>
                <div className="text-xl font-bold text-[#94cb47]">₡{totalServicio.toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Dividir entre:</span>
                {[3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => changeNumMeseras(n)}
                    className={`px-4 py-1.5 rounded-lg font-bold text-sm transition border ${numMeseras === n ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'}`}
                  >
                    {n} meseras
                  </button>
                ))}
              </div>

              <div className="bg-[#94cb47]/10 rounded-xl p-4 border border-[#94cb47]/30 flex justify-between items-center">
                <div>
                  <div className="text-[#94cb47] text-sm font-bold">Por mesera</div>
                  <div className="text-xs text-slate-400">Mari, Mile, Lin{numMeseras === 4 ? ', Temp Bar' : ''}</div>
                </div>
                <div className="text-2xl font-bold text-[#94cb47]">₡{porMesera.toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['📋 Pagadas Bar', barPaid], ['📋 Pagadas Restaurante', restPaid]].map(([titulo, paid]) => (
            <div key={titulo} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-4 shadow-2xl">
              <h3 className="text-[#94cb47] font-bold text-lg mb-4">{titulo}</h3>
              {paid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos</p> : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[...paid].sort((a,b) => new Date(b.closedAt) - new Date(a.closedAt)).map(o => (
                    <div key={o._id || o.id} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-white text-sm font-bold truncate">
                            {o.locationLabel || o.barra || (o.table ? `Mesa ${o.table}` : '-')}{o.clientName ? ` — ${o.clientName}` : ''}
                          </div>
                          <div className="text-slate-400 text-xs">👤 {o.mesera}{o.closedAt ? ` · ${new Date(o.closedAt).toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'})}` : ''}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {payBadge(o.paymentMethod)}
                          <span className="text-[#94cb47] font-bold text-sm whitespace-nowrap">₡{o.total.toLocaleString()}</span>
                          {o.descuento > 0 && <span className="text-amber-400 text-xs">-₡{o.descuento.toLocaleString()} desc.</span>}
                          <button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-2 py-1 rounded text-xs">📋</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Control de acceso meseras ── */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
          <h3 className="text-[#94cb47] font-bold text-lg mb-4">Acceso Meseras</h3>
          <p className="text-slate-500 text-xs mb-4">Desactiva el PIN de una mesera para que no pueda entrar al sistema</p>
          <div className="grid grid-cols-2 gap-3">
            {meseras.map(nombre => {
              const activa = meserasActivas[nombre] !== false;
              return (
                <div key={nombre} className={`flex items-center justify-between p-3 rounded-xl border transition ${activa ? 'bg-slate-700/40 border-slate-600' : 'bg-red-900/20 border-red-500/40'}`}>
                  <div>
                    <div className={`font-bold text-sm ${activa ? 'text-white' : 'text-red-300'}`}>{nombre}</div>
                    <div className={`text-xs ${activa ? 'text-slate-400' : 'text-red-400'}`}>{activa ? 'Activa' : 'Bloqueada'}</div>
                  </div>
                  <button
                    onClick={() => toggleMesera(nombre)}
                    className={`relative w-12 h-6 rounded-full transition-all ${activa ? 'bg-[#94cb47]' : 'bg-red-700'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${activa ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Registro de acceso admin ── */}
        {accessLog.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-4 shadow-xl">
            <h3 className="text-slate-300 font-bold text-base mb-3">🔑 Registro de Accesos</h3>
            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {accessLog.map((log, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-slate-700/40 rounded-lg text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#94cb47] font-bold flex-shrink-0">{log.user}</span>
                    {log.action === 'select' && log.selected && (
                      <span className="text-slate-400">→ <span className="text-white">{log.selected}</span></span>
                    )}
                    {log.action === 'login' && <span className="text-slate-500">inició sesión</span>}
                  </div>
                  <span className="text-slate-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleString('es-CR', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}

      {/* Modal confirmación limpiar día */}
      {showConfirmLimpiar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-red-500/60 p-6 shadow-2xl w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">⚠️</div>
              <h2 className="text-red-300 font-bold text-xl">Limpiar Día</h2>
              <p className="text-slate-400 text-sm mt-2">Esta acción borrará <span className="text-red-300 font-bold">todos los pagos</span> del día y no se puede deshacer.</p>
              <p className="text-slate-500 text-xs mt-1">¿Ya descargaste el cierre del día?</p>
            </div>
            <div className="mb-4">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wide block mb-2">Escribe LIMPIAR para confirmar</label>
              <input
                type="text"
                value={confirmInput}
                onChange={e => setConfirmInput(e.target.value)}
                placeholder="LIMPIAR"
                className="w-full bg-slate-700 border border-red-500/40 text-white rounded-xl p-3 text-center font-bold tracking-widest focus:outline-none focus:border-red-400"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setShowConfirmLimpiar(false); setConfirmInput(''); }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                disabled={confirmInput !== 'LIMPIAR'}
                onClick={() => {
                  setShowConfirmLimpiar(false);
                  setConfirmInput('');
                  fetch('/api/admin/clear-day', { method: 'DELETE' })
                    .then(r => r.json())
                    .then(() => { setPaidOrders([]); showToast && showToast('Datos del día eliminados'); })
                    .catch(e => showToast && showToast('Error: ' + e.message, 'error'));
                }}
                className={`flex-1 font-bold py-3 rounded-xl transition ${confirmInput === 'LIMPIAR' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
              >
                🗑️ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
