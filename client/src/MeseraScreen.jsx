import { useState, useEffect } from "react";
import { Utensils } from 'lucide-react';
import { Header } from './components.jsx';
import { MenuDropdown, ReadyOrdersPanel } from './components.jsx';
import { ShoppingCart } from './Cart.jsx';

export function MeseraScreen({
  currentUser, zona, menu, maxTables, onLogout, addToCart,
  cartItems, updateQuantity, removeFromCart, updateNotes,
  completeOrder, orderType, setOrderType,
  selectedTable, setSelectedTable, selectedBarra, setSelectedBarra,
  clientName, setClientName, barras, kitchenOrders,
  openAccounts, selectedAccount, onSelectAccount,
  onDirectPay, isBar,
}) {
  const [mobileTab, setMobileTab] = useState('menu');
  const [isLandscape, setIsLandscape] = useState(
    () => window.matchMedia('(orientation: landscape)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)');
    const handler = (e) => setIsLandscape(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col">
      <Header mesera={currentUser} zona={zona} onLogout={onLogout} />

      {/* ── Landscape: 3 columnas ── */}
      <div className={`${isLandscape ? "grid" : "hidden"} grid-cols-3 gap-4 p-4 max-w-7xl mx-auto w-full flex-1`}>
        <div className="col-span-2 space-y-6">
          <MenuDropdown menu={menu} onSelectItem={addToCart} />
          <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
        </div>
        <ShoppingCart {...cartProps} mobileVisible="landscape" />
      </div>

      {/* ── Portrait: tabs ── */}
      <div className={`${isLandscape ? "hidden" : "flex"} flex-col flex-1 overflow-hidden`}>
        <div className="flex-1 overflow-y-auto p-3">
          {mobileTab === 'menu' ? (
            <div className="space-y-4">
              <MenuDropdown menu={menu} onSelectItem={addToCart} />
              <ReadyOrdersPanel kitchenOrders={kitchenOrders} mesera={currentUser} />
            </div>
          ) : (
            <ShoppingCart {...cartProps} mobileVisible={true} />
          )}
        </div>

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
    </div>
  );
}
