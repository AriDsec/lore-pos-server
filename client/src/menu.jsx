import { useState, useMemo } from "react";
import { Plus, Minus, ChevronDown, Search, Clock } from 'lucide-react';
import { LICORES, OTROS, ADICIONALES_COCINA } from './constants.js';

// ─────────────────────────────────────────────
// MENU COMPONENTS — ItemButton, LicorModal, LicoresPanel, OtrosPanel, MenuDropdown, MenuPanel, ReadyOrdersPanel
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
          <span className="flex-1 text-slate-400 text-xs">↳ con Papas</span>
          <span className="text-[#94cb47] font-bold text-xs whitespace-nowrap">₡{(item.price + 500).toLocaleString()}</span>
          <button
            onClick={() => onSelectItem(item, true)}
            className="bg-[#94cb47] hover:bg-[#7ab035] text-black rounded-md w-6 h-6 flex items-center justify-center flex-shrink-0 transition"
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
              <ChevronDown size={14} className="text-slate-500 -rotate-90" />
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
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/20 overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-[#94cb47]/10 to-slate-800 px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🍳</span>
            <div>
              <h2 className="text-[#94cb47] font-bold text-sm">Adicionales Cocina</h2>
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

export function MenuPanel({ menu, licores, onSelectItem, onModalChange, expandedCat, setExpandedCat, expandedLicorCat, setExpandedLicorCat }) {
  const [seccion, setSeccion] = useState('comida');
  const [busqueda, setBusqueda] = useState('');
  const [selectedLicor, setSelectedLicor] = useState(null);

  // Separar menú en comida y bebidas
  const allItems = Object.entries(menu).flatMap(([cat, items]) =>
    items.map(i => ({ ...i, cat }))
  );
  const comidaItems = allItems.filter(i => i.category === 'food');
  const bebidaItems = allItems.filter(i => ['beverage', 'soda', 'batido'].includes(i.category));

  // Agrupar por categoría para mostrar
  const comidaGroups = Object.fromEntries(
    Object.entries(menu).filter(([, items]) => items.some(i => i.category === 'food'))
  );
  const bebidaGroups = Object.fromEntries(
    Object.entries(menu).filter(([, items]) => items.some(i => ['beverage', 'soda', 'batido'].includes(i.category)))
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
      className="w-full flex justify-between items-center bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-[#94cb47]/40 rounded-xl px-3 py-2.5 md:py-5 transition-all text-left group"
    >
      <span className="font-semibold text-white text-sm md:text-xl group-hover:text-[#94cb47] transition leading-tight">{item.name}</span>
      <span className="text-[#94cb47] font-bold text-xs md:text-lg ml-2 whitespace-nowrap">₡{item.price.toLocaleString()}</span>
    </button>
  );

  const CategoryGroup = ({ groups, category }) => (
    <div className="space-y-2">
      {Object.entries(groups).map(([cat, items]) => {
        const filtered = items.filter(i =>
          category === 'food' ? i.category === 'food' : ['beverage', 'soda', 'batido'].includes(i.category)
        );
        if (filtered.length === 0) return null;
        const isOpen = expandedCat === cat;
        return (
          <div key={cat} className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50">
            <button
              onClick={() => setExpandedCat(isOpen ? null : cat)}
              className="w-full flex justify-between items-center px-4 py-3 md:py-6 text-left"
            >
              <span className="font-bold text-[#94cb47] text-sm md:text-xl">{cat}</span>
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
          className="w-full bg-slate-800 border border-slate-600 focus:border-[#94cb47] text-white rounded-xl px-4 py-3 md:py-5 text-sm md:text-xl focus:outline-none placeholder-slate-500"
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
                    className="w-full flex justify-between items-center bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-[#94cb47]/40 rounded-xl px-3 py-2.5 md:py-5 transition-all text-left group"
                  >
                    <span className="font-semibold text-white text-sm group-hover:text-[#94cb47] transition">{item.name}</span>

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
          {seccion === 'licores' && (() => {
            const cats = [...new Set(licores.map(l => l.categoria).filter(Boolean))];
            return (
              <div className="space-y-2">
                {cats.map(cat => {
                  const isOpen = expandedLicorCat === cat;
                  return (
                    <div key={cat} className="bg-slate-800/60 rounded-xl overflow-hidden border border-slate-700/50">
                      <button
                        onClick={() => setExpandedLicorCat(isOpen ? null : cat)}
                        className="w-full flex justify-between items-center px-4 py-3 md:py-6 text-left"
                      >
                        <span className="font-bold text-[#94cb47] text-sm md:text-xl">{cat}</span>
                        <span className={`text-slate-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 space-y-1.5">
                          {licores.filter(l => l.categoria === cat).map(licor => (
                            <button
                              key={licor.id}
                              onClick={() => { setSelectedLicor(licor); onModalChange?.(true); }}
                              className="w-full flex justify-between items-center bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 hover:border-[#94cb47]/40 rounded-xl px-3 py-2.5 md:py-5 transition-all text-left group"
                            >
                              <span className="font-semibold text-white text-sm group-hover:text-[#94cb47] transition">{licor.name}</span>
                              <ChevronDown size={13} className="text-slate-500 -rotate-90 flex-shrink-0 ml-2" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </>
      )}

      {selectedLicor && (
        <LicorModal
          licor={selectedLicor}
          onSelect={(licor, presentacion) => {
            onSelectItem({
              id: `${licor.id}_${presentacion.id}_${Date.now()}`,
              name: `${licor.name} — ${presentacion.label}`,
              price: presentacion.price,
              category: 'alcoholic',
              quantity: 1,
            });
            setSelectedLicor(null); onModalChange?.(false);
          }}
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
            <div className="font-bold text-[#94cb47] mb-1">{order.locationLabel || (order.barra ? order.barra : ((order.table && order.table > 0) ? `Mesa ${order.table}` : 'Sin mesa'))}</div>
            {order.clientName && <div className="text-sm text-[#94cb47]/80 mb-1">👤 {order.clientName}</div>}
            <div className="text-xs text-slate-400">{(order.items||[]).map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ITEMS MODAL (ver cuenta)
// ─────────────────────────────────────────────