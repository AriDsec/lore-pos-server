import { useState, useMemo } from "react";
import { Plus, Minus, Trash2, LogOut, Utensils, ChevronDown, Search, Clock, Package } from 'lucide-react';
import { PINES, LICORES, OTROS } from './constants.js';

// ─────────────────────────────────────────────
// SPINNER
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
// HEADER
// ─────────────────────────────────────────────
export function Header({ mesera, zona, onLogout }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-[#94cb47]/20 p-5 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#94cb47]">LORE</h1>
          <p className="text-[#94cb47]/70 text-sm">{zona} • {mesera}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg">
          <LogOut size={18} /> Salir
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
  return <span style={{whiteSpace:'nowrap'}} className="inline-flex items-center gap-1 bg-green-900/50 text-green-300 border border-green-600 px-2 py-0.5 rounded-full text-xs font-bold">💵 Efectivo</span>;
};

// ─────────────────────────────────────────────
// ITEM BUTTON (menú regular)
// ─────────────────────────────────────────────
export function ItemButton({ item, onSelectItem }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 border border-[#94cb47]/20 hover:border-[#94cb47]/40 rounded-lg p-3 transition-all">
        <span className="flex-1 font-bold text-white text-sm leading-tight">{item.name}</span>
        <span className="text-[#94cb47] font-bold text-sm whitespace-nowrap">₡{item.price.toLocaleString()}</span>
        <button
          onClick={() => onSelectItem(item, false)}
          className="bg-[#94cb47] hover:bg-[#7ab035] text-black rounded-md w-7 h-7 flex items-center justify-center flex-shrink-0 transition"
        >
          <Plus size={14} />
        </button>
      </div>
      {item.canHavePapas && (
        <div className="flex items-center gap-2 bg-slate-700/50 border border-[#94cb47]/20 hover:border-[#94cb47]/50 rounded-lg px-3 py-2 ml-3 transition-all">
          <span className="flex-1 text-amber-200/80 text-xs">↳ con Papas</span>
          <span className="text-[#94cb47] font-bold text-xs whitespace-nowrap">₡{(item.price + 500).toLocaleString()}</span>
          <button
            onClick={() => onSelectItem(item, true)}
            className="bg-amber-600 hover:bg-amber-500 text-white rounded-md w-6 h-6 flex items-center justify-center flex-shrink-0 transition"
          >
            <Plus size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MODAL LICOR — selección de presentación
// ─────────────────────────────────────────────
export function LicorModal({ licor, onSelect, onClose }) {
  if (!licor) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/40 p-6 shadow-2xl w-full max-w-sm">
        <div className="text-center mb-5">
          <div className="text-3xl mb-1">🥃</div>
          <h2 className="text-xl font-bold text-[#94cb47]">{licor.name}</h2>
          <p className="text-slate-400 text-xs mt-1">Selecciona la presentación</p>
        </div>
        <div className="space-y-2">
          {licor.presentaciones.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(licor, p)}
              className="w-full flex items-center justify-between bg-slate-700 hover:bg-[#94cb47]/10 border border-slate-600 hover:border-[#94cb47]/60 rounded-xl px-4 py-3 transition-all group"
            >
              <span className="font-bold text-white group-hover:text-[#94cb47] transition">{p.label}</span>
              <span className="text-[#94cb47] font-bold text-sm">₡{p.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LICORES PANEL — lista de licores con modal
// ─────────────────────────────────────────────
export function LicoresPanel({ onAddToCart }) {
  const [selectedLicor, setSelectedLicor] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    LICORES.filter(l => l.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const handleSelect = (licor, presentacion) => {
    onAddToCart({
      id: `${licor.id}_${presentacion.id}_${Date.now()}`,
      name: `${licor.name} — ${presentacion.label}`,
      price: presentacion.price,
      category: 'alcoholic',
      quantity: 1,
    }, false);
    setSelectedLicor(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-[#94cb47]/20 to-slate-800 p-5">
          <h2 className="text-white font-bold text-xl mb-3 flex items-center gap-2">🥃 Licores</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar licor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#94cb47] placeholder-slate-500"
            />
          </div>
        </div>
        <div className="p-4 max-h-72 overflow-y-auto space-y-1.5">
          {filtered.map(licor => (
            <button
              key={licor.id}
              onClick={() => setSelectedLicor(licor)}
              className="w-full flex items-center justify-between bg-slate-700/60 hover:bg-[#94cb47]/10 border border-slate-600 hover:border-[#94cb47]/50 rounded-lg px-4 py-3 transition-all group text-left"
            >
              <span className="font-bold text-white text-sm group-hover:text-[#94cb47] transition">{licor.name}</span>
              <span className="text-[#94cb47]/70 text-xs flex items-center gap-1">
                desde ₡{Math.min(...licor.presentaciones.map(p => p.price)).toLocaleString()}
                <ChevronDown size={14} className="-rotate-90" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedLicor && (
        <LicorModal
          licor={selectedLicor}
          onSelect={handleSelect}
          onClose={() => setSelectedLicor(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// OTROS EDIT MODAL — editar nombre y precio
// ─────────────────────────────────────────────
function OtroEditModal({ item, onConfirm, onClose }) {
  const [nombre, setNombre] = useState(item.name);
  const [precio, setPrecio] = useState(String(item.price));

  const handleConfirm = () => {
    const p = parseInt(precio.replace(/\D/g, ''), 10);
    if (!nombre.trim()) { alert('Ingresa un nombre'); return; }
    if (!p || p <= 0)   { alert('Ingresa un precio válido'); return; }
    onConfirm({ ...item, name: nombre.trim(), price: p });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-500/50 p-6 shadow-2xl w-full max-w-xs">
        <div className="text-center mb-5">
          <div className="text-3xl mb-1">📦</div>
          <h2 className="text-lg font-bold text-white">Confirmar item</h2>
          <p className="text-slate-400 text-xs mt-1">Edita nombre y precio si es necesario</p>
        </div>
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wide block mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full bg-slate-700 border border-slate-500 focus:border-[#94cb47] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              placeholder="Ej: Cigarro Marlboro..."
            />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-bold uppercase tracking-wide block mb-1">Precio (₡)</label>
            <input
              type="number"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              className="w-full bg-slate-700 border border-slate-500 focus:border-[#94cb47] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              placeholder="500"
              min="0"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-3 rounded-xl transition"
          >
            ✓ Agregar
          </button>
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold px-4 py-3 rounded-xl transition"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// OTROS PANEL — menudeo con precios editables
// ─────────────────────────────────────────────
export function OtrosPanel({ onAddToCart }) {
  const [editingItem, setEditingItem] = useState(null);

  const handleConfirm = (item) => {
    onAddToCart({ ...item, id: `${item.id}_${Date.now()}`, quantity: 1 }, false);
    setEditingItem(null);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-500/30 overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-5">
          <h2 className="text-white font-bold text-xl flex items-center gap-2"><Package size={20} /> Otros</h2>
          <p className="text-slate-400 text-xs mt-1">Toca para editar nombre y precio antes de agregar</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {OTROS.map(item => (
            <button
              key={item.id}
              onClick={() => setEditingItem(item)}
              className="flex flex-col items-start bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600 hover:border-slate-400 rounded-xl px-3 py-2.5 transition-all text-left group"
            >
              <span className="font-bold text-white text-sm leading-tight group-hover:text-[#94cb47] transition">{item.name}</span>
              <span className="text-[#94cb47] font-bold text-xs mt-1">₡{item.price.toLocaleString()}</span>
              <span className="text-slate-500 text-xs mt-0.5">✏️ editable</span>
            </button>
          ))}
        </div>
      </div>

      {editingItem && (
        <OtroEditModal
          item={editingItem}
          onConfirm={handleConfirm}
          onClose={() => setEditingItem(null)}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// MENÚ DROPDOWN (sin licores — van aparte)
// ─────────────────────────────────────────────
export function MenuDropdown({ menu, onSelectItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const allItems = useMemo(() => Object.values(menu).flat(), [menu]);
  const filteredItems = useMemo(() =>
    allItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allItems, searchTerm]
  );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <h2 className="text-white font-bold text-2xl mb-4 flex items-center gap-2"><Utensils size={24} /> Menú</h2>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar plato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#94cb47] placeholder-slate-500"
          />
        </div>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto space-y-2">
        {searchTerm ? (
          <div className="space-y-2">
            {filteredItems.length === 0
              ? <div className="text-slate-400 text-center py-8">No hay resultados</div>
              : filteredItems.map(item => <ItemButton key={item.id} item={item} onSelectItem={onSelectItem} />)
            }
          </div>
        ) : (
          Object.entries(menu).map(([category, items]) => (
            <div key={category}>
              <button
                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                className="w-full text-left bg-gradient-to-r from-[#94cb47]/40 to-[#7ab035]/40 hover:from-[#94cb47]/60 hover:to-[#7ab035]/60 border border-[#94cb47]/40 rounded-lg p-3 transition-all flex justify-between items-center"
              >
                <span className="font-bold text-[#94cb47]">{category}</span>
                <ChevronDown size={18} className={`text-[#94cb47] transition-transform ${expandedCategory === category ? 'rotate-180' : ''}`} />
              </button>
              {expandedCategory === category && (
                <div className="mt-2 ml-2 space-y-2 border-l border-[#94cb47]/30 pl-2">
                  {items.map(item => <ItemButton key={item.id} item={item} onSelectItem={onSelectItem} />)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PEDIDOS LISTOS
// ─────────────────────────────────────────────
export function ReadyOrdersPanel({ kitchenOrders, mesera }) {
  const readyOrders = kitchenOrders.filter(o => o.status === 'ready' && o.mesera === mesera);
  if (readyOrders.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-[#94cb47]/40 to-[#7ab035]/40 rounded-2xl border-2 border-[#94cb47] overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-[#94cb47]/30 to-[#7ab035]/30 p-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Clock size={20} /> ¡PEDIDOS LISTOS! ({readyOrders.length})</h3>
      </div>
      <div className="p-4 space-y-2">
        {readyOrders.map(order => (
          <div key={order.id} className="bg-slate-800/70 rounded-lg p-3 border border-[#94cb47]/50">
            <div className="font-bold text-[#94cb47] mb-1">{order.locationLabel || (order.barra ? order.barra : (order.table ? `Mesa ${order.table}` : "Sin mesa"))}</div>
            {order.clientName && <div className="text-sm text-[#94cb47]/80 mb-1">👤 {order.clientName}</div>}
            <div className="text-xs text-slate-400">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ITEMS MODAL (ver cuenta)
// ─────────────────────────────────────────────
export function ItemsModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#94cb47] mb-1">{order.clientName || 'Sin nombre'}</h2>
        <p className="text-slate-400 text-sm mb-4">{order.locationLabel || order.barra || (order.table ? `Mesa ${order.table}` : '-')}</p>
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 space-y-1">
          {order.items.map((item, i) => (
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
          <div className="text-3xl font-bold text-[#94cb47]">₡{order.total.toLocaleString()}</div>
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
  // splitQty: { itemId -> cantidad que va a la cuenta nueva }
  const [splitQty, setSplitQty] = useState({});

  if (!account) return null;

  const setQty = (itemId, max, val) => {
    const n = Math.max(0, Math.min(max, Number(val)));
    setSplitQty(prev => ({ ...prev, [itemId]: n }));
  };

  const totalSplit = account.items.reduce((s, i) => {
    const q = splitQty[i.id] || 0;
    return s + i.price * q;
  }, 0);

  const hasSplit = Object.values(splitQty).some(q => q > 0);

  const handleConfirm = () => {
    // items que van a la nueva cuenta
    const newItems = account.items
      .map(i => ({ ...i, quantity: splitQty[i.id] || 0 }))
      .filter(i => i.quantity > 0);
    // items que quedan en la original
    const remaining = account.items
      .map(i => ({ ...i, quantity: i.quantity - (splitQty[i.id] || 0) }))
      .filter(i => i.quantity > 0);
    if (newItems.length === 0) { alert('Selecciona al menos un item para separar'); return; }
    if (remaining.length === 0) { alert('No puedes mover todos los items — mejor cobra la cuenta completa'); return; }
    onConfirm(account, newItems, remaining);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/40 p-5 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-[#94cb47] flex items-center gap-2">✂️ Separar Cuenta</h2>
          <p className="text-slate-400 text-xs mt-1">
            {account.clientName || 'Sin nombre'} · {account.locationLabel || account.barra || (account.table != null ? `Mesa ${account.table}` : 'Barra')}
          </p>
          <p className="text-slate-500 text-xs mt-1">Indica cuántos de cada item van a la cuenta nueva</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {account.items.map(item => {
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
            onClick={handleConfirm}
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
export function BillModal({ order, onClose, onPay }) {
  const [payMethod, setPayMethod] = useState(null);
  if (!order) return null;
  const methods = [
    { id: 'efectivo', label: '💵 Efectivo', color: 'border-green-500 bg-green-900/30 text-green-300' },
    { id: 'sinpe',    label: '📱 Sinpe',    color: 'border-blue-500 bg-blue-900/30 text-blue-300' },
    { id: 'tarjeta',  label: '💳 Tarjeta',  color: 'border-purple-500 bg-purple-900/30 text-purple-300' },
  ];
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-[#94cb47] mb-1">CUENTA</h2>
          <p className="text-slate-400 text-sm">Restaurante LORE</p>
        </div>
        <div className="border-b border-[#94cb47]/30 mb-4 pb-3 space-y-1">
          <div className="text-white text-sm"><span className="text-slate-400">Cliente: </span><span className="font-bold">{order.clientName || 'Sin nombre'}</span></div>
          <div className="text-white text-sm"><span className="text-slate-400">Mesa: </span><span className="font-bold">{order.locationLabel || order.barra || (order.table ? `Mesa ${order.table}` : '-')}</span></div>
          {order.mesera && <div className="text-white text-sm"><span className="text-slate-400">Mesera: </span><span className="font-bold">{order.mesera}</span></div>}
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 space-y-1 max-h-48 overflow-y-auto">
          {order.items.map((item, i) => (
            <div key={i} className="py-1.5 border-b border-slate-700/50 last:border-0">
              <div className="flex justify-between text-white text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="text-[#94cb47] font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
              </div>
              {item.notes && <div className="text-xs text-yellow-300 mt-0.5">📝 {item.notes}</div>}
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-[#94cb47]/30 to-[#7ab035]/30 rounded-xl p-4 border border-[#94cb47]/50 mb-4">
          <div className="text-slate-300 text-sm">TOTAL A PAGAR</div>
          <div className="text-4xl font-bold text-[#94cb47]">₡{order.total.toLocaleString()}</div>
        </div>
        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-wide">Método de pago</p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map(m => (
              <button key={m.id} onClick={() => setPayMethod(m.id)}
                className={`border-2 rounded-xl py-3 font-bold text-sm transition ${payMethod === m.id ? m.color : 'border-slate-600 text-slate-400 hover:border-slate-500'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {onPay && (
            <button
              onClick={() => payMethod ? onPay(order, payMethod) : alert('Selecciona el método de pago')}
              className={`flex-1 font-bold py-3 rounded-lg transition ${payMethod ? 'bg-[#94cb47] hover:bg-[#7ab035] text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
              ✅ Cobrar
            </button>
          )}
          <button onClick={() => window.print()} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-3 rounded-lg transition">🖨️</button>
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
  const [error, setError] = useState(false);

  const handleDigit = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PINES[userName]?.pin) {
          onSuccess();
        } else {
          setError(true);
          setPin('');
        }
      }, 200);
    }
  };

  const handleDelete = () => { setPin(p => p.slice(0, -1)); setError(false); };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-8 w-full max-w-xs shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔐</div>
          <h2 className="text-white font-bold text-xl">{userName}</h2>
          <p className="text-slate-400 text-sm mt-1">Ingresa tu PIN de 4 dígitos</p>
        </div>
        <div className="flex justify-center gap-4 mb-6">
          {[0,1,2,3].map(i => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${
              i < pin.length
                ? error ? 'bg-red-500 border-red-500' : 'bg-[#94cb47] border-[#94cb47]'
                : 'border-slate-500'
            }`} />
          ))}
        </div>
        {error && <p className="text-red-400 text-center text-sm mb-4">PIN incorrecto, intenta de nuevo</p>}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1,2,3,4,5,6,7,8,9].map(d => (
            <button key={d} onClick={() => handleDigit(String(d))}
              className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47] text-white font-bold text-xl py-4 rounded-xl transition">
              {d}
            </button>
          ))}
          <button onClick={handleDelete}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-lg py-4 rounded-xl transition">
            ⌫
          </button>
          <button onClick={() => handleDigit('0')}
            className="bg-slate-700 hover:bg-slate-600 active:bg-[#94cb47] text-white font-bold text-xl py-4 rounded-xl transition">
            0
          </button>
          <button onClick={onCancel}
            className="bg-red-900/50 hover:bg-red-900 text-red-300 font-bold text-sm py-4 rounded-xl transition">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
