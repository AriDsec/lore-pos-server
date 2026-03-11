import { useState, useEffect, useCallback } from "react";
import * as api from "./api.js";
import { MENU, LICORES, PINES, meseras, barras } from './constants.js';
import { Spinner, PinModal } from './components.jsx';
import { MeseraScreen } from './MeseraScreen.jsx';
import { KitchenScreen } from './KitchenScreen.jsx';
import { CajaScreen } from './CajaScreen.jsx';
import { AdminScreen } from './AdminScreen.jsx';

export default function RestaurantePOS() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole]       = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [syncError, setSyncError]     = useState(null);
  const [pendingUser, setPendingUser] = useState(null);

  const [cartItems, setCartItems]         = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBarra, setSelectedBarra] = useState(null);
  const [clientName, setClientName]       = useState('');
  const [orderType, setOrderType]         = useState(null);

  const [openAccounts, setOpenAccounts]   = useState([]);
  const [paidOrders, setPaidOrders]       = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const [billOrder, setBillOrder]           = useState(null);
  const [viewItemsOrder, setViewItemsOrder] = useState(null);

  const loadData = useCallback(async (zone, role, silent = false) => {
    if (!silent) setLoading(true);
    setSyncError(null);
    try {
      if (role === 'mesera' || role === 'caja') {
        const [open, paid] = await Promise.all([api.getOpenAccounts(zone), api.getPaidAccounts(zone)]);
        setOpenAccounts(open);
        setPaidOrders(paid);
      }
      if (role === 'cocina') {
        const [kr, kb] = await Promise.all([api.getKitchenOrders('restaurante'), api.getKitchenOrders('bar')]);
        setKitchenOrders([...kr, ...kb]);
      }
      if (role === 'mesera') {
        const kitchen = await api.getKitchenOrders(zone);
        setKitchenOrders(kitchen);
      }
      if (role === 'caja') {
        const kitchen = await api.getKitchenOrders(zone);
        setKitchenOrders(kitchen);
      }
      if (role === 'admin') {
        const [bo, bp, ro, rp] = await Promise.all([api.getOpenAccounts('bar'), api.getPaidAccounts('bar'), api.getOpenAccounts('restaurante'), api.getPaidAccounts('restaurante')]);
        setOpenAccounts([...bo, ...ro]);
        setPaidOrders([...bp, ...rp]);
      }
    } catch (err) {
      setSyncError('Sin conexión al servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser || !userRole) return;
    const interval = setInterval(() => loadData(currentZone, userRole, true), 30000);
    return () => clearInterval(interval);
  }, [currentUser, userRole, currentZone, loadData]);

  const handleLogin = async (name, role, zone) => {
    setCurrentUser(name); setUserRole(role); setCurrentZone(zone);
    await loadData(zone, role);
  };

  const handleLogout = () => {
    setCurrentUser(null); setUserRole(null); setCurrentZone(null);
    setCartItems([]); setSelectedTable(null); setSelectedBarra(null);
    setClientName(''); setOrderType(null); setSelectedAccount(null);
    setOpenAccounts([]); setPaidOrders([]); setKitchenOrders([]);
    setSyncError(null);
  };

  const requestLogin = (name) => setPendingUser(name);
  const confirmPin = async () => {
    const user = PINES[pendingUser];
    setPendingUser(null);
    await handleLogin(pendingUser, user.role, user.zone);
  };

  const handleSelectAccount = (accountId) => {
    if (!accountId) {
      setSelectedAccount(null);
      setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setOrderType(null);
      return;
    }
    const acc = openAccounts.find(a => (a._id === accountId || a.id === accountId));
    if (!acc) return;
    setSelectedAccount(accountId);
    setCartItems(acc.items);
    setSelectedTable(acc.table);
    setSelectedBarra(acc.barra);
    setClientName(acc.clientName || '');
    setOrderType(acc.type || 'dine-in');
  };

  const addToCart = (item, withPotatoes = false) => {
    const itemId = `${item.id}${withPotatoes ? '_cp' : ''}`;
    const price = item.price + (withPotatoes && item.canHavePapas ? 500 : 0);
    const displayName = withPotatoes && item.canHavePapas ? `${item.name} + Papas` : item.name;
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.id === itemId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, id: itemId, price, name: displayName, quantity: 1, notes: '', addedBy: currentUser }];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const updateNotes = (id, notes) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));

  const completeOrder = async () => {
    if (cartItems.length === 0) { alert('El carrito está vacío'); return; }
    if (!orderType) { alert('Selecciona el tipo de pedido (Local o Llevar)'); return; }
    if (orderType === 'dine-in' && !selectedTable && !selectedBarra) { alert('Selecciona una mesa o barra'); return; }
    if (!clientName.trim()) { alert('Ingresa un nombre o seña del cliente'); return; }
    if (clientName.trim().toLowerCase() === 'cliente general') { alert('"Cliente General" es solo para cobros directos. Ingresa un nombre real.'); return; }
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const foodItems = cartItems.filter(i => i.category === 'food');
    setLoading(true);
    try {
      if (selectedAccount) {
        const acc = openAccounts.find(a => (a._id === selectedAccount || a.id === selectedAccount));
        const accId = acc?.id || selectedAccount;
        await api.updateAccount(accId, { items: cartItems, total });
        const prevFoodIds = (acc?.items?.filter(i => i.category === 'food') || []).map(i => i.id);
        const newFood = foodItems.filter(i => !prevFoodIds.includes(i.id));
        if (newFood.length > 0) {
          await api.createKitchenOrder({ id: `k-${Date.now()}`, zone: currentZone, mesera: currentUser, items: newFood, table: selectedTable || null, barra: selectedBarra || null, clientName: clientName || '', locationLabel: selectedBarra ? selectedBarra : (selectedTable ? `Mesa ${selectedTable}` : 'Sin mesa'), status: 'pending', createdAt: new Date() });
        }
        alert('✅ Cuenta actualizada');
      } else {
        await api.createAccount({ id: `acc-${currentZone}-${currentUser}-${Date.now()}`, zone: currentZone, mesera: currentUser, items: [...cartItems], total, type: orderType, table: selectedTable, barra: selectedBarra, clientName, foodItems, drinkItems: cartItems.filter(i => ['alcoholic','beverage','soda'].includes(i.category)), status: 'open', createdAt: new Date() });
        if (foodItems.length > 0) {
          await api.createKitchenOrder({ id: `k-${Date.now()}`, zone: currentZone, mesera: currentUser, items: foodItems, table: selectedTable || null, barra: selectedBarra || null, clientName: clientName || '', locationLabel: selectedBarra ? selectedBarra : (selectedTable ? `Mesa ${selectedTable}` : 'Sin mesa'), status: 'pending', createdAt: new Date() });
        }
        alert('✅ Cuenta abierta registrada');
      }
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setOrderType(null); setSelectedAccount(null);
    } catch (err) {
      alert('❌ Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPay = async () => {
    if (cartItems.length === 0) { alert('El carrito está vacío'); return; }
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const foodItems = cartItems.filter(i => i.category === 'food');
    const location = selectedBarra ? selectedBarra : (selectedTable ? `Mesa ${selectedTable}` : 'Barra');
    setLoading(true);
    try {
      // Crear cuenta abierta tipo 'direct' — la caja la verá y cobrará con método de pago
      await api.createAccount({
        id: `acc-direct-${Date.now()}`, zone: currentZone, mesera: currentUser,
        items: [...cartItems], total, type: 'direct',
        table: selectedTable || null, barra: selectedBarra || null,
        locationLabel: location, clientName: 'Cliente General',
        foodItems, drinkItems: cartItems.filter(i => ['alcoholic','beverage','soda'].includes(i.category)),
        status: 'open', createdAt: new Date(),
      });
      if (foodItems.length > 0) {
        await api.createKitchenOrder({
          id: `k-direct-${Date.now()}`, zone: currentZone, mesera: currentUser,
          items: foodItems, locationLabel: location,
          table: selectedTable || null, barra: selectedBarra || null,
          clientName: 'Cliente General', status: 'pending', createdAt: new Date(),
        });
      }
      setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setOrderType(null); setSelectedAccount(null);
      alert('✅ Pedido enviado. La caja lo cobra.');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const payAccount = async (account, paymentMethod = 'efectivo') => {
    setLoading(true);
    try {
      await api.closeAccount(account.id || account._id, paymentMethod);
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid); setBillOrder(null);
    } catch (err) {
      alert('❌ Error al cobrar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const markOrderReady = async (orderId) => {
    try {
      await api.updateKitchenOrder(orderId, 'ready');
      setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
    } catch (err) { alert('Error: ' + err.message); }
  };

  const markOrderDelivered = async (orderId) => {
    try {
      await api.deleteKitchenOrder(orderId);
      setKitchenOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) { alert('Error: ' + err.message); }
  };

  const barAccounts      = openAccounts.filter(a => a.zone === 'bar');
  const restAccounts     = openAccounts.filter(a => a.zone === 'restaurante');
  const barPaid          = paidOrders.filter(a => a.zone === 'bar');
  const restPaid         = paidOrders.filter(a => a.zone === 'restaurante');
  // Meseras solo ven sus propias cuentas normales (no cobros directos de otras)
  const zoneOpenAccounts = (currentZone === 'bar' ? barAccounts : restAccounts)
    .filter(a => a.type !== 'direct' && a.mesera === currentUser);

  // ── LOGIN ─────────────────────────────────────
  if (!currentUser) {
    const isLandscape = typeof window !== 'undefined' && window.matchMedia('(orientation: landscape)').matches;
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex flex-col items-center justify-center p-4 overflow-y-auto">
        <div className="text-center mb-4">
          <img src="/logo.png" alt="LORE" className={`mx-auto object-contain drop-shadow-lg ${isLandscape ? 'w-20 h-20 mb-1' : 'w-36 h-36 mb-2'}`} />
          <p className="text-[#94cb47]/80 text-base">Sistema de Pedidos</p>
        </div>
        {syncError && (
          <div className="bg-red-900/60 border border-red-500 rounded-xl p-3 mb-3 text-red-200 text-sm text-center w-full max-w-2xl">
            ⚠️ {syncError}
          </div>
        )}
        <div className={`w-full ${isLandscape ? 'grid grid-cols-3 gap-3 max-w-3xl' : 'space-y-3 max-w-md'}`}>
          <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-[#94cb47] font-bold text-base mb-3">🍺 ZONA BAR</h2>
            <button onClick={() => requestLogin('Caja Bar')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">💰 Caja Bar</button>
            <div className="space-y-2">
              {meseras.map(m => (
                <button key={m} onClick={() => requestLogin(m)} className="w-full bg-slate-700/60 hover:bg-slate-600 text-[#94cb47] py-2 rounded-lg transition font-medium text-sm">{m}</button>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl">
            <h2 className="text-[#94cb47] font-bold text-base mb-3">🍽️ ZONA RESTAURANTE</h2>
            <button onClick={() => requestLogin('Caja Restaurante')} className="w-full bg-[#94cb47] hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">💰 Caja</button>
            <button onClick={() => requestLogin('Tablet Restaurante')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg mb-2">📱 Tomar Pedidos</button>
            <button onClick={() => requestLogin('Cocina')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg">👨‍🍳 Cocina</button>
          </div>
          <div className="bg-slate-800/80 backdrop-blur border border-[#94cb47]/40 rounded-2xl p-4 shadow-2xl flex items-center">
            <button onClick={() => requestLogin('Admin')} className="w-full bg-[#94cb47]/90 hover:bg-[#7ab035] text-white font-bold py-2.5 rounded-xl transition shadow-lg">📊 Panel Admin</button>
          </div>
        </div>
        {loading && <Spinner />}
        {pendingUser && (
          <PinModal userName={pendingUser} onSuccess={confirmPin} onCancel={() => setPendingUser(null)} />
        )}
      </div>
    );
  }

  if (userRole === 'mesera') {
    return (
      <>
        {loading && <Spinner />}
        <MeseraScreen
          currentUser={currentUser} zona={currentZone === 'bar' ? 'Bar' : 'Restaurante'}
          menu={currentZone === 'bar' ? MENU.bar : MENU.restaurante}
          licores={LICORES}
          maxTables={currentZone === 'bar' ? 10 : 5}
          onLogout={handleLogout} addToCart={addToCart}
          cartItems={cartItems} updateQuantity={updateQuantity}
          removeFromCart={removeFromCart} updateNotes={updateNotes}
          completeOrder={completeOrder} orderType={orderType} setOrderType={setOrderType}
          selectedTable={selectedTable} setSelectedTable={setSelectedTable}
          selectedBarra={selectedBarra} setSelectedBarra={setSelectedBarra}
          clientName={clientName} setClientName={setClientName}
          barras={barras} kitchenOrders={kitchenOrders.filter(o => o.mesera === currentUser)}
          openAccounts={zoneOpenAccounts} selectedAccount={selectedAccount}
          onSelectAccount={handleSelectAccount}
          isBar={currentZone === 'bar'} onDirectPay={handleDirectPay}
        />
      </>
    );
  }

  if (userRole === 'cocina') {
    return <KitchenScreen kitchenOrders={kitchenOrders} loading={loading} onLogout={handleLogout} onReady={markOrderReady} onDelivered={markOrderDelivered} />;
  }

  if (userRole === 'caja' && currentZone === 'bar') {
    return <CajaScreen zona="bar" zonaNombre="Bar" accounts={barAccounts} paid={barPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} onLogout={handleLogout} onPay={payAccount} />;
  }

  if (userRole === 'caja' && currentZone === 'restaurante') {
    return <CajaScreen zona="restaurante" zonaNombre="Restaurante" accounts={restAccounts} paid={restPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} onLogout={handleLogout} onPay={payAccount} />;
  }

  return <AdminScreen barPaid={barPaid} restPaid={restPaid} loading={loading} onLogout={handleLogout} setPaidOrders={setPaidOrders} />;
}
