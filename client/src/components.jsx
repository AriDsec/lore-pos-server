import { useState, useMemo } from "react";
import { Plus, Minus, Trash2, LogOut, Utensils, ChevronDown, Search, Clock, Package } from 'lucide-react';
import { PINES, LICORES, OTROS, ADICIONALES_COCINA } from './constants.js';

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
            <div className="text-orange-300 text-xs">Reintentando automáticamente...</div>
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
export function Header({ mesera, zona, onLogout }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-[#94cb47]/20 p-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="LORE" className="w-9 h-9 object-contain drop-shadow" />
          <div>
            <div className="text-[#94cb47] font-bold text-base leading-tight">{zona}</div>
            <div className="text-[#94cb47]/60 text-xs">{mesera}</div>
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
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/40 p-6 shadow-2xl w-full max-w-lg">
        <div className="text-center mb-5">
          <div className="text-3xl mb-1">🥃</div>
          <h2 className="text-xl font-bold text-[#94cb47]">{licor.name}</h2>
          <p className="text-slate-400 text-xs mt-1">Selecciona la presentación</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {licor.presentaciones.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(licor, p)}
              className="flex items-center justify-between bg-slate-700 hover:bg-[#94cb47]/10 border border-slate-600 hover:border-[#94cb47]/60 rounded-xl px-4 py-3 transition-all group"
            >
              <span className="font-bold text-white group-hover:text-[#94cb47] transition text-sm">{p.label}</span>
              <span className="text-[#94cb47] font-bold text-sm ml-2">₡{p.price.toLocaleString()}</span>
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
export function LicoresPanel({ onAddToCart, onModalChange }) {
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
    setSelectedLicor(null); onModalChange?.(false);
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
              onClick={() => { setSelectedLicor(licor); onModalChange?.(true); }}
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
          onClose={() => { setSelectedLicor(null); onModalChange?.(false); }}
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
  const [inputError, setInputError] = useState('');

  const handleConfirm = () => {
    const p = parseInt(precio.replace(/\D/g, ''), 10);
    if (!nombre.trim()) { setInputError('Ingresa un nombre'); return; }
    if (!p || p <= 0)   { setInputError('Ingresa un precio válido'); return; }
    setInputError('');
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
        {inputError && <div className="bg-red-900/40 border border-red-500/50 text-red-300 text-xs rounded-lg px-3 py-2 mb-3">⚠️ {inputError}</div>}
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
export function OtrosPanel({ onAddToCart, onModalChange }) {
  const [editingItem, setEditingItem] = useState(null);

  const otrosHandleConfirm = (item) => {
    onAddToCart({ ...item, id: `${item.id}_${Date.now()}`, quantity: 1 }, false);
    setEditingItem(null); onModalChange?.(false);
  };

  const ItemBtn = ({ item }) => (
    <button
      key={item.id}
      onClick={() => { setEditingItem(item); onModalChange?.(true); }}
      className="flex flex-col items-start bg-slate-700/60 hover:bg-slate-600/60 border border-slate-600 hover:border-slate-400 rounded-xl px-3 py-2.5 transition-all text-left group"
    >
      <span className="font-bold text-white text-sm leading-tight group-hover:text-[#94cb47] transition">{item.name}</span>
      <span className="text-[#94cb47] font-bold text-xs mt-1">{item.price > 0 ? `₡${item.price.toLocaleString()}` : 'precio libre'}</span>
    </button>
  );

  return (
    <>
      <div className="space-y-3">
        {/* Adicionales de cocina */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-orange-500/30 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-orange-900/40 to-slate-800 px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🍳</span>
            <div>
              <h2 className="text-orange-300 font-bold text-sm">Adicionales Cocina</h2>
              <p className="text-slate-500 text-xs">Van directo a pantalla de cocina</p>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {ADICIONALES_COCINA.map(item => <ItemBtn key={item.id} item={item} />)}
          </div>
        </div>

        {/* Menudeo / Bar */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-500/30 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <div>
              <h2 className="text-white font-bold text-sm">Menudeo / Bar</h2>
              <p className="text-slate-500 text-xs">No van a cocina</p>
            </div>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {OTROS.map(item => <ItemBtn key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      {editingItem && (
        <OtroEditModal
          item={editingItem}
          onConfirm={otrosHandleConfirm}
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
// ─────────────────────────────────────────────
// MENU PANEL UNIFICADO — Comida / Bebidas / Licores + Buscador Global
// ─────────────────────────────────────────────
export function MenuPanel({ menu, licores, onSelectItem, onModalChange }) {
  const [seccion, setSeccion] = useState('comida');
  const [busqueda, setBusqueda] = useState('');
  const [expandedCat, setExpandedCat] = useState(null);
  const [selectedLicor, setSelectedLicor] = useState(null);

  // Separar menú en comida y bebidas
  const allItems = Object.entries(menu).flatMap(([cat, items]) =>
    items.map(i => ({ ...i, cat }))
  );
  const comidaItems = allItems.filter(i => i.category === 'food');
  const bebidaItems = allItems.filter(i => ['beverage', 'soda'].includes(i.category));

  // Agrupar por categoría para mostrar
  const comidaGroups = Object.fromEntries(
    Object.entries(menu).filter(([, items]) => items.some(i => i.category === 'food'))
  );
  const bebidaGroups = Object.fromEntries(
    Object.entries(menu).filter(([, items]) => items.some(i => ['beverage', 'soda'].includes(i.category)))
  );

  // Búsqueda global
  const q = busqueda.toLowerCase().trim();
  const searchResults = q.length > 1 ? [
    ...allItems.filter(i => i.name.toLowerCase().includes(q)),
    ...licores.filter(l => l.name.toLowerCase().includes(q)).map(l => ({ ...l, esLicor: true })),
  ] : [];

  const tabs = [
    { id: 'comida',  label: 'Comida' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'licores', label: 'Licores' },
  ];

  const ItemBtn = ({ item }) => (
    <button
      onClick={() => onSelectItem(item)}
      className="w-full flex justify-between items-center bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-[#94cb47]/40 rounded-xl px-3 py-2.5 transition-all text-left group"
    >
      <span className="font-semibold text-white text-sm group-hover:text-[#94cb47] transition leading-tight">{item.name}</span>
      <span className="text-[#94cb47] font-bold text-xs ml-2 whitespace-nowrap">₡{item.price.toLocaleString()}</span>
    </button>
  );

  const CategoryGroup = ({ groups, category }) => (
    <div className="space-y-2">
      {Object.entries(groups).map(([cat, items]) => {
        const filtered = items.filter(i =>
          category === 'food' ? i.category === 'food' : ['beverage', 'soda'].includes(i.category)
        );
        if (filtered.length === 0) return null;
        const isOpen = expandedCat === cat;
        return (
          <div key={cat} className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50">
            <button
              onClick={() => setExpandedCat(isOpen ? null : cat)}
              className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
              <span className="font-bold text-[#94cb47] text-sm">{cat}</span>
              <span className={`text-slate-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {isOpen && (
              <div className="px-3 pb-3 space-y-1.5">
                {filtered.map(item => <ItemBtn key={item.id} item={item} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Buscador global */}
      <div className="relative">
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar en comida, bebidas y licores..."
          className="w-full bg-slate-800 border border-slate-600 focus:border-[#94cb47] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none placeholder-slate-500"
        />
        {busqueda && (
          <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-lg">×</button>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {q.length > 1 ? (
        <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-3">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{busqueda}"
          </div>
          {searchResults.length === 0 ? (
            <p className="text-slate-500 text-sm">Sin resultados</p>
          ) : (
            <div className="space-y-1.5">
              {searchResults.map(item =>
                item.esLicor ? (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedLicor(item); onModalChange?.(true); }}
                    className="w-full flex justify-between items-center bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-amber-500/40 rounded-xl px-3 py-2.5 transition-all text-left group"
                  >
                    <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition">{item.name}</span>
                    <span className="text-amber-400 font-bold text-xs ml-2 whitespace-nowrap">desde ₡{Math.min(...item.presentaciones.map(p => p.price)).toLocaleString()}</span>
                  </button>
                ) : (
                  <ItemBtn key={item.id} item={item} />
                )
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="grid grid-cols-3 gap-1.5">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setSeccion(t.id)}
                className={`py-2 rounded-lg font-bold text-sm transition ${
                  seccion === t.id
                    ? 'bg-[#94cb47] text-black'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contenido por sección */}
          {seccion === 'comida' && <CategoryGroup groups={comidaGroups} category="food" />}
          {seccion === 'bebidas' && <CategoryGroup groups={bebidaGroups} category="beverage" />}
          {seccion === 'licores' && (
            <div className="space-y-2">
              {licores.map(licor => (
                <button
                  key={licor.id}
                  onClick={() => { setSelectedLicor(licor); onModalChange?.(true); }}
                  className="w-full flex justify-between items-center bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-amber-500/30 rounded-xl px-4 py-3 transition-all text-left group"
                >
                  <span className="font-semibold text-white text-sm group-hover:text-amber-300 transition">{licor.name}</span>
                  <span className="text-amber-400 text-xs font-bold whitespace-nowrap">
                    desde ₡{Math.min(...licor.presentaciones.map(p => p.price)).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedLicor && (
        <LicorModal
          licor={selectedLicor}
          onSelect={(item) => { onSelectItem(item); setSelectedLicor(null); onModalChange?.(false); }}
          onClose={() => { setSelectedLicor(null); onModalChange?.(false); }}
        />
      )}
    </div>
  );
}

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
  const [splitError, setSplitError] = useState('');
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

  const metodoPago = order.paymentMethod === 'sinpe'   ? 'SINPE Móvil'
                   : order.paymentMethod === 'tarjeta' ? 'Tarjeta'
                   : 'Efectivo';

  const ubicacion = order.locationLabel || order.barra
    || (order.table != null ? `Mesa ${order.table}` : '');

  const linea = (texto = '', ancho = 40) => texto.padEnd(ancho, ' ');
  const separador = '-'.repeat(40);
  const separadorDoble = '='.repeat(40);

  let itemsText = '';
  (order.items || []).forEach(item => {
    const subtotal = `₡${(item.price * item.quantity).toLocaleString()}`;
    const nombreLocal = item.name.length > 22 ? item.name.substring(0, 22) : item.name;
    const izq = `${item.quantity}x ${nombreLocal}`;
    itemsText += `${izq.padEnd(28)}${subtotal.padStart(12)}
`;
    if (item.notes) itemsText += `   * ${item.notes}
`;
  });

  const totalStr = `₡${order.total.toLocaleString()}`;
  const hayDescuento = order.descuento && order.descuento > 0;
  const totalOriginalStr = hayDescuento ? `₡${order.totalOriginal.toLocaleString()}` : null;
  const descuentoStr = hayDescuento ? `₡${order.descuento.toLocaleString()}` : null;

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
    color: #000;
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
  ${ubicacion ? `<tr><td>Mesa/Barra:</td><td class="derecha">${ubicacion}</td></tr>` : ''}
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

  const ventana = window.open('', '_blank', 'width=300,height=600');
  ventana.document.write(contenido);
  ventana.document.close();
  ventana.focus();
  setTimeout(() => { ventana.print(); }, 400);
}

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
                <div className="text-4xl font-bold text-amber-400">₡{montoFinal.toLocaleString()}</div>
                <div className="text-red-400 text-xs">-₡{descuento.toLocaleString()} descuento</div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle descuento */}
        {onPay && (
          <div className="mb-4">
            <div className={`rounded-xl border transition overflow-hidden ${aplicandoDescuento ? 'border-amber-500/60' : 'border-slate-600'}`}>
              <button
                onClick={() => { setAplicandoDescuento(!aplicandoDescuento); setMontoPersonalizado(''); }}
                className={`w-full text-sm font-semibold py-2.5 px-4 flex items-center justify-between transition ${aplicandoDescuento ? 'bg-amber-900/30 text-amber-300' : 'bg-slate-700/40 text-slate-400 hover:text-slate-300 hover:bg-slate-700/60'}`}>
                <span>Aplicar descuento</span>
                <span className={`text-xs transition-transform ${aplicandoDescuento ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {aplicandoDescuento && (
                <div className="px-4 pb-4 pt-3 bg-amber-900/10">
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
                    className={`w-full bg-slate-800 text-white text-2xl font-bold rounded-xl p-3 text-center focus:outline-none placeholder-slate-600 border ${montoPersonalizado && montoFinal >= totalOriginal ? 'border-red-500/70' : 'border-amber-500/40 focus:border-amber-400'}`}
                    autoFocus
                  />
                  {montoPersonalizado && montoFinal >= totalOriginal && (
                    <p className="text-center text-red-400 text-xs mt-2 font-bold">
                      ⚠️ El monto debe ser menor al total original (₡{totalOriginal.toLocaleString()})
                    </p>
                  )}
                  {hayDescuento && montoFinal < totalOriginal && (
                    <p className="text-center text-amber-400/70 text-xs mt-2">
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
          <div className="mb-4 rounded-xl border border-amber-500/40 overflow-hidden">
            <div className="bg-amber-900/20 px-4 py-2.5">
              <p className="text-amber-300 text-xs font-bold uppercase tracking-wide">
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
                          ? 'bg-amber-700 border-amber-500 text-white'
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
                className="w-full bg-slate-800 border border-amber-500/30 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-sm focus:outline-none placeholder-slate-500"
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
                        <span className="text-purple-300 font-bold">₡{tarjetaMixto.toLocaleString()}</span>
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
  const [attempting, setAttempting] = useState(false);

  const loginHandleDigit = async (d) => {
    if (loginPin.length >= 4 || attempting) return;
    const loginNext = loginPin + d;
    setPin(loginNext);
    setLoginError(false);
    if (loginNext.length === 4) {
      setAttempting(true);
      setTimeout(async () => {
        const loginOk = await onLogin(loginNext);
        if (!loginOk) {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col items-center justify-center p-4 overflow-y-auto">
      {isLandscape ? (
        <div className="flex items-center gap-5 mb-5 w-full max-w-3xl">
          <img src="/logo.png" alt="LORE" className="w-24 h-24 object-contain drop-shadow-2xl flex-shrink-0" />
          <div style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.14em' }}
            className="text-white/75 text-2xl font-normal drop-shadow-lg flex-1">
            Sistema de Pedidos
          </div>
          <button onClick={onBack} className="flex items-center gap-1.5 bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg transition border border-slate-600 flex-shrink-0">← PIN</button>
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
        <div className="bg-red-900/60 border border-red-500 rounded-xl p-3 mb-3 text-red-200 text-sm text-center w-full max-w-2xl">
          ⚠️ {syncError}
        </div>
      )}
      <div className={`w-full ${isLandscape ? 'grid grid-cols-3 gap-3 max-w-3xl' : 'grid grid-cols-2 gap-3 max-w-md'}`}>
        <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl">
          <h2 className="text-[#94cb47] font-bold text-sm mb-2">🍺 ZONA BAR</h2>
          <button onClick={() => onSelect('Caja Bar')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">💰 Caja Bar</button>
          <div className="space-y-2">
            {meseras.filter(m => m !== 'Guido Bar').map(m => (
              <button key={m} onClick={() => onSelect(m)} className="w-full bg-slate-700/60 hover:bg-slate-600 text-[#94cb47] py-2 rounded-lg transition font-medium text-sm">{m}</button>
            ))}
            <button onClick={() => onSelect('Guido Bar')} className="w-full bg-slate-700/60 hover:bg-slate-600 text-amber-400 py-2 rounded-lg transition font-medium text-sm border border-amber-500/30">👑 Guido</button>
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl">
          <h2 className="text-[#94cb47] font-bold text-sm mb-2">🍽️ ZONA RESTAURANTE</h2>
          <button onClick={() => onSelect('Caja Restaurante')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">💰 Caja</button>
          <button onClick={() => onSelect('Tablet Restaurante')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">📱 Tomar Pedidos</button>
          <button onClick={() => onSelect('Cocina')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg">👨‍🍳 Cocina</button>
        </div>
        <div className={`bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl flex flex-col justify-between gap-3 ${!isLandscape ? "col-span-2" : ""}`}>
          <button onClick={() => onSelect('__admin__')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg">📊 Panel Admin</button>
          {!isLandscape && <button onClick={onBack} className="w-full flex items-center justify-center gap-2 bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white font-medium py-2.5 rounded-xl transition border border-slate-600 text-sm">← Volver al PIN</button>}
        </div>
      </div>
      {loading && <Spinner />}
    </div>
  );
}
