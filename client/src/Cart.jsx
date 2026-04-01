import { Minus, Plus, Trash2, Utensils } from 'lucide-react';

export function ShoppingCart({
  cartItems, updateQuantity, removeFromCart, updateNotes, completeOrder,
  orderType, setOrderType, selectedTable, setSelectedTable,
  selectedBarra, setSelectedBarra, clientName, setClientName,
  barras, maxTables, tables,
  openAccounts, selectedAccount, onSelectAccount,
  mobileVisible, onDirectPay, isBar, onSplit,
  currentUser, aplicaServicio, loading,
}) {
  // Si la cuenta seleccionada pertenece a otra mesera, solo se pueden agregar items (no borrar/editar los existentes)
  const selectedAcc = selectedAccount ? openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount) : null;
  const isOthersMesera = selectedAcc && selectedAcc.mesera && currentUser && selectedAcc.mesera !== currentUser;
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!mobileVisible) return null;

  const wrapClass = "bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 shadow-2xl overflow-hidden";

  return (
    <div className={wrapClass}>
      {/* Header fijo */}
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

      {/* Todo el contenido hace scroll junto */}
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
            {openAccounts.filter(a => a.status !== 'pending_payment').map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.barra ? acc.barra : (acc.table && acc.table > 0) ? `Mesa ${acc.table}` : 'Sin mesa'}{acc.clientName ? ` — ${acc.clientName}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de items */}
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Utensils size={28} className="mx-auto mb-2 opacity-50" />
            <p className="text-xs">Carrito vacío</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cartItems.map(item => (
              <div key={item.id} className="bg-slate-700/60 rounded-lg p-2 border border-[#94cb47]/20">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex-1 pr-1 min-w-0">
                    <div className="font-bold text-white text-xs md:text-lg leading-tight">{item.name}</div>
                    <div className="text-[#94cb47] font-bold text-xs md:text-lg">₡{(item.price * item.quantity).toLocaleString()}</div>
                    {item.addedBy && <div className="text-slate-500 text-xs">👤 {item.addedBy}</div>}
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
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/30 rounded-xl border border-slate-600 transition flex-shrink-0">
                        <Minus size={13} className="text-slate-300 md:hidden" />
                        <Minus size={18} className="text-slate-300 hidden md:block" />
                      </button>
                      <span className="flex-1 text-center text-white font-bold text-sm md:text-xl">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47]/30 rounded-xl border border-slate-600 transition flex-shrink-0">
                        <Plus size={13} className="text-slate-300 md:hidden" />
                        <Plus size={18} className="text-slate-300 hidden md:block" />
                      </button>
                    </div>
                  ) : (
                    <span className="flex-1 text-center text-slate-400 text-xs md:text-base py-1">x{item.quantity}</span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Notas..."
                  value={item.notes || ''}
                  onChange={(e) => updateNotes(item.id, e.target.value.slice(0, 80))} maxLength={80}
                  className="w-full bg-slate-900/50 border border-[#94cb47]/20 text-white text-xs md:text-base rounded p-1 md:p-2.5 focus:outline-none focus:border-[#94cb47] placeholder-slate-600"
                />
              </div>
            ))}
          </div>
        )}

        {/* Formulario + botones — solo si hay items */}
        {cartItems.length > 0 && (
          <div className="space-y-2 border-t border-[#94cb47]/20 pt-3">
            {/* Tipo */}
            <div>
              <label className="text-slate-400 text-xs md:text-lg mb-0.5 block">Tipo</label>
              <select value={orderType || ''} onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-1.5 md:p-3 text-xs md:text-lg focus:outline-none">
                <option value="">Seleccionar...</option>
                <option value="dine-in">Local</option>
                <option value="takeout">Llevar</option>
              </select>
            </div>

            {/* Mesa + Barra — Barra solo en bar */}
            {orderType === 'dine-in' && (
              <div className={isBar ? "grid grid-cols-2 gap-2" : "grid grid-cols-1"}>
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
                {isBar && (
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
            <div className="flex items-center justify-between bg-[#94cb47]/20 rounded-lg px-3 py-2 border border-[#94cb47]/40">
              <span className="text-slate-300 text-xs">Total</span>
              <span className="text-lg font-bold text-[#94cb47]">₡{total.toLocaleString()}</span>
            </div>

            {/* Botones */}
            <button onClick={completeOrder} disabled={loading}
              className={`w-full font-bold py-2.5 rounded-xl transition text-sm ${loading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-[#94cb47] hover:bg-[#7ab035] text-black'}`}>
              {loading ? '⏳ Guardando...' : '✓ Guardar Cuenta'}
            </button>
            {selectedAccount && cartItems.length > 1 && onSplit && (
              <button
                onClick={() => {
                  const acc = openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount);
                  if (acc) onSplit(acc);
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm">
                ✂️ Separar Cuenta
              </button>
            )}
            {isBar && onDirectPay && !selectedAccount && (
              <button onClick={onDirectPay}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm">
                💵 Cobro Directo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
