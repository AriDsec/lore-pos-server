import { useState, useEffect } from "react";
import { Utensils } from 'lucide-react';
import { Header } from './ui.jsx';
import { MenuPanel, OtrosPanel } from './menu.jsx';
import { SplitModal } from './modals.jsx';
import { ShoppingCart } from './Cart.jsx';

function MenuCenter({ menuTab, setMenuTab, menu, licores, addToCart, onModalChange, isBar, modoRestaurante, onToggleModoRestaurante, expandedCat, setExpandedCat, expandedLicorCat, setExpandedLicorCat }) {
  return (

    <div className="space-y-3">
      <div className="flex gap-1.5">
        {[
          { id: 'productos', label: 'Productos' },
          { id: 'otros',     label: 'Otros' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setMenuTab(t.id)}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
              menuTab === t.id
                ? 'bg-[#94cb47] text-black'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {menuTab === 'productos' && <MenuPanel menu={menu} licores={licores} onSelectItem={addToCart} onModalChange={onModalChange} expandedCat={expandedCat} setExpandedCat={setExpandedCat} expandedLicorCat={expandedLicorCat} setExpandedLicorCat={setExpandedLicorCat} />}
      {menuTab === 'otros'     && <OtrosPanel onAddToCart={addToCart} onModalChange={onModalChange} />}
      {/* Toggle modo restaurante — solo visible para meseras de bar */}
      {isBar && onToggleModoRestaurante && (
        <button
          onClick={onToggleModoRestaurante}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
            modoRestaurante
              ? 'bg-[#94cb47]/15 border-[#94cb47]/50'
              : 'bg-slate-800/60 border-slate-700'
          }`}
        >
          <span className={`text-sm font-semibold ${modoRestaurante ? 'text-[#94cb47]' : 'text-slate-500'}`}>
            {modoRestaurante ? 'Modo Restaurante activo' : 'Atender mesa de restaurante'}
          </span>
          <div className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${modoRestaurante ? 'bg-[#94cb47]' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${modoRestaurante ? 'left-5' : 'left-0.5'}`} />
          </div>
        </button>
      )}
    </div>
  );
  );
}

export function MeseraScreen({
  currentUser, zona, menu, licores, maxTables, onLogout, addToCart,
  cartItems, updateQuantity, removeFromCart, updateNotes,
  completeOrder, orderType, setOrderType,
  selectedTable, setSelectedTable, selectedBarra, setSelectedBarra,
  clientName, setClientName, barras, kitchenOrders,
  openAccounts, selectedAccount, onSelectAccount,
  onDirectPay, isBar, tables,
  splitOrder, setSplitOrder, onSplit,
  onModalChange, aplicaServicio, loading,
  modoRestaurante, onToggleModoRestaurante,
  mesaConflict, setMesaConflict, onAddToExisting,
}) {
  const [mobileTab, setMobileTab] = useState('menu');
  const [isLandscape, setIsLandscape] = useState(
    () => window.matchMedia('(orientation: landscape)').matches
  );

  useEffect(() => {
    const check = () => setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
    const mq = window.matchMedia('(orientation: landscape)');
    mq.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => {
      mq.removeEventListener('change', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  const cartProps = {
    cartItems, updateQuantity, removeFromCart, updateNotes,
    completeOrder, orderType, setOrderType,
    loading,
    selectedTable, setSelectedTable,
    selectedBarra, setSelectedBarra,
    clientName, setClientName,
    barras, maxTables,
    openAccounts, selectedAccount,
    onSelectAccount,
    isBar,
    modoRestaurante,
    onDirectPay,
    tables,
    onSplit: (acc) => setSplitOrder(acc),
    currentUser,
    aplicaServicio,
  };

  // Panel central con secciones y buscador global
  const [menuTab, setMenuTab] = useState('productos');
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedLicorCat, setExpandedLicorCat] = useState(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col">
      <Header mesera={currentUser} zona={zona} onLogout={onLogout} />

      {/* Indicador servicio sábado */}
      {aplicaServicio && (
        <div className="bg-[#94cb47]/10 border-b border-[#94cb47]/30 px-4 py-1.5 flex items-center gap-2">
          <span className="text-[#94cb47] text-xs font-bold">Servicio 10% activo — aplica en mesas</span>
        </div>
      )}

      {/* Banner pedidos listos — no mostrar en Tablet Restaurante, esa persona es la misma que usa cocina */}
      {currentUser !== 'Tablet Restaurante' && (() => {
        const readyOrders = kitchenOrders.filter(o => o.status === 'ready');
        if (readyOrders.length === 0) return null;
        const mesas = readyOrders.map(o => o.barra || ((o.table && o.table > 0) ? `Mesa ${o.table}` : '')).filter(Boolean).join(' · ');
        return (
          <div className="bg-[#94cb47] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 md:py-4">
              <span className="text-black font-black text-sm md:text-xl animate-pulse">🔔</span>
              <span className="text-black font-black text-sm md:text-xl flex-1">
                {readyOrders.length} pedido{readyOrders.length > 1 ? 's' : ''} listo{readyOrders.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="bg-black/20 px-4 pb-2.5 md:pb-4">
              <span className="text-black/80 font-bold text-xs md:text-base">{mesas}</span>
            </div>
          </div>
        );
      })()}

      {/* ── Landscape: flex — menú flexible / carrito ancho fijo ── */}
      <div className={`${isLandscape ? "flex" : "hidden"} gap-4 p-4 w-full overflow-hidden`} style={{height: "calc(100vh - 64px)"}}>
        <div className="flex-1 overflow-y-auto">
          <MenuCenter menuTab={menuTab} setMenuTab={setMenuTab} menu={menu} licores={licores} addToCart={addToCart} onModalChange={onModalChange} isBar={isBar} modoRestaurante={modoRestaurante} onToggleModoRestaurante={onToggleModoRestaurante} expandedCat={expandedCat} setExpandedCat={setExpandedCat} expandedLicorCat={expandedLicorCat} setExpandedLicorCat={setExpandedLicorCat} />
        </div>
        <div style={{width: "min(520px, 40vw)", flexShrink: 0, height: "100%", display: "flex", flexDirection: "column", gap: "10px"}}>
          <div style={{flex: 1, overflowY: "auto", minHeight: 0}}>
            <ShoppingCart {...cartProps} mobileVisible="landscape" />
          </div>
          {/* Pedidos listos debajo del carrito en landscape */}
          {(() => {
            const ready = kitchenOrders.filter(o => o.status === 'ready');
            if (ready.length === 0) return null;
            return (
              <div className="bg-[#94cb47] rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
                <div className="flex items-center gap-2 px-4 py-2.5 md:py-3">
                  <span className="text-black font-black text-sm md:text-lg animate-pulse">🔔</span>
                  <span className="text-black font-black text-sm md:text-lg flex-1">
                    {ready.length} pedido{ready.length > 1 ? 's' : ''} listo{ready.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="bg-black/20 px-4 pb-3 space-y-1.5">
                  {ready.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-black font-bold text-sm md:text-base">
                        {o.barra || ((o.table && o.table > 0) ? `Mesa ${o.table}` : '')}
                      </span>
                      {o.clientName && (
                        <span className="text-black/70 text-sm md:text-base">— {o.clientName}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Portrait: tabs ── */}
      <div className={`${isLandscape ? "hidden" : "flex"} flex-col flex-1 overflow-hidden`}>
        <div className="flex-1 overflow-y-auto p-3">
          {mobileTab === 'menu' && (
            <div className="space-y-4">
              {/* Mini tabs portrait: Productos / Otros */}
              <div className="flex gap-1.5">
                {[
                  { id: 'productos', label: 'Productos' },
                  { id: 'otros',     label: 'Otros' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMenuTab(t.id)}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${
                      menuTab === t.id
                        ? 'bg-[#94cb47] text-black'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {menuTab === 'productos' && <MenuPanel menu={menu} licores={licores} onSelectItem={addToCart} onModalChange={onModalChange} expandedCat={expandedCat} setExpandedCat={setExpandedCat} expandedLicorCat={expandedLicorCat} setExpandedLicorCat={setExpandedLicorCat} />}
              {menuTab === 'otros'     && <OtrosPanel onAddToCart={addToCart} onModalChange={onModalChange} />}
              {isBar && onToggleModoRestaurante && (
        <button
          onClick={onToggleModoRestaurante}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
            modoRestaurante ? 'bg-[#94cb47]/15 border-[#94cb47]/50' : 'bg-slate-800/60 border-slate-700'
          }`}
        >
          <span className={`text-sm font-semibold ${modoRestaurante ? 'text-[#94cb47]' : 'text-slate-500'}`}>
            {modoRestaurante ? 'Modo Restaurante activo' : 'Atender mesa de restaurante'}
          </span>
          <div className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${modoRestaurante ? 'bg-[#94cb47]' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${modoRestaurante ? 'left-5' : 'left-0.5'}`} />
          </div>
        </button>
      )}
            </div>
          )}
          {mobileTab === 'carrito' && (
            <ShoppingCart {...cartProps} mobileVisible={true} />
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex border-t border-[#94cb47]/30 bg-slate-900">
          <button
            onClick={() => setMobileTab('menu')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition ${mobileTab === 'menu' ? 'text-[#94cb47]' : 'text-slate-500'}`}
          >
            <Utensils size={20} />
            <span className="text-xs font-bold">Menú</span>
          </button>
          <button
            onClick={() => setMobileTab('carrito')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition relative ${mobileTab === 'carrito' ? 'text-[#94cb47]' : 'text-slate-500'}`}
          >
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-1/4 bg-[#94cb47] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
            <span className="text-xs font-bold">Carrito</span>
          </button>
        </div>
      </div>
      {splitOrder && (
        <SplitModal account={splitOrder} onConfirm={onSplit} onClose={() => setSplitOrder(null)} />
      )}

      {/* Modal conflicto de mesa */}
      {mesaConflict && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/40 p-6 shadow-2xl w-full max-w-sm">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">⚠️</div>
              <h2 className="text-[#94cb47] font-bold text-xl">Mesa ocupada</h2>
              <p className="text-slate-400 text-sm mt-2">
                {mesaConflict.existingAcc.barra || `Mesa ${mesaConflict.existingAcc.table}`} ya tiene una cuenta abierta
              </p>
              <div className="bg-slate-700/60 rounded-xl p-3 mt-3 text-left">
                <div className="text-white font-bold text-sm">{mesaConflict.existingAcc.clientName || 'Sin nombre'}</div>
                <div className="text-slate-400 text-xs mt-0.5">👤 {mesaConflict.existingAcc.mesera} · ₡{(mesaConflict.existingAcc.total || 0).toLocaleString()}</div>
              </div>
            </div>
            <p className="text-slate-300 text-sm text-center mb-4">¿Qué deseas hacer?</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onAddToExisting && onAddToExisting(mesaConflict.existingAcc._id || mesaConflict.existingAcc.id);
                  setMesaConflict(null);
                }}
                className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-3 rounded-xl transition"
              >
                ✏️ Agregar a la cuenta existente
              </button>
              <button
                onClick={() => mesaConflict.onConfirm(true)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition border border-slate-500"
              >
                👤 Nueva cuenta (persona diferente)
              </button>
              <button
                onClick={() => setMesaConflict(null)}
                className="w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
