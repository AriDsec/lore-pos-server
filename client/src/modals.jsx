import { useState } from "react";
import { PINES, meseras as MESERAS } from './constants.js';
import { payBadge, imprimirTiquete } from './ui.jsx';

// ─────────────────────────────────────────────
// MODALS — ItemsModal, SplitModal, BillModal, PinModal, PinLoginScreen, SelectorScreen
// ─────────────────────────────────────────────

export function ItemsModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#94cb47] mb-1">{order.clientName || 'Sin nombre'}</h2>
        <p className="text-slate-400 text-sm mb-4">{order.locationLabel || order.barra || ((order.table && order.table > 0) ? `Mesa ${order.table}` : '' : '-')}</p>
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 space-y-1">
          {(order.items||[]).map((item, i) => (
            <div key={i} className="py-2 border-b border-slate-700/50 last:border-0">
              <div className="flex justify-between text-white">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-[#94cb47] font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
              {item.notes && <div className="text-xs text-yellow-300 mt-1">📝 {item.notes}</div>}
              {item.addedBy && <div className="text-xs text-slate-400 mt-1">👤 {item.addedBy}</div>}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-[#94cb47]/30 to-[#7ab035]/30 rounded-xl p-4 border border-[#94cb47]/50 mb-4">
          <div className="text-slate-300 text-sm">TOTAL</div>
          <div className="text-3xl font-bold text-[#94cb47]">₡{(order.total||0).toLocaleString()}</div>
        </div>
        <button onClick={onClose} className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 rounded-lg transition">Cerrar</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SPLIT MODAL — separar cuenta
// ─────────────────────────────────────────────

export function SplitModal({ account, onConfirm, onClose }) {
  const [splitError, setSplitError] = useState('');
  // splitQty: { itemId -> cantidad que va a la cuenta nueva }
  const [splitQty, setSplitQty] = useState({});

  if (!account) return null;

  const setQty = (itemId, max, val) => {
    const n = Math.max(0, Math.min(max, Number(val)));
    setSplitQty(prev => ({ ...prev, [itemId]: n }));
  };

  const totalSplit = (account.items||[]).reduce((s, i) => {
    const q = splitQty[i.id] || 0;
    return s + i.price * q;
  }, 0);

  const hasSplit = Object.values(splitQty).some(q => q > 0);

  const splitHandleConfirm = () => {
    // items que van a la nueva cuenta
    const newItems = account.items
      .map(i => ({ ...i, quantity: splitQty[i.id] || 0 }))
      .filter(i => i.quantity > 0);
    // items que quedan en la original
    const remaining = account.items
      .map(i => ({ ...i, quantity: i.quantity - (splitQty[i.id] || 0) }))
      .filter(i => i.quantity > 0);
    if (newItems.length === 0) { setSplitError('Selecciona al menos un item para separar'); return; }
    if (remaining.length === 0) { setSplitError('No puedes mover todos los items — mejor cobra la cuenta completa'); return; }
    setSplitError('');
    onConfirm(account, newItems, remaining);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/40 p-5 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#94cb47] flex items-center gap-2">✂️ Separar Cuenta</h2>
          {splitError && <div className="bg-red-900/40 border border-red-500/50 text-red-300 text-xs rounded-lg px-3 py-2 mt-2">⚠️ {splitError}</div>}
          <p className="text-slate-400 text-xs mt-1">
            {account.clientName || 'Sin nombre'} · {account.locationLabel || account.barra || ((account.table && account.table > 0) ? `Mesa ${account.table}` : 'Barra')}
          </p>
          <p className="text-slate-500 text-xs mt-1">Indica cuántos de cada item van a la cuenta nueva</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {(account.items||[]).map(item => {
            const sq = splitQty[item.id] || 0;
            return (
              <div key={item.id} className={`rounded-xl border p-3 transition-all ${sq > 0 ? 'bg-[#94cb47]/10 border-[#94cb47]/50' : 'bg-slate-700/40 border-slate-600'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-[#94cb47] text-xs">₡{item.price.toLocaleString()} c/u · {item.quantity} en cuenta</div>
                  </div>
                  {sq > 0 && (
                    <div className="text-[#94cb47] font-bold text-sm">→ ₡{(item.price * sq).toLocaleString()}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-xs w-16">Separar:</span>
                  <button
                    onClick={() => setQty(item.id, item.quantity, sq - 1)}
                    className="w-7 h-7 bg-slate-600 hover:bg-slate-500 text-white rounded-lg flex items-center justify-center font-bold transition"
                  >−</button>
                  <span className={`w-8 text-center font-bold text-sm ${sq > 0 ? 'text-[#94cb47]' : 'text-slate-400'}`}>{sq}</span>
                  <button
                    onClick={() => setQty(item.id, item.quantity, sq + 1)}
                    className="w-7 h-7 bg-slate-600 hover:bg-slate-500 text-white rounded-lg flex items-center justify-center font-bold transition"
                  >+</button>
                  <button
                    onClick={() => setQty(item.id, item.quantity, item.quantity)}
                    className="ml-1 text-xs text-slate-400 hover:text-[#94cb47] transition px-2 py-1 rounded-lg hover:bg-slate-700"
                  >Todo</button>
                </div>
              </div>
            );
          })}
        </div>

        {hasSplit && (
          <div className="mt-3 bg-[#94cb47]/10 border border-[#94cb47]/30 rounded-xl p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Cuenta nueva:</span>
              <span className="text-[#94cb47] font-bold">₡{totalSplit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-300">Queda en original:</span>
              <span className="text-white font-bold">₡{(account.total - totalSplit).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={splitHandleConfirm}
            disabled={!hasSplit}
            className={`flex-1 font-bold py-3 rounded-xl transition ${hasSplit ? 'bg-[#94cb47] hover:bg-[#7ab035] text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
          >✂️ Separar</button>
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold px-5 py-3 rounded-xl transition">✕</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BILL MODAL (cobrar)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// FUNCIÓN TIQUETE DE CAJA
// ─────────────────────────────────────────────

export function BillModal({ order, onClose, onPay, zona }) {
  const [payMethod, setPayMethod] = useState(null);
  const [montoPersonalizado, setMontoPersonalizado] = useState('');
  const [aplicandoDescuento, setAplicandoDescuento] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState('');
  const [montoEfectivoMixto, setMontoEfectivoMixto] = useState('');

  if (!order) return null;

  const totalOriginal = order.total;
  const montoFinal = aplicandoDescuento && montoPersonalizado
    ? parseInt(montoPersonalizado.replace(/\D/g, ''), 10) || totalOriginal
    : totalOriginal;
  const descuento = totalOriginal - montoFinal;
  const hayDescuento = descuento > 0;

  // Vuelto efectivo
  const recibido = parseInt(montoRecibido) || 0;
  const vuelto = recibido - montoFinal;
  const hayVuelto = payMethod === 'efectivo' && recibido > 0;

  // Pago mixto
  const efectivoMixto = parseInt(montoEfectivoMixto) || 0;
  const tarjetaMixto = Math.max(0, montoFinal - efectivoMixto);
  const mixtoValido = efectivoMixto > 0 && efectivoMixto < montoFinal;

  const methods = [
    { id: 'efectivo',          label: 'Efectivo',          color: 'border-green-500 bg-green-900/30 text-green-300' },
    { id: 'sinpe',             label: 'Sinpe',             color: 'border-blue-500 bg-blue-900/30 text-blue-300' },
    { id: 'tarjeta',           label: 'Tarjeta',           color: 'border-purple-500 bg-purple-900/30 text-purple-300' },
    { id: 'mixto',             label: 'Efectivo + Tarjeta', color: 'border-amber-500 bg-amber-900/30 text-amber-300' },
    { id: 'efectivo_sinpe',    label: 'Efectivo + Sinpe',  color: 'border-teal-500 bg-teal-900/30 text-teal-300' },
    { id: 'tarjeta_sinpe',     label: 'Tarjeta + Sinpe',   color: 'border-indigo-500 bg-indigo-900/30 text-indigo-300' },
  ];

  const handlePay = () => {
    if (!payMethod || montoFinal <= 0) return;
    if (aplicandoDescuento && montoPersonalizado && montoFinal >= totalOriginal) return;
    if (payMethod === 'mixto' && !mixtoValido) return;
    const orderConDescuento = hayDescuento
      ? { ...order, total: montoFinal, totalOriginal, descuento }
      : order;
    // Para mixto, guardar desglose en el historial
    const orderFinal = payMethod === 'mixto'
      ? { ...orderConDescuento, efectivoMixto, tarjetaMixto }
      : orderConDescuento;
    onPay(orderFinal, payMethod);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-[#94cb47] mb-1">CUENTA</h2>
          <p className="text-slate-400 text-sm">Restaurante LORE</p>
        </div>
        <div className="border-b border-[#94cb47]/30 mb-4 pb-3 space-y-1">
          <div className="text-white text-sm"><span className="text-slate-400">Cliente: </span><span className="font-bold">{order.clientName || 'Sin nombre'}</span></div>
          <div className="text-white text-sm"><span className="text-slate-400">Mesa: </span><span className="font-bold">{order.locationLabel || order.barra || ((order.table && order.table > 0) ? `Mesa ${order.table}` : '' : '-')}</span></div>
          {order.mesera && <div className="text-white text-sm"><span className="text-slate-400">Mesera: </span><span className="font-bold">{order.mesera}</span></div>}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 space-y-1 max-h-48 overflow-y-auto">
          {(order.items||[]).map((item, i) => (
            <div key={i} className="py-1.5 border-b border-slate-700/50 last:border-0">
              <div className="flex justify-between text-white text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-[#94cb47] font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
              {item.notes && <div className="text-xs text-yellow-300 mt-0.5">📝 {item.notes}</div>}
            </div>
          ))}
        </div>

        {/* Total con opción de descuento */}
        <div className="bg-gradient-to-r from-[#94cb47]/30 to-[#7ab035]/30 rounded-xl p-4 border border-[#94cb47]/50 mb-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-slate-300 text-xs">TOTAL ORIGINAL</div>
              <div className={`font-bold text-[#94cb47] ${hayDescuento ? 'text-2xl line-through opacity-50' : 'text-4xl'}`}>
                ₡{totalOriginal.toLocaleString()}
              </div>
            </div>
            {hayDescuento && (
              <div className="text-right">
                <div className="text-slate-300 text-xs">A COBRAR</div>
                <div className="text-4xl font-bold text-[#94cb47]">₡{montoFinal.toLocaleString()}</div>
                <div className="text-red-400 text-xs">-₡{descuento.toLocaleString()} descuento</div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle descuento */}
        {onPay && (
          <div className="mb-4">
            <div className={`rounded-xl border transition overflow-hidden ${aplicandoDescuento ? 'border-[#94cb47]/50' : 'border-slate-600'}`}>
              <button
                onClick={() => { setAplicandoDescuento(!aplicandoDescuento); setMontoPersonalizado(''); }}
                className={`w-full text-sm font-semibold py-2.5 px-4 flex items-center justify-between transition ${aplicandoDescuento ? 'bg-[#94cb47]/10 text-[#94cb47]' : 'bg-slate-700/40 text-slate-400 hover:text-slate-300 hover:bg-slate-700/60'}`}>
                <span>Aplicar descuento</span>
                <span className={`text-xs transition-transform ${aplicandoDescuento ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {aplicandoDescuento && (
                <div className="px-4 pb-4 pt-3 bg-[#94cb47]/5">
                  <p className="text-slate-400 text-xs mb-2">Monto final a cobrar al cliente</p>
                  <input
                    type="number"
                    value={montoPersonalizado}
                    onChange={e => setMontoPersonalizado(e.target.value)}
                    onWheel={e => e.target.blur()}
                    step={500}
                    min={0}
                    max={totalOriginal}
                    placeholder={String(Math.floor(totalOriginal / 1000) * 1000)}
                    className={`w-full bg-slate-800 text-white text-2xl font-bold rounded-xl p-3 text-center focus:outline-none placeholder-slate-600 border ${montoPersonalizado && montoFinal >= totalOriginal ? 'border-red-500/70' : 'border-[#94cb47]/40 focus:border-[#94cb47]'}`}
                    autoFocus
                  />
                  {montoPersonalizado && montoFinal >= totalOriginal && (
                    <p className="text-center text-red-400 text-xs mt-2 font-bold">
                      ⚠️ El monto debe ser menor al total original (₡{totalOriginal.toLocaleString()})
                    </p>
                  )}
                  {hayDescuento && montoFinal < totalOriginal && (
                    <p className="text-center text-[#94cb47]/60 text-xs mt-2">
                      Descuento de ₡{descuento.toLocaleString()} aplicado
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-wide">Método de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.slice(0,3).map(m => (
              <button key={m.id} onClick={() => { setPayMethod(m.id); setMontoRecibido(''); setMontoEfectivoMixto(''); }}
                className={`border-2 rounded-xl py-2.5 font-bold text-sm transition ${payMethod === m.id ? m.color : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {methods.slice(3).map(m => (
              <button key={m.id} onClick={() => { setPayMethod(m.id); setMontoRecibido(''); setMontoEfectivoMixto(''); }}
                className={`border-2 rounded-xl py-2.5 font-bold text-xs transition ${payMethod === m.id ? m.color : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {/* Sección de vuelto — solo cuando es efectivo */}
        {(payMethod === 'efectivo') && (
          <div className="mb-4 rounded-xl border border-slate-600 overflow-hidden">
            <div className="bg-slate-700/40 px-4 py-2.5">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-wide">Efectivo recibido</p>
            </div>
            <div className="p-3 space-y-3">
              {/* Denominaciones rápidas */}
              <div className="grid grid-cols-5 gap-1.5">
                {[1000, 2000, 5000, 10000, 20000].map(b => {
                  const esSugerido = b >= montoFinal && (b < parseInt(montoRecibido) || !montoRecibido);
                  const label = b === 1000 ? '₡1.000' : b === 2000 ? '₡2.000' : b === 5000 ? '₡5.000' : b === 10000 ? '₡10.000' : '₡20.000';
                  return (
                    <button
                      key={b}
                      onClick={() => setMontoRecibido(String(b))}
                      className={`py-2 rounded-lg font-bold text-xs transition border ${
                        montoRecibido === String(b)
                          ? 'bg-green-700 border-green-500 text-white'
                          : esSugerido
                          ? 'bg-slate-700/80 border-[#94cb47]/50 text-[#94cb47]'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {/* Input manual */}
              <input
                type="number"
                value={montoRecibido}
                onChange={e => setMontoRecibido(e.target.value)}
                onWheel={e => e.target.blur()}
                placeholder="O escribe el monto recibido..."
                className="w-full bg-slate-800 border border-slate-600 focus:border-green-500 text-white rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-slate-500"
              />
              {/* Resultado del vuelto */}
              {hayVuelto && (
                <div className={`rounded-xl p-3 text-center ${vuelto >= 0 ? 'bg-green-900/30 border border-green-500/40' : 'bg-red-900/30 border border-red-500/40'}`}>
                  {vuelto >= 0 ? (
                    <>
                      <div className="text-green-400 text-xs font-bold uppercase tracking-wide mb-1">Vuelto</div>
                      <div className="text-green-300 text-3xl font-bold">₡{vuelto.toLocaleString()}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-red-400 text-xs font-bold uppercase tracking-wide mb-1">Falta</div>
                      <div className="text-red-300 text-3xl font-bold">₡{Math.abs(vuelto).toLocaleString()}</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección mixto */}
        {['mixto', 'efectivo_sinpe', 'tarjeta_sinpe'].includes(payMethod) && (
          <div className="mb-4 rounded-xl border border-[#94cb47]/30 overflow-hidden">
            <div className="bg-[#94cb47]/5 px-4 py-2.5">
              <p className="text-[#94cb47] text-xs font-bold uppercase tracking-wide">
                {payMethod === 'tarjeta_sinpe' ? '¿Cuánto va en Tarjeta?' : '¿Cuánto pone en Efectivo?'}
              </p>
            </div>
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-5 gap-1.5">
                {[1000, 2000, 5000, 10000, 20000].map(b => {
                  const val = String(Math.min(b, montoFinal - 1));
                  const label = b === 1000 ? '₡1.000' : b === 2000 ? '₡2.000' : b === 5000 ? '₡5.000' : b === 10000 ? '₡10.000' : '₡20.000';
                  return (
                    <button
                      key={b}
                      onClick={() => setMontoEfectivoMixto(val)}
                      className={`py-2 rounded-lg font-bold text-xs transition border ${
                        montoEfectivoMixto === val
                          ? 'bg-[#94cb47] border-[#94cb47] text-black'
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <input
                type="number"
                value={montoEfectivoMixto}
                onChange={e => setMontoEfectivoMixto(e.target.value)}
                onWheel={e => e.target.blur()}
                placeholder="Monto en efectivo..."
                className="w-full bg-slate-800 border border-[#94cb47]/30 focus:border-[#94cb47] text-white rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-slate-500"
              />
              {efectivoMixto > 0 && (
                <div className={`rounded-xl p-3 space-y-2 ${mixtoValido ? 'bg-slate-700/40 border border-slate-600' : 'bg-red-900/20 border border-red-500/40'}`}>
                  {mixtoValido ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">{payMethod === 'tarjeta_sinpe' ? 'Tarjeta' : 'Efectivo'}</span>
                        <span className="text-green-300 font-bold">₡{efectivoMixto.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-slate-600 pt-2">
                        <span className="text-slate-400">{payMethod === 'mixto' ? 'Tarjeta' : 'Sinpe'}</span>
                        <span className="text-[#94cb47] font-bold">₡{tarjetaMixto.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-slate-600 pt-2">
                        <span className="text-slate-300 font-bold">Total</span>
                        <span className="text-[#94cb47] font-bold">₡{montoFinal.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-400 text-xs text-center font-bold">
                      El efectivo debe ser menor al total (₡{montoFinal.toLocaleString()})
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {onPay && (
            <button
              onClick={handlePay}
              disabled={
                !payMethod ||
                montoFinal <= 0 ||
                (aplicandoDescuento && montoPersonalizado && montoFinal >= totalOriginal) ||
                (payMethod === 'efectivo' && recibido > 0 && vuelto < 0) ||
                (payMethod === 'mixto' && !mixtoValido)
              }
              className={`flex-1 font-bold py-3 rounded-lg transition ${
                payMethod && montoFinal > 0 &&
                !(aplicandoDescuento && montoPersonalizado && montoFinal >= totalOriginal) &&
                !(payMethod === 'efectivo' && recibido > 0 && vuelto < 0) &&
                !(payMethod === 'mixto' && !mixtoValido)
                  ? 'bg-[#94cb47] hover:bg-[#7ab035] text-black'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}>
              Cobrar {hayDescuento ? `₡${montoFinal.toLocaleString()}` : ''}
            </button>
          )}
          <button onClick={() => imprimirTiquete(
            hayDescuento ? { ...order, total: montoFinal, totalOriginal, descuento } : order,
            zona
          )} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-3 rounded-lg transition">🖨️</button>
          <button onClick={onClose} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-3 rounded-lg transition">✕</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PIN MODAL
// ─────────────────────────────────────────────

export function PinModal({ userName, onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setPinError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PINES[userName]?.pin) {
          onSuccess();
        } else {
          setPinError(true);
          setPin('');
        }
      }, 200);
    }
  };

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setPinError(false); };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 w-full max-w-xs shadow-2xl my-auto">
        <div className="text-center mb-4">
          <div className="text-2xl mb-1">🔐</div>
          <h2 className="text-white font-bold text-lg">{userName}</h2>
          <p className="text-slate-400 text-xs mt-0.5">Ingresa tu PIN de 4 dígitos</p>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < pin.length
                ? pinError ? 'bg-red-500 border-red-500' : 'bg-[#94cb47] border-[#94cb47]'
                : 'border-slate-500'
            }`} />
          ))}
        </div>
        {pinError && <p className="text-red-400 text-center text-xs mb-3">PIN incorrecto, intenta de nuevo</p>}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[1,2,3,4,5,6,7,8,9].map(d => (
            <button key={d} onClick={() => handleDigit(String(d))}
              className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47] text-white font-bold text-xl py-3 rounded-xl transition">
              {d}
            </button>
          ))}
          <button onClick={handleDelete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-lg py-3 rounded-xl transition">
            ⌫
          </button>
          <button onClick={() => handleDigit('0')}
            className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47] text-white font-bold text-xl py-3 rounded-xl transition">
            0
          </button>
          <button onClick={onCancel}
            className="bg-red-900/50 hover:bg-red-900 text-red-300 font-bold text-sm py-3 rounded-xl transition">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PIN LOGIN SCREEN
// ─────────────────────────────────────────────

export function PinLoginScreen({ isLandscape, syncError, loading, onLogin }) {
  const [loginPin, setPin] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginBloqueado, setLoginBloqueado] = useState(false);
  const [attempting, setAttempting] = useState(false);

  const loginHandleDigit = async (d) => {
    if (loginPin.length >= 4 || attempting) return;
    const loginNext = loginPin + d;
    setPin(loginNext);
    setLoginError(false);
    setLoginBloqueado(false);
    if (loginNext.length === 4) {
      setAttempting(true);
      setTimeout(async () => {
        const loginOk = await onLogin(loginNext);
        if (loginOk === 'bloqueado') {
          setLoginBloqueado(true);
          setPin('');
        } else if (!loginOk) {
          setLoginError(true);
          setPin('');
        }
        setAttempting(false);
      }, 200);
    }
  };

  const loginHandleDelete = () => { setPin(p => p.slice(0, -1)); setLoginError(false); };

  const loginKeypad = (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl w-full max-w-xs">
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">🔐</div>
        <p className="text-slate-400 text-sm">Ingresa tu PIN</p>
      </div>
      <div className="flex justify-center gap-4 mb-4">
        {[0,1,2,3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
            i < loginPin.length
              ? loginError ? 'bg-red-500 border-red-500' : 'bg-[#94cb47] border-[#94cb47]'
              : 'border-slate-500'
          }`} />
        ))}
      </div>
      {loginError && <p className="text-red-400 text-center text-xs mb-3">PIN incorrecto</p>}
      {loginBloqueado && <p className="text-[#94cb47] text-center text-xs mb-3 font-bold">Acceso no disponible hoy — contacta al administrador</p>}
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5,6,7,8,9].map(d => (
          <button key={d} onClick={() => loginHandleDigit(String(d))}
            className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/60 text-white font-bold text-xl py-3 rounded-xl transition select-none">
            {d}
          </button>
        ))}
        <button onClick={loginHandleDelete}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-lg py-3 rounded-xl transition select-none">
          ⌫
        </button>
        <button onClick={() => loginHandleDigit('0')}
          className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/60 text-white font-bold text-xl py-3 rounded-xl transition select-none">
          0
        </button>
        <div className="py-3 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col items-center justify-center p-4 overflow-y-auto">
      {isLandscape ? (
        <div className="flex items-center gap-10 w-full max-w-2xl">
          {/* Izquierda: logo + título */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <img src="/logo.png" alt="LORE" className="w-28 h-28 object-contain drop-shadow-2xl" />
            <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.14em' }}
              className="text-white/75 text-xl font-normal">
              Sistema de Pedidos
            </div>
          </div>
          {/* Derecha: loginKeypad */}
          <div className="flex-1 flex justify-center">
            {loginKeypad}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center">
            <img src="/logo.png" alt="LORE" className="w-36 h-36 object-contain drop-shadow-2xl mb-2" />
            <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
              className="text-white/70 text-lg font-normal">
              Sistema de Pedidos
            </div>
          </div>
          {loginKeypad}
        </div>
      )}
      {syncError && (
        <div className="bg-red-900/60 border border-red-500 rounded-xl p-3 mt-4 text-red-200 text-sm text-center w-full max-w-xs">
          ⚠️ {syncError}
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
}

// ─────────────────────────────────────────────
// SELECTOR SCREEN (Admin)
// ─────────────────────────────────────────────

export function SelectorScreen({ isLandscape, syncError, loading, onSelect, onBack }) {
  const meseras = ['Mari', 'Mile', 'Lin', 'Temp Bar', 'Guido Bar'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      {isLandscape ? (
        <div className="flex items-center gap-5 mb-6 w-full max-w-3xl md:max-w-5xl">
          <img src="/logo.png" alt="LORE" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl flex-shrink-0" />
          <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.14em' }}
            className="text-white/75 text-2xl md:text-4xl font-normal drop-shadow-lg flex-1">
            Sistema de Pedidos
          </div>
          <button onClick={onBack} className="flex items-center gap-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white text-sm md:text-base font-medium px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg transition border border-slate-600 flex-shrink-0">← PIN</button>
        </div>
      ) : (
        <div className="flex flex-col items-center mb-5 w-full max-w-md">
          <img src="/logo.png" alt="LORE" className="w-32 h-32 object-contain drop-shadow-2xl mb-2" />
          <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.12em' }}
            className="text-white/70 text-lg font-normal mb-3">
            Sistema de Pedidos
          </div>
        </div>
      )}
      {syncError && (
        <div className="bg-red-900/60 border border-red-500 rounded-xl p-3 mb-3 text-red-200 text-sm md:text-base text-center w-full max-w-2xl md:max-w-5xl">
          ⚠️ {syncError}
        </div>
      )}
      <div className={`w-full ${isLandscape ? 'grid grid-cols-3 gap-4 max-w-3xl md:max-w-5xl' : 'grid grid-cols-2 gap-3 max-w-md'}`}>
        <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 md:p-7 shadow-2xl">
          <h2 className="text-[#94cb47] font-bold text-sm md:text-lg mb-3">🍺 ZONA BAR</h2>
          <button onClick={() => onSelect('Caja Bar')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 md:py-4 md:text-lg rounded-xl transition shadow-lg mb-3">💰 Caja Bar</button>
          <div className="space-y-2 md:space-y-3">
            {meseras.filter(m => m !== 'Guido Bar').map(m => (
              <button key={m} onClick={() => onSelect(m)} className="w-full bg-slate-700/60 hover:bg-slate-600 text-[#94cb47] py-2 md:py-3.5 md:text-base rounded-lg transition font-medium text-sm">{m}</button>
            ))}
            <button onClick={() => onSelect('Guido Bar')} className="w-full bg-slate-700/60 hover:bg-slate-600 text-[#94cb47] py-2 md:py-3.5 md:text-base rounded-lg transition font-medium text-sm border border-[#94cb47]/30">👑 Guido</button>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 md:p-7 shadow-2xl">
          <h2 className="text-[#94cb47] font-bold text-sm md:text-lg mb-3">🍽️ ZONA RESTAURANTE</h2>
          <button onClick={() => onSelect('Caja Restaurante')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 md:py-4 md:text-lg rounded-xl transition shadow-lg mb-3">💰 Caja</button>
          <button onClick={() => onSelect('Tablet Restaurante')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 md:py-4 md:text-lg rounded-xl transition shadow-lg mb-3">📱 Tomar Pedidos</button>
          <button onClick={() => onSelect('Cocina')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 md:py-4 md:text-lg rounded-xl transition shadow-lg">👨‍🍳 Cocina</button>
        </div>
        <div className={`bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 md:p-7 shadow-2xl flex flex-col justify-between gap-3 ${!isLandscape ? "col-span-2" : ""}`}>
          <button onClick={() => onSelect('__admin__')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 md:py-4 md:text-lg rounded-xl transition shadow-lg">📊 Panel Admin</button>
          {!isLandscape && <button onClick={onBack} className="w-full flex items-center justify-center gap-2 bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl transition border border-slate-600 text-sm">← Volver al PIN</button>}
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
}