import { useState, useEffect } from "react";
import { Utensils, ClipboardList, Plus, Minus, Trash2 } from 'lucide-react';
import { Header } from './ui.jsx';
import { MenuPanel, OtrosPanel } from './menu.jsx';
import { SplitModal } from './modals.jsx';
import { ShoppingCart } from './Cart.jsx';

// ── Colores por mesera ──
const COLORES_MESERA = {
  'Mari': '#60a5fa', 'Mile': '#c084fc', 'Lin': '#fb923c',
  'Temp Bar': '#f472b6', 'Guido Bar': '#facc15'
};

function MenuCenter({ menuTab, setMenuTab, menu, licores, addToCart, onModalChange, isBar,
  modoRestaurante, onToggleModoRestaurante, modoRestHabilitado, expandedCat, setExpandedCat, expandedLicorCat, setExpandedLicorCat }) {
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
      {isBar && onToggleModoRestaurante && modoRestHabilitado && (
        <button
          onClick={onToggleModoRestaurante}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition ${
            modoRestaurante
              ? 'bg-[#94cb47]/15 border-[#94cb47]/50'
              : 'bg-slate-800/60 border-slate-700'
          }`}
        >
          <span className={`text-sm font-semibold ${modoRestaurante ? 'text-[#94cb47]' : 'text-slate-400'}`}>
            {modoRestaurante ? 'Modo Restaurante activo' : 'Atender mesa de restaurante'}
          </span>
          <div className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${modoRestaurante ? 'bg-[#94cb47]' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${modoRestaurante ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
          </div>
        </button>
      )}
    </div>
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
  modoRestaurante, onToggleModoRestaurante, modoRestHabilitado,
  onPayRejected, onDeleteRejected,
  mesaConflict, setMesaConflict, onAddToExisting,
}) {
  const [mobileTab, setMobileTab] = useState('comanda');
  const [isLandscape, setIsLandscape] = useState(
    () => window.matchMedia('(orientation: landscape)').matches
  );
  const [confirmAccount, setConfirmAccount] = useState(null); // cuenta a confirmar abrir
  const [showMesaModal, setShowMesaModal] = useState(false);
  const [menuTab, setMenuTab] = useState('productos');
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedLicorCat, setExpandedLicorCat] = useState(null);

  useEffect(() => {
    const check = () => setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
    const mq = window.matchMedia('(orientation: landscape)');
    mq.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => { mq.removeEventListener('change', check); window.removeEventListener('resize', check); };
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
    onPayRejected,
    onDeleteRejected,
    tables,
    onSplit: (acc) => setSplitOrder(acc),
    currentUser,
    aplicaServicio,
    onToggleModoRestaurante,
  };

  // Datos de la cuenta seleccionada
  const selectedAcc = selectedAccount
    ? openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount)
    : null;
  const accTotal = selectedAcc ? (selectedAcc.total || 0) : 0;
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const combinedTotal = accTotal + cartTotal;
  const isOthersMesera = selectedAcc && selectedAcc.mesera && currentUser && selectedAcc.mesera !== currentUser;

  // El menú se habilita cuando hay mesa/barra o nombre llenado
  const datosCompletos = (
    orderType === 'takeout'
      ? !!clientName.trim()
      : (selectedTable !== null && selectedTable !== undefined) || !!selectedBarra
  ) && !!orderType;

  // ── Comanda portrait ──

  // Cuentas variables
  const cuentas = openAccounts.filter(a => a.status !== 'pending_payment' && a.status !== 'pending_approval' && a.status !== 'rejected');
      const mesas = cuentas.filter(a => !a.barra).sort((a, b) => (a.table ?? 99) - (b.table ?? 99));
      const barrasL = cuentas.filter(a => !!a.barra).sort((a, b) => (a.barra || '').localeCompare(b.barra || ''));
      const grupos = [...mesas, ...barrasL];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col">
      <Header mesera={currentUser} zona={zona} onLogout={onLogout} />
      {/* Indicador color mesera */}
      {COLORES_MESERA[currentUser] && (
        <div className="px-4 py-1 flex items-center gap-2" style={{borderBottom: `2px solid ${COLORES_MESERA[currentUser]}`}}>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: COLORES_MESERA[currentUser]}}></div>
          <span className="text-xs font-bold" style={{color: COLORES_MESERA[currentUser]}}>{currentUser}</span>
        </div>
      )}

      {/* Banner pedidos listos */}
      {currentUser !== 'Tablet Restaurante' && (() => {
        const readyOrders = kitchenOrders.filter(o => o.status === 'ready');
        if (readyOrders.length === 0) return null;
        const mesas = readyOrders.map(o => o.barra || ((o.table && o.table > 0) ? `Mesa ${o.table}` : 'Mesa 0')).join(', ');
        return (
          <div className="bg-[#94cb47] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5">
              <span className="text-black font-black text-sm animate-pulse">Listo:</span>
              <span className="text-black font-black text-sm flex-1">
                {readyOrders.length} pedido{readyOrders.length > 1 ? 's' : ''} — {mesas}
              </span>
            </div>
          </div>
        );
      })()}

      {/* ── Landscape ── */}
      <div className={`${isLandscape ? "flex" : "hidden"} gap-4 p-4 w-full overflow-hidden flex-1`}>

        {/* Izquierda: formulario + menú */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Indicador 10% */}
          {aplicaServicio && (
            <div className="bg-[#94cb47]/10 border border-[#94cb47]/30 rounded-lg px-3 py-1.5">
              <span className="text-[#94cb47] text-xs font-bold">Servicio 10% activo</span>
            </div>
          )}

          {/* Datos */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Datos de la cuenta</div>
            {!selectedAcc && (
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setOrderType('dine-in')}
                  className={`py-2 rounded-xl font-bold text-sm border transition ${orderType === 'dine-in' ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'}`}>
                  Local
                </button>
                <button onClick={() => setOrderType('takeout')}
                  className={`py-2 rounded-xl font-bold text-sm border transition ${orderType === 'takeout' ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'}`}>
                  Llevar
                </button>
              </div>
            )}
            {(orderType === 'dine-in' || selectedAcc) && (
              <button onClick={() => setShowMesaModal(true)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-sm border transition text-left ${
                  (selectedTable !== null && selectedTable !== undefined) || selectedBarra
                    ? 'bg-[#94cb47]/10 border-[#94cb47] text-[#94cb47]'
                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                }`}>
                {selectedBarra ? selectedBarra : (selectedTable !== null && selectedTable !== undefined) ? `Mesa ${selectedTable}` : 'Seleccionar mesa o barra...'}
              </button>
            )}
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
              placeholder="Nombre / Seña del cliente..."
              className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-sm focus:outline-none placeholder-slate-600" />
          </div>

          {/* Menú */}
          {datosCompletos && (
            <MenuCenter menuTab={menuTab} setMenuTab={setMenuTab} menu={menu} licores={licores}
              addToCart={addToCart} onModalChange={onModalChange} isBar={isBar}
              modoRestaurante={modoRestaurante} onToggleModoRestaurante={onToggleModoRestaurante}
              modoRestHabilitado={modoRestHabilitado}
              expandedCat={expandedCat} setExpandedCat={setExpandedCat}
              expandedLicorCat={expandedLicorCat} setExpandedLicorCat={setExpandedLicorCat} />
          )}
          {!datosCompletos && (
            <div className="text-center py-8 text-slate-600">
              <Utensils size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Completa los datos para agregar productos</p>
            </div>
          )}
        </div>

        {/* Derecha: cuentas + items + total + botones */}
        <div style={{width: "min(400px, 38vw)", flexShrink: 0}} className="flex flex-col gap-3 overflow-y-auto">

          {/* Cuentas abiertas */}
          {(() => {
            const cuentasL = openAccounts.filter(a => a.status !== 'pending_payment' && a.status !== 'pending_approval' && a.status !== 'rejected');
            const mesasL = cuentasL.filter(a => !a.barra).sort((a, b) => (a.table ?? 99) - (b.table ?? 99));
            const barrasLL = cuentasL.filter(a => !!a.barra).sort((a, b) => (a.barra || '').localeCompare(b.barra || ''));
            const gruposL = [...mesasL, ...barrasLL];
            if (gruposL.length === 0) return null;
            return (
              <div className="rounded-xl border border-slate-600/50 overflow-hidden">
                <div className="bg-slate-700/40 px-3 py-1.5">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Cuentas abiertas</span>
                </div>
                <div className="divide-y divide-slate-700/40 max-h-40 overflow-y-auto">
                  {gruposL.map(acc => {
                    const ubicacion = acc.barra ? acc.barra : (acc.table !== null && acc.table !== undefined) ? `Mesa ${acc.table}` : 'Sin mesa';
                    const color = COLORES_MESERA[acc.mesera] || '#64748b';
                    const isSelected = selectedAccount === acc.id || selectedAccount === acc._id;
                    return (
                      <button key={acc.id || acc._id}
                        onClick={() => { onSelectAccount(acc.id || acc._id); }}
                        className={`w-full text-left px-3 py-2 transition ${isSelected ? 'bg-[#94cb47]/10' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
                        style={{borderLeftWidth: '3px', borderLeftColor: color}}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-xs">{ubicacion}</span>
                          <span className="text-[#94cb47] font-bold text-xs">₡{(acc.total || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-slate-400 text-xs">{acc.clientName || '—'} · {acc.mesera}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Items en cuenta */}
          {selectedAcc && (selectedAcc.items || []).length > 0 && (
            <div className="rounded-xl border border-slate-600/50 overflow-hidden">
              <div className="bg-slate-700/40 px-3 py-1.5 flex justify-between items-center">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">En la cuenta</span>
                <span className="text-[#94cb47] text-xs font-bold">₡{accTotal.toLocaleString()}</span>
              </div>
              <div className="divide-y divide-slate-700/40">
                {(selectedAcc.items || []).map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-2">
                    <span className="text-white text-sm">{item.quantity}x {item.name}</span>
                    <span className="text-slate-400 text-sm">₡{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items nuevos */}
          {cartItems.length > 0 ? (
            <div className="rounded-xl border border-[#94cb47]/30 overflow-hidden">
              <div className="bg-[#94cb47]/10 px-3 py-1.5 flex justify-between items-center">
                <span className="text-[#94cb47] text-xs font-bold uppercase tracking-wide">{selectedAcc ? 'Agregando' : 'Comanda'}</span>
                <span className="text-[#94cb47] text-xs font-bold">₡{cartTotal.toLocaleString()}</span>
              </div>
              <div className="divide-y divide-slate-700/40">
                {cartItems.map(item => (
                  <div key={item.id} className="px-3 py-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-bold flex-1 pr-2">{item.name}</span>
                      <span className="text-[#94cb47] text-sm font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
                      {!isOthersMesera && (
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 ml-2">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    {!isOthersMesera && (
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition">
                          <Minus size={12} className="text-slate-300" />
                        </button>
                        <span className="flex-1 text-center text-white font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition">
                          <Plus size={12} className="text-slate-300" />
                        </button>
                      </div>
                    )}
                    <input type="text" placeholder="Notas..."
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.id, e.target.value.slice(0, 80))} maxLength={80}
                      className="w-full mt-1 bg-slate-900/50 border border-[#94cb47]/20 text-white text-xs rounded p-1 focus:outline-none focus:border-[#94cb47] placeholder-slate-600" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-600">
              <Utensils size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">{selectedAcc ? 'Agrega items nuevos' : 'Carrito vacío'}</p>
            </div>
          )}

          {/* Total y botones */}
          {(cartItems.length > 0 || selectedAcc) && (
            <div className="space-y-2">
              <div className="bg-[#94cb47]/20 rounded-lg px-3 py-2 border border-[#94cb47]/40">
                {selectedAcc && cartItems.length > 0 ? (
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>En cuenta</span><span>₡{accTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Nuevo</span><span>₡{cartTotal.toLocaleString()}</span>
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
              {cartItems.length > 0 && (
                <button onClick={completeOrder} disabled={loading}
                  className={`w-full font-bold py-2.5 rounded-xl transition text-sm ${loading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-[#94cb47] hover:bg-[#7ab035] text-black'}`}>
                  {loading ? 'Guardando...' : selectedAcc ? 'Agregar a cuenta' : 'Guardar Cuenta'}
                </button>
              )}
              {isBar && !modoRestaurante && onDirectPay && !selectedAccount && cartItems.length > 0 && (
                <button onClick={onDirectPay}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm">
                  Cobro Directo
                </button>
              )}
              {selectedAccount && cartItems.length > 1 && onSplit && (
                <button onClick={() => { const acc = openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount); if (acc) setSplitOrder(acc); }}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm">
                  Separar Cuenta
                </button>
              )}
            </div>
          )}

          {/* Pedidos listos en landscape */}
          {(() => {
            const ready = kitchenOrders.filter(o => o.status === 'ready');
            if (ready.length === 0) return null;
            return (
              <div className="bg-[#94cb47] rounded-xl overflow-hidden flex-shrink-0 shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <span className="text-black font-black text-sm animate-pulse">Listo:</span>
                  <span className="text-black font-black text-sm flex-1">{ready.length} pedido{ready.length > 1 ? 's' : ''}</span>
                </div>
                <div className="bg-black/20 px-4 pb-3 space-y-1">
                  {ready.map((o, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-black font-bold text-sm">{o.barra || ((o.table && o.table > 0) ? `Mesa ${o.table}` : '')}</span>
                      {o.clientName && <span className="text-black/70 text-sm">— {o.clientName}</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Portrait ── */}
      <div className={`${isLandscape ? "hidden" : "flex"} flex-col flex-1 overflow-hidden`}>
        <div className="flex-1 overflow-y-auto">
          {mobileTab === 'comanda' && (
          
              <div className="space-y-3 p-3">
          
                {/* Indicador 10% */}
                {aplicaServicio && (
                  <div className="bg-[#94cb47]/10 border border-[#94cb47]/30 rounded-lg px-3 py-1.5">
                    <span className="text-[#94cb47] text-xs font-bold">Servicio 10% activo</span>
                  </div>
                )}
          
                {/* Paso 1 — Datos de la cuenta */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">Datos de la cuenta</div>
          
                  {/* Tipo */}
                  {!selectedAcc && (
                    <div>
                      <label className="text-slate-400 text-xs mb-0.5 block">Tipo</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setOrderType('dine-in')}
                          className={`py-2.5 rounded-xl font-bold text-sm border transition ${orderType === 'dine-in' ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'}`}>
                          Local
                        </button>
                        <button onClick={() => setOrderType('takeout')}
                          className={`py-2.5 rounded-xl font-bold text-sm border transition ${orderType === 'takeout' ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'}`}>
                          Llevar
                        </button>
                      </div>
                    </div>
                  )}
          
                                    {/* Mesa + Barra */}
                  {(orderType === 'dine-in' || selectedAcc) && (
                    <div>
                      <label className="text-slate-400 text-xs mb-0.5 block">Ubicación</label>
                      <button onClick={() => setShowMesaModal(true)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-sm border transition text-left ${
                          (selectedTable !== null && selectedTable !== undefined) || selectedBarra
                            ? 'bg-[#94cb47]/10 border-[#94cb47] text-[#94cb47]'
                            : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}>
                        {selectedBarra ? selectedBarra : (selectedTable !== null && selectedTable !== undefined) ? `Mesa ${selectedTable}` : 'Seleccionar mesa o barra...'}
                      </button>
                    </div>
                  )}
          
                  {/* Nombre */}
                  <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre / Seña del cliente..."
                    className="w-full bg-slate-700 border border-[#94cb47]/30 text-white rounded-lg p-2 text-sm focus:outline-none placeholder-slate-600" />
                </div>
          
                {/* Paso 2 — Menú (solo si datos completos) */}
                {datosCompletos ? (
                  <>
                    <MenuCenter menuTab={menuTab} setMenuTab={setMenuTab} menu={menu} licores={licores}
                      addToCart={addToCart} onModalChange={onModalChange} isBar={isBar}
                      modoRestaurante={modoRestaurante} onToggleModoRestaurante={onToggleModoRestaurante}
                      modoRestHabilitado={modoRestHabilitado}
                      expandedCat={expandedCat} setExpandedCat={setExpandedCat}
                      expandedLicorCat={expandedLicorCat} setExpandedLicorCat={setExpandedLicorCat} />
          
                    {/* Items existentes en cuenta */}
                    {selectedAcc && (selectedAcc.items || []).length > 0 && (
                      <div className="rounded-xl border border-slate-600/50 overflow-hidden">
                        <div className="bg-slate-700/40 px-3 py-1.5 flex justify-between items-center">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">En la cuenta</span>
                          <span className="text-[#94cb47] text-xs font-bold">₡{accTotal.toLocaleString()}</span>
                        </div>
                        <div className="divide-y divide-slate-700/40">
                          {(selectedAcc.items || []).map((item, i) => (
                            <div key={i} className="flex justify-between items-center px-3 py-2">
                              <span className="text-white text-xs">{item.quantity}x {item.name}</span>
                              <span className="text-slate-400 text-xs">₡{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
          
                    {/* Items nuevos en comanda */}
                    {cartItems.length > 0 && (
                      <div className="rounded-xl border border-[#94cb47]/30 overflow-hidden">
                        <div className="bg-[#94cb47]/10 px-3 py-1.5 flex justify-between items-center">
                          <span className="text-[#94cb47] text-xs font-bold uppercase tracking-wide">
                            {selectedAcc ? 'Agregando' : 'Comanda'}
                          </span>
                          <span className="text-[#94cb47] text-xs font-bold">₡{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="divide-y divide-slate-700/40">
                          {cartItems.map(item => (
                            <div key={item.id} className="px-3 py-2">
                              <div className="flex justify-between items-center">
                                <span className="text-white text-sm font-bold flex-1 pr-2">{item.name}</span>
                                <span className="text-[#94cb47] text-sm font-bold">₡{(item.price * item.quantity).toLocaleString()}</span>
                                {!isOthersMesera && (
                                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 ml-2">
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                              {!isOthersMesera && (
                                <div className="flex items-center gap-2 mt-1">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition">
                                    <Minus size={12} className="text-slate-300" />
                                  </button>
                                  <span className="flex-1 text-center text-white font-bold text-sm">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition">
                                    <Plus size={12} className="text-slate-300" />
                                  </button>
                                </div>
                              )}
                              <input type="text" placeholder="Notas..."
                                value={item.notes || ''}
                                onChange={(e) => updateNotes(item.id, e.target.value.slice(0, 80))} maxLength={80}
                                className="w-full mt-1 bg-slate-900/50 border border-[#94cb47]/20 text-white text-xs rounded p-1 focus:outline-none focus:border-[#94cb47] placeholder-slate-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
          
                    {/* Total y botones */}
                    {(cartItems.length > 0 || selectedAcc) && (
                      <div className="space-y-2">
                        <div className="bg-[#94cb47]/20 rounded-lg px-3 py-2 border border-[#94cb47]/40">
                          {selectedAcc && cartItems.length > 0 ? (
                            <div className="space-y-0.5">
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>En cuenta</span><span>₡{accTotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Nuevo</span><span>₡{cartTotal.toLocaleString()}</span>
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
          
                        {cartItems.length > 0 && (
                          <button onClick={completeOrder} disabled={loading}
                            className={`w-full font-bold py-2.5 rounded-xl transition text-sm ${loading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-[#94cb47] hover:bg-[#7ab035] text-black'}`}>
                            {loading ? 'Guardando...' : selectedAcc ? 'Agregar a cuenta' : 'Guardar Cuenta'}
                          </button>
                        )}
          
                        {isBar && !modoRestaurante && onDirectPay && !selectedAccount && cartItems.length > 0 && (
                          <button onClick={onDirectPay}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition text-sm">
                            Cobro Directo
                          </button>
                        )}
          
                        {selectedAccount && cartItems.length > 1 && onSplit && (
                          <button onClick={() => { const acc = openAccounts.find(a => a.id === selectedAccount || a._id === selectedAccount); if (acc) setSplitOrder(acc); }}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm">
                            Separar Cuenta
                          </button>
                        )}
                      </div>
                    )}
          
                    {/* Pendientes aprobación */}
                    {openAccounts.filter(a => a.status === 'pending_approval' && a.mesera === currentUser).map(acc => (
                      <div key={acc.id || acc._id} className="text-xs text-amber-400 bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-1.5">
                        Esperando aprobación: {acc.clientName || acc.locationLabel}
                      </div>
                    ))}
          
                    {/* Rechazadas */}
                    {openAccounts.filter(a => a.status === 'rejected' && a.mesera === currentUser).map(acc => (
                      <div key={acc.id || acc._id} className="text-xs text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                        <div className="mb-1">Rechazada: {acc.clientName || acc.locationLabel}</div>
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
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    <Utensils size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Completa los datos para agregar productos</p>
                  </div>
                )}
              </div>
          )}
          {mobileTab === 'cuentas' && (
          <div className="p-3 space-y-2">
                  {grupos.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                      <ClipboardList size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No hay cuentas abiertas</p>
                    </div>
                  ) : grupos.map(acc => {
                    const ubicacion = acc.barra ? acc.barra : (acc.table !== null && acc.table !== undefined) ? `Mesa ${acc.table}` : 'Sin mesa';
                    const color = COLORES_MESERA[acc.mesera] || '#64748b';
                    const isSelected = selectedAccount === acc.id || selectedAccount === acc._id;
                    return (
                      <button key={acc.id || acc._id}
                        onClick={() => setConfirmAccount(acc)}
                        className={`w-full text-left px-3 py-3 rounded-xl border border-slate-600/50 transition ${isSelected ? 'bg-[#94cb47]/10' : 'bg-slate-800/60 hover:bg-slate-700/60'}`}
                        style={{borderLeftWidth: '4px', borderLeftColor: color}}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm">{ubicacion}</span>
                          <span className="text-[#94cb47] font-bold text-sm">₡{(acc.total || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">{acc.clientName || '—'} · {acc.mesera}</div>
                      </button>
                    );
                  })}
                </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="flex border-t border-[#94cb47]/30 bg-slate-900">
          <button
            onClick={() => setMobileTab('comanda')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition ${mobileTab === 'comanda' ? 'text-[#94cb47]' : 'text-slate-500'}`}>
            <Utensils size={20} />
            <span className="text-xs font-bold">Comanda</span>
          </button>
          <button
            onClick={() => setMobileTab('cuentas')}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition relative ${mobileTab === 'cuentas' ? 'text-[#94cb47]' : 'text-slate-500'}`}>
            {openAccounts.filter(a => a.status === 'open').length > 0 && (
              <span className="absolute top-2 right-1/4 bg-[#94cb47] text-black text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {openAccounts.filter(a => a.status === 'open').length}
              </span>
            )}
            <ClipboardList size={20} />
            <span className="text-xs font-bold">Cuentas</span>
          </button>
        </div>
      </div>

      {/* Modal mesa/barra */}
      {showMesaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-2xl border-t border-[#94cb47]/30 p-5 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#94cb47] font-bold text-lg">Seleccionar ubicación</h2>
              <button onClick={() => setShowMesaModal(false)} className="text-slate-400 hover:text-white text-sm">Cerrar</button>
            </div>
            {/* Mesas */}
            <div className="mb-4">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">Mesas</div>
              <div className="grid grid-cols-4 gap-2">
                {(tables || Array.from({ length: maxTables }, (_, i) => i + 1)).map(n => {
                  const existingAcc = openAccounts.find(a => a.status === 'open' && a.type !== 'direct' && String(a.table) === String(n));
                  const tieneC = !!existingAcc;
                  const mesaColor = tieneC ? (COLORES_MESERA[existingAcc.mesera] || '#f59e0b') : null;
                  const isSelected = selectedTable === n && !selectedBarra;
                  return (
                    <button key={n}
                      onClick={() => {
                        const existing = existingAcc;
                        if (existing && !selectedAccount) {
                          setShowMesaModal(false);
                          setSelectedTable(n);
                          setSelectedBarra(null);
                          setConfirmAccount(existing);
                        } else {
                          if (selectedAccount) { onSelectAccount(null); setClientName(''); }
                          setSelectedTable(n);
                          setSelectedBarra(null);
                          setShowMesaModal(false);
                        }
                      }}
                      className={`py-3 rounded-xl font-bold text-sm border transition relative ${isSelected ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600'}`}
                      style={!isSelected && tieneC ? {borderColor: mesaColor, color: mesaColor} : {}}>
                      {n}
                      {tieneC && <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{backgroundColor: mesaColor}}></span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Barras */}
            {isBar && !modoRestaurante && (
              <div>
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-2">Barras</div>
                <div className="grid grid-cols-2 gap-2">
                  {barras.map(b => (
                    <button key={b}
                      onClick={() => { setSelectedBarra(b); setSelectedTable(null); if (selectedAccount) { onSelectAccount(null); setClientName(''); } setShowMesaModal(false); }}
                      className={`py-3 rounded-xl font-bold text-sm border transition ${
                        selectedBarra === b ? 'bg-[#94cb47] text-black border-[#94cb47]' : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal confirmar abrir cuenta */}
      {confirmAccount && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-[#94cb47] font-bold text-lg mb-1">Mesa ocupada</h2>
            <p className="text-slate-400 text-sm mb-4">
              {confirmAccount.barra ? confirmAccount.barra : `Mesa ${confirmAccount.table}`} — {confirmAccount.clientName} · {confirmAccount.mesera}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectAccount(confirmAccount.id || confirmAccount._id);
                  setConfirmAccount(null);
                  setMobileTab('comanda');
                }}
                className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-2.5 rounded-xl transition">
                Abrir y agregar
              </button>
              <button
                onClick={() => { setConfirmAccount(null); setSelectedTable(null); }}
                className="w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {splitOrder && (
        <SplitModal account={splitOrder} onConfirm={onSplit} onClose={() => setSplitOrder(null)} />
      )}

      {/* Modal conflicto de mesa */}
      {mesaConflict && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-[#94cb47]/30 p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-5">
              <h2 className="text-[#94cb47] font-bold text-xl">Mesa ocupada</h2>
              <p className="text-slate-400 text-sm mt-2">
                {mesaConflict.existingAcc.barra || `Mesa ${mesaConflict.existingAcc.table}`} — {mesaConflict.existingAcc.clientName}
              </p>
            </div>
            <p className="text-slate-300 text-sm text-center mb-4">¿Qué deseas hacer?</p>
            <div className="space-y-2">
              <button
                onClick={() => { onAddToExisting && onAddToExisting(mesaConflict.existingAcc._id || mesaConflict.existingAcc.id); setMesaConflict(null); }}
                className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-black font-bold py-2.5 rounded-xl transition text-sm">
                Agregar a la cuenta existente
              </button>
              <button
                onClick={() => mesaConflict.onConfirm(true)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl transition text-sm">
                Nueva cuenta (persona diferente)
              </button>
              <button
                onClick={() => setMesaConflict(null)}
                className="w-full text-slate-500 hover:text-slate-300 text-sm py-2 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
