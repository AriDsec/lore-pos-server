import { useState, useEffect } from "react";
import { Utensils, Package } from 'lucide-react';
import { Header, MenuDropdown, ReadyOrdersPanel, LicoresPanel, OtrosPanel, SplitModal } from './components.jsx';
import { ShoppingCart } from './Cart.jsx';

export function MeseraScreen({
  currentUser, zona, menu, maxTables, onLogout, addToCart,
  cartItems, updateQuantity, removeFromCart, updateNotes,
  completeOrder, orderType, setOrderType,
  selectedTable, setSelectedTable, selectedBarra, setSelectedBarra,
  clientName, setClientName, barras, kitchenOrders,
  openAccounts, selectedAccount, onSelectAccount,
  onDirectPay, isBar, tables,
  splitOrder, setSplitOrder, onSplit,
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
    selectedTable, setSelectedTable,
    selectedBarra, setSelectedBarra,
    clientName, setClientName,
    barras, maxTables,
    openAccounts, selectedAccount,
    onSelectAccount,
    isBar,
    onDirectPay,
    tables,
    onSplit: (acc) => setSplitOrder(acc),
  };

  // Panel central en landscape: Menú + Licores + Otros con tabs
  const [menuTab, setMenuTab] = useState('menu');

  const MenuCenter = () => (
    <div className="space-y-3">
      {/* Mini tabs para menu/licores/otros */}
      <div className="flex gap-2">
        {[
          { id: 'menu',    label: '🍽️ Menú' },
          { id: 'licores', label: '🥃 Licores' },
          { id: 'otros',   label: '📦 Otros' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setMenuTab(t.id)}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
              menuTab === t.id
                ? 'bg-[#94cb47] text-black'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {menuTab === 'menu'    && <MenuDropdown menu={menu} onSelectItem={addToCart} />}
      {menuTab === 'licores' && <LicoresPanel onAddToCart={addToCart} />}
      {menuTab === 'otros'   && <OtrosPanel onAddToCart={addToCart} />}

      <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col">
      <Header mesera={currentUser} zona={zona} onLogout={onLogout} />

      {/* ── Landscape: 5 columnas — 3 menú / 2 carrito ── */}
      <div className={`${isLandscape ? "grid" : "hidden"} grid-cols-5 gap-3 p-3 max-w-7xl mx-auto w-full flex-1 min-h-0`}>
        <div className="col-span-3 space-y-3 overflow-y-auto min-h-0">
          <MenuCenter />
        </div>
        <div className="col-span-2 min-h-0">
          <ShoppingCart {...cartProps} mobileVisible="landscape" />
        </div>
      </div>

      {/* ── Portrait: tabs ── */}
      <div className={`${isLandscape ? "hidden" : "flex"} flex-col flex-1 overflow-hidden`}>
        <div className="flex-1 overflow-y-auto p-3">
          {mobileTab === 'menu' && (
            <div className="space-y-4">
              {/* Mini tabs también en portrait */}
              <div className="flex gap-2">
                {[
                  { id: 'menu',    label: '🍽️ Menú' },
                  { id: 'licores', label: '🥃 Licores' },
                  { id: 'otros',   label: '📦 Otros' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMenuTab(t.id)}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${
                      menuTab === t.id
                        ? 'bg-[#94cb47] text-black'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {menuTab === 'menu'    && <MenuDropdown menu={menu} onSelectItem={addToCart} />}
              {menuTab === 'licores' && <LicoresPanel onAddToCart={addToCart} />}
              {menuTab === 'otros'   && <OtrosPanel onAddToCart={addToCart} />}

              <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
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
    </div>
  );
}
