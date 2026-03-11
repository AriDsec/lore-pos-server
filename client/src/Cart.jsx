import { Minus, Plus, Trash2, Utensils } from 'lucide-react';

export function ShoppingCart({
  cartItems, updateQuantity, removeFromCart, updateNotes, completeOrder,
  orderType, setOrderType, selectedTable, setSelectedTable,
  selectedBarra, setSelectedBarra, clientName, setClientName,
  barras, maxTables,
  openAccounts, selectedAccount, onSelectAccount,
  mobileVisible, onDirectPay, isBar,
}) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const baseClass = "bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 overflow-hidden flex flex-col shadow-2xl";
  const mobileClass = mobileVisible ? "flex flex-col max-h-[calc(100vh-140px)]" : "hidden";

  const inner = (
    <>
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
        <h2 className="text-white font-bold text-lg">
          🛒 Carrito
          {cartItems.length > 0 && (
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">{cartItems.length}</span>
          )}
        </h2>
      </div>

      <div className="px-4 pt-3">
        <label className="text-slate-400 text-xs mb-1 block">Cuenta abierta</label>
        <select
          value={selectedAccount || ''}
          onChange={(e) => onSelectAccount(e.target.value || null)}
          className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-sm focus:outline-none"
        >
          <option value="">➕ Nueva Cuenta</option>
          {openAccounts.map(acc => (
            <option key={acc.id} value={acc.id}>
              {acc.barra ? acc.barra : `Mesa ${acc.table}`}{acc.clientName ? ` — ${acc.clientName}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Utensils size={36} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Carrito vacío</p>
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-3 border border-[#94cb47]/20">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                  <div className="font-bold text-white text-sm leading-tight">{item.name}</div>
                  <div className="text-[#94cb47] font-bold text-sm">₡{(item.price * item.quantity).toLocaleString()}</div>
                  {item.addedBy && <div className="text-xs text-slate-400">👤 {item.addedBy}</div>}
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 mb-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-slate-700 rounded">
                  <Minus size={13} className="text-slate-400" />
                </button>
                <span className="flex-1 text-center text-white font-bold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-slate-700 rounded">
                  <Plus size={13} className="text-slate-400" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Notas..."
                value={item.notes || ''}
                onChange={(e) => updateNotes(item.id, e.target.value)}
                className="w-full bg-slate-900/50 border border-[#94cb47]/20 text-white text-xs rounded p-1.5 focus:outline-none focus:border-[#94cb47] placeholder-slate-600"
              />
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="border-t border-[#94cb47]/20 p-3 space-y-2 bg-gradient-to-t from-slate-900 to-transparent overflow-y-auto flex-shrink-0 max-h-[45vh]">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Tipo</label>
            <select value={orderType || ''} onChange={(e) => setOrderType(e.target.value)} className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-sm focus:outline-none">
              <option value="">Seleccionar...</option>
              <option value="dine-in">Local</option>
              <option value="takeout">Llevar</option>
            </select>
          </div>
          {orderType === 'dine-in' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Mesa</label>
                <select value={selectedTable || ''} onChange={(e) => { setSelectedTable(e.target.value); setSelectedBarra(null); }} className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-xs focus:outline-none">
                  <option value="">—</option>
                  {Array.from({ length: maxTables }, (_, i) => <option key={i + 1} value={i + 1}>Mesa {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-1 block">Barra</label>
                <select value={selectedBarra || ''} onChange={(e) => { setSelectedBarra(e.target.value); setSelectedTable(null); }} className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-xs focus:outline-none">
                  <option value="">—</option>
                  {barras.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          )}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Nombre/Seña</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Juan, cliente alto..." className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-sm focus:outline-none placeholder-slate-600" />
          </div>
          <div className="flex items-center justify-between bg-gradient-to-br from-[#94cb47]/30 to-[#7ab035]/30 rounded-xl p-3 border border-[#94cb47]/50">
            <div className="text-slate-300 text-sm">Total</div>
            <div className="text-2xl font-bold text-[#94cb47]">₡{total.toLocaleString()}</div>
          </div>
          <button onClick={completeOrder} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-3 rounded-xl transition shadow-xl text-base">✓ Guardar Cuenta</button>
          {isBar && onDirectPay && (
            <button onClick={onDirectPay} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-xl text-base">💵 Cobro Directo</button>
          )}
        </div>
      )}
    </>
  );

  if (mobileVisible === 'landscape') {
    return <div className={`${baseClass} h-[calc(100vh-80px)] sticky top-4`}>{inner}</div>;
  }
  return (
    <div className={`${baseClass} ${mobileClass}`}>{inner}</div>
  );
}
