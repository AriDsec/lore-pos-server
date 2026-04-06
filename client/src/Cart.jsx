import { Minus, Plus, Trash2, Utensils } from 'lucide-react';

export function ShoppingCart({
  cartItems, updateQuantity, removeFromCart, updateNotes, completeOrder,
  orderType, setOrderType, selectedTable, setSelectedTable,
  selectedBarra, setSelectedBarra, clientName, setClientName,
  barras, maxTables, tables, modoRestaurante, onToggleModoRestaurante,
  openAccounts, selectedAccount, onSelectAccount,
  mobileVisible, onDirectPay, isBar, onSplit,
  onPayRejected, onDeleteRejected,
  currentUser, aplicaServicio, loading,
}) {
  const selectedAcc = selectedAccount
    ? openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount)
    : null;
  const isOthersMesera = selectedAcc && selectedAcc.mesera && currentUser && selectedAcc.mesera !== currentUser;

  // Total de items nuevos en carrito
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  // Total de la cuenta existente
  const accTotal = selectedAcc ? (selectedAcc.total || 0) : 0;
  // Total combinado que quedará en la cuenta
  const combinedTotal = accTotal + cartTotal;

  const hasContent = cartItems.length > 0 || selectedAcc;

  if (!mobileVisible) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#94cb47]/10 bg-slate-800/90 sticky top-0 z-10">
        <h2 className="text-white font-bold text-base md:text-2xl">
          🛒 Carrito
          {cartItems.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">{cartItems.length}</span>
          )}
          {aplicaServicio && (
            <span className="ml-2 bg-[#94cb47]/20 text-[#94cb47] text-xs font-bold px-2 py-0.5 rounded-full border border-[#94cb47]/40">+10% serv.</span>
          )}
        </h2>
      </div>

      <div className="p-3 space-y-3">

        {/* Selector cuenta */}
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Cuenta abierta</label>
          <select
            value={selectedAccount || ''}
            onChange={(e) => onSelectAccount(e.target.value || null)}
            className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-xs focus:outline-none"
          >
            <option value="">➕ Nueva Cuenta</option>
            {openAccounts.filter(a => a.status !== 'pending_payment' && a.status !== 'pending_approval' && a.status !== 'rejected').map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.barra ? acc.barra : (acc.table && acc.table > 0) ? `Mesa ${acc.table}` : 'Sin mesa'}{acc.clientName ? ` — ${acc.clientName}` : ''}
              </option>
            ))}
          </select>

          {/* Pendientes aprobación */}
          {openAccounts.filter(a => a.status === 'pending_approval' && a.mesera === currentUser).map(acc => (
            <div key={acc.id || acc._id} className="mt-1 text-xs text-amber-400 bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-1.5">
              ⏳ {acc.clientName || acc.locationLabel} — esperando aprobación de caja
            </div>
          ))}

          {/* Rechazadas */}
          {openAccounts.filter(a => a.status === 'rejected' && a.mesera === currentUser).map(acc => (
            <div key={acc.id || acc._id} className="mt-1 text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
              <div className="mb-1">❌ {acc.clientName || acc.locationLabel} — rechazada</div>
              {acc.rejectedReason && <div className="text-red-300 mb-1.5">Motivo: {acc.rejectedReason}</div>}
              <div className="flex gap-2">
                <button onClick={() => onPayRejected && onPayRejected(acc)}
                  className="flex-1 bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-1 rounded text-xs transition">
                  Cobrar directo
                </button>
                <button onClick={() => onDeleteRejected && onDeleteRejected(acc)}
                  className="flex-1 bg-red-900/60 hover:bg-red-900 text-red-300 font-bold py-1 rounded text-xs transition">
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Items existentes en la cuenta (solo lectura) */}
        {selectedAcc && (selectedAcc.items || []).length > 0 && (
          <div className="rounded-xl border border-slate-600/50 overflow-hidden">
            <div className="bg-slate-700/40 px-3 py-1.5 flex justify-between items-center">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">En la cuenta</span>
              <span className="text-[#94cb47] text-xs font-bold">₡{accTotal.toLocaleString()}</span>
            </div>
            <div className="divide-y divide-slate-700/40">
              {(selectedAcc.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center px-3 py-2">
                  <div>
                    <span className="text-white text-xs md:text-sm">{item.quantity}x {item.name}</span>
                    {item.breakdown && Object.keys(item.breakdown).length > 1
                      ? <div className="text-slate-500 text-xs">{Object.entries(item.breakdown).map(([u, q]) => `${u} x${q}`).join(' · ')}</div>
                      : item.addedBy && <div className="text-slate-500 text-xs">👤 {item.addedBy}</div>
                    }
                  </div>
                  <span className="text-slate-400 text-xs">₡{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items nuevos */}
        {cartItems.length === 0 ? (
          <div className="text-center py-6 text-slate-500">
            <Utensils size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">{selectedAcc ? 'Agrega items nuevos a la cuenta' : 'Carrito vacío'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedAcc && <div className="text-slate-400 text-xs font-bold uppercase tracking-wide px-1">Agregando</div>}
            {cartItems.map(item => (
              <div key={item.id} className="bg-slate-700/60 rounded-lg p-2 border border-[#94cb47]/20">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex-1 pr-1 min-w-0">
                    <div className="font-bold text-white text-xs md:text-lg leading-tight">{item.name}</div>
                    <div className="text-[#94cb47] font-bold text-xs md:text-lg">₡{(item.price * item.quantity).toLocaleString()}</div>
                    {item.breakdown && Object.keys(item.breakdown).length > 1
                      ? <div className="text-slate-500 text-xs">{Object.entries(item.breakdown).map(([u, q]) => `${u} x${q}`).join(' · ')}</div>
                      : item.addedBy && <div className="text-slate-500 text-xs">👤 {item.addedBy}</div>
                    }
                  </div>
                  {!isOthersMesera && (
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 p-0.5 flex-shrink-0">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {!isOthersMesera ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/30 rounded-xl border border-slate-600 transition flex-shrink-0">
                        <Minus size={13} className="text-slate-300 md:hidden" />
                        <Minus size={18} className="text-slate-300 hidden md:block" />
                      </button>
                      <span className="flex-1 text-center text-white font-bold text-sm md:text-xl">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/30 rounded-xl border border-slate-600 transition flex-shrink-0">
                        <Plus size={13} className="text-slate-300 md:hidden" />
                        <Plus size={18} className="text-slate-300 hidden md:block" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 text-center text-slate-400 text-xs md:text-base py-1">x{item.quantity}</span>
                  )}
                </div>
                <input type="text" placeholder="Notas..."
                  value={item.notes || ''}
                  onChange={(e) => updateNotes(item.id, e.target.value.slice(0, 80))} maxLength={80}
                  className="w-full bg-slate-900/50 border border-[#94cb47]/20 text-white text-xs md:text-base rounded p-1 md:p-2.5 focus:outline-none focus:border-[#94cb47] placeholder-slate-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulario — visible si hay items nuevos O si se está editando una cuenta */}
        {(cartItems.length > 0 || selectedAcc) && (
          <div className="space-y-2 border-t border-[#94cb47]/20 pt-3">

            {/* Tipo — solo para cuenta nueva */}
            {!selectedAcc && (
              <div>
                <label className="text-slate-400 text-xs md:text-lg mb-0.5 block">Tipo</label>
                <select value={orderType || ''} onChange={(e) => setOrderType(e.target.value)}
                  className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-1.5 md:p-3 text-xs md:text-lg focus:outline-none">
                  <option value="">Seleccionar...</option>
                  <option value="dine-in">Local</option>
                  <option value="takeout">Llevar</option>
                </select>
              </div>
            )}

            {/* Mesa + Barra */}
            {(orderType === 'dine-in' || selectedAcc) && (
              <div className={(isBar && !modoRestaurante) ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"}>
                <div>
                  <label className="text-slate-400 text-xs md:text-lg mb-0.5 block">Mesa</label>
                  <select value={selectedTable || ''} onChange={(e) => { setSelectedTable(e.target.value ? Number(e.target.value) : null); setSelectedBarra(null); }}
                    className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-1.5 md:p-3 text-xs md:text-lg focus:outline-none">
                    <option value="">—</option>
                    {(tables || Array.from({ length: maxTables }, (_, i) => i + 1)).map(n => (
                      <option key={n} value={n}>Mesa {n}</option>
                    ))}
                  </select>
                </div>
                {isBar && !modoRestaurante && (
                  <div>
                    <label className="text-slate-400 text-xs md:text-lg mb-0.5 block">Barra</label>
                    <select value={selectedBarra || ''} onChange={(e) => { setSelectedBarra(e.target.value); setSelectedTable(null); }}
                      className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-1.5 md:p-3 text-xs md:text-lg focus:outline-none">
                      <option value="">—</option>
                      {barras.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Nombre */}
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre / Seña del cliente..."
              className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-1.5 md:p-3 text-xs md:text-lg focus:outline-none placeholder-slate-600" />

            {/* Total */}
            <div className="bg-[#94cb47]/20 rounded-lg px-3 py-2 border border-[#94cb47]/40">
              {selectedAcc && cartItems.length > 0 ? (
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>En cuenta</span>
                    <span>₡{accTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Nuevo</span>
                    <span>₡{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#94cb47]/30 pt-1 mt-1">
                    <span className="text-slate-300 text-xs">Total cuenta</span>
                    <span className="text-lg font-bold text-[#94cb47]">₡{combinedTotal.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 text-xs">Total</span>
                  <span className="text-lg font-bold text-[#94cb47]">₡{(selectedAcc ? accTotal : cartTotal).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Guardar — solo si hay items nuevos */}
            {cartItems.length > 0 && (
              <button onClick={completeOrder} disabled={loading}
                className={`w-full font-bold py-2.5 rounded-xl transition text-sm ${loading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-[#94cb47] hover:bg-[#7ab035] text-black'}`}>
                {loading ? '⏳ Guardando...' : selectedAcc ? '✓ Agregar a cuenta' : '✓ Guardar Cuenta'}
              </button>
            )}

            {/* Separar cuenta */}
            {selectedAccount && cartItems.length > 1 && onSplit && (
              <button onClick={() => { const acc = openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount); if (acc) onSplit(acc); }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm">
                ✂️ Separar Cuenta
              </button>
            )}

            {/* Cobro directo — solo bar, sin cuenta seleccionada */}
            {isBar && !modoRestaurante && onDirectPay && !selectedAccount && (
              <button onClick={onDirectPay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm">
                💵 Cobro Directo
              </button>
            )}
          </div>
        )}

        {/* Modo Restaurante toggle — solo para meseras de bar */}
        {isBar && onToggleModoRestaurante && (
          <button onClick={onToggleModoRestaurante}
            className={`w-full py-2 rounded-xl border text-xs font-bold transition ${modoRestaurante ? 'bg-[#94cb47]/20 border-[#94cb47]/50 text-[#94cb47]' : 'bg-slate-700/40 border-slate-600 text-slate-400 hover:text-slate-300'}`}>
            {modoRestaurante ? '🍽 Modo Restaurante activo' : '🍽 Modo Restaurante'}
          </button>
        )}

      </div>
    </div>
  );
}
