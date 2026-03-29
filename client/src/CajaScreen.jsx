import { useState } from 'react';
import { Header, payBadge, imprimirTiquete, Spinner } from './ui.jsx';
import { BillModal, ItemsModal, SplitModal } from './modals.jsx';

function CajaStats({ paid, zona }) {
  const totalCobrado = paid.reduce((s, o) => s + o.total, 0);
  const foodCobrado  = paid.reduce((s, o) => s + (o.foodItems || o.items?.filter(i => i.category === 'food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
  const drinkCobrado = paid.reduce((s, o) => s + (o.drinkItems || o.items?.filter(i => i.category !== 'food') || []).reduce((a, i) => a + i.price * i.quantity, 0), 0);
  return { totalCobrado, foodCobrado, drinkCobrado };
}

export function CajaScreen({
  zona, zonaNombre, accounts, paid,
  loading, billOrder, setBillOrder, viewItemsOrder, setViewItemsOrder,
  splitOrder, setSplitOrder, onSplit,
  onLogout, onPay, onDelete,
}) {
  const { totalCobrado, foodCobrado, drinkCobrado } = CajaStats({ paid });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {loading && <Spinner />}
      <Header mesera={`Caja ${zonaNombre}`} zona="Caja" onLogout={onLogout} />
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-5">

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm md:text-base">Cuentas Pagadas</div>
            <div className="text-3xl md:text-4xl font-bold text-white mt-2">{paid.length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm md:text-base">Total Comida</div>
            <div className="text-2xl md:text-3xl font-bold text-[#94cb47] mt-2">₡{foodCobrado.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
            <div className="text-slate-400 text-sm md:text-base">Total Bebidas</div>
            <div className="text-2xl md:text-3xl font-bold text-[#94cb47] mt-2">₡{drinkCobrado.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#94cb47]/20 to-[#7ab035]/20 border border-[#94cb47]/30 rounded-2xl p-6 shadow-2xl">
          <div className="text-white/80 text-base">💰 Total Cobrado Hoy — {zonaNombre}</div>
          <div className="text-4xl font-bold text-white">₡{totalCobrado.toLocaleString()}</div>
        </div>

        {/* ── Cobros Directos ── */}
        {(() => {
          const directas = accounts.filter(a => a.type === 'direct');
          if (directas.length === 0) return null;
          return (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 p-5 shadow-2xl">
              <h3 className="text-slate-300 font-bold text-lg mb-4">Cobros Directos ({directas.length})</h3>
              <div className="space-y-3">
                {directas.map(acc => (
                  <div key={acc._id || acc.id} className="bg-slate-700/40 rounded-xl p-4 md:p-5 flex flex-wrap justify-between items-center gap-3 border border-slate-600/50">
                    <div>
                      <div className="text-white font-bold md:text-lg">{acc.locationLabel || acc.barra || 'Barra'}{acc.clientName && acc.clientName !== 'Cliente General' ? ` — ${acc.clientName}` : ''}</div>
                      <div className="text-slate-400 text-xs md:text-sm">👤 {acc.mesera} · {acc.items.length} items</div>
                    </div>
                    <div className="flex flex-col gap-1.5 items-end">
                      <span className="text-[#94cb47] font-bold text-sm md:text-lg">₡{acc.total.toLocaleString()}</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setViewItemsOrder(acc)} className="bg-slate-600 hover:bg-slate-500 text-white px-2.5 md:px-4 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold">Items</button>
                        <button onClick={() => setBillOrder(acc)} className="bg-[#94cb47] hover:bg-[#7ab035] text-black px-2.5 md:px-4 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold">Cobrar</button>
                        {onDelete && (
                          <button onClick={() => setDeleteConfirm(acc)}
                            className="bg-red-800/60 hover:bg-red-700 text-red-300 hover:text-white px-2 md:px-3 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold border border-red-700/50">🗑️</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── Cuentas Abiertas ── */}
        {(() => {
          const normales = accounts.filter(a => a.type !== 'direct');
          return (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
              <h3 className="text-[#94cb47] font-bold text-lg mb-4">Cuentas Abiertas ({normales.length})</h3>
              {normales.length === 0
                ? <p className="text-slate-500 text-sm">No hay cuentas abiertas</p>
                : (
                  <div className="space-y-3">
                    {normales.map(acc => (
                      <div key={acc._id || acc.id} className="bg-slate-700/50 rounded-xl p-4 md:p-5 flex flex-wrap justify-between items-center gap-3 border border-slate-600">
                        <div>
                          <div className="text-white font-bold md:text-lg">{acc.barra || ((acc.table && acc.table > 0) ? `Mesa ${acc.table}` : acc.locationLabel || 'Barra')}{acc.clientName ? ` — ${acc.clientName}` : ''}</div>
                          <div className="text-slate-400 text-xs md:text-sm">👤 {acc.mesera} · {acc.items.length} items</div>
                        </div>
                        <div className="flex flex-col gap-1.5 items-end">
                          <span className="text-[#94cb47] font-bold text-sm md:text-lg">₡{acc.total.toLocaleString()}</span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setViewItemsOrder(acc)} className="bg-slate-600 hover:bg-slate-500 text-white px-2.5 md:px-4 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold">Items</button>
                            {acc.items.length > 1 && (
                              <button onClick={() => setSplitOrder(acc)} className="bg-orange-700 hover:bg-orange-600 text-white px-2.5 md:px-4 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold">Separar</button>
                            )}
                            <button onClick={() => setBillOrder(acc)} className="bg-[#94cb47] hover:bg-[#7ab035] text-black px-2.5 md:px-4 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold">Cobrar</button>
                            {onDelete && (
                              <button onClick={() => setDeleteConfirm(acc)}
                                className="bg-red-800/60 hover:bg-red-700 text-red-300 hover:text-white px-2 md:px-3 py-1 md:py-2.5 rounded text-xs md:text-sm font-bold border border-red-700/50">🗑️</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }
            </div>
          );
        })()}

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-5 shadow-2xl">
          <h3 className="text-[#94cb47] font-bold text-lg mb-4">✅ Historial Pagadas ({paid.length})</h3>
          {paid.length === 0 ? <p className="text-slate-500 text-sm">Sin pagos aún</p> : (
            <div className="space-y-3">
              {[...paid].sort((a, b) => new Date(b.closedAt) - new Date(a.closedAt)).map(o => (
                <div key={o._id || o.id} className="bg-slate-700/40 border border-slate-600/60 rounded-xl p-3">
                  {/* Fila superior: ubicación + cliente + total */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm leading-tight">
                        {o.locationLabel || o.barra || ((o.table && o.table > 0) ? `Mesa ${o.table}` : '—')}
                        {o.clientName ? <span className="text-slate-300"> — {o.clientName}</span> : ''}
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        👤 {o.mesera}
                        {o.closedAt && <span className="ml-2 text-slate-500">· {new Date(o.closedAt).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#94cb47] font-bold text-lg whitespace-nowrap">₡{o.total.toLocaleString()}</div>
                      {o.descuento > 0 && (
                        <div className="text-amber-400 text-xs whitespace-nowrap">-₡{o.descuento.toLocaleString()} desc.</div>
                      )}
                    </div>
                  </div>
                  {/* Fila inferior: método de pago + botones */}
                  <div className="flex items-center justify-between gap-2">
                    <div>{payBadge(o.paymentMethod)}</div>
                    <div className="flex gap-1.5">
                      <button onClick={() => setViewItemsOrder(o)} className="bg-slate-600 hover:bg-slate-500 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-bold">📋 Ver</button>
                      <button onClick={() => imprimirTiquete(o, zona)} className="bg-blue-700 hover:bg-blue-800 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg text-xs md:text-sm font-bold">🖨️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {billOrder && <BillModal order={billOrder} onClose={() => setBillOrder(null)} onPay={onPay} zona={zona} />}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border-2 border-red-500/50 p-6 shadow-2xl w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🗑️</div>
              <h2 className="text-red-300 font-bold text-xl">Eliminar Cuenta</h2>
              <p className="text-slate-400 text-sm mt-2">
                ¿Seguro que deseas eliminar esta cuenta?
              </p>
              <div className="bg-slate-700/60 rounded-xl p-3 mt-3 text-left">
                <div className="text-white font-bold text-sm">
                  {deleteConfirm.barra || ((deleteConfirm.table && deleteConfirm.table > 0) ? `Mesa ${deleteConfirm.table}` : '—')}
                  {deleteConfirm.clientName ? ` — ${deleteConfirm.clientName}` : ''}
                </div>
                <div className="text-slate-400 text-xs mt-0.5">
                  👤 {deleteConfirm.mesera} · {deleteConfirm.items.length} items · ₡{deleteConfirm.total.toLocaleString()}
                </div>
              </div>
              <p className="text-red-400/70 text-xs mt-3">Esta acción no se puede deshacer</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition">
                Cancelar
              </button>
              <button
                onClick={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {viewItemsOrder && <ItemsModal order={viewItemsOrder} onClose={() => setViewItemsOrder(null)} />}
      {splitOrder && <SplitModal account={splitOrder} onConfirm={onSplit} onClose={() => setSplitOrder(null)} />}
    </div>
  );
}
