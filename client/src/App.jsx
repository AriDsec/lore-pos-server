import { useState, useEffect, useCallback } from "react";
import * as api from "./api.js";
import { MENU, LICORES, PINES, meseras, barras } from './constants.js';
import { Spinner, PinLoginScreen, SelectorScreen } from './components.jsx';
import { MeseraScreen } from './MeseraScreen.jsx';
import { KitchenScreen } from './KitchenScreen.jsx';
import { CajaScreen } from './CajaScreen.jsx';
import { AdminScreen } from './AdminScreen.jsx';

export default function RestaurantePOS() {
  const savedSession = (() => { try { return JSON.parse(localStorage.getItem('lore_session')); } catch { return null; } })();
  const savedAdmin   = (() => { try { return localStorage.getItem('lore_admin'); } catch { return null; } })();
  const [currentUser, setCurrentUser] = useState(savedSession?.user || null);
  const [userRole, setUserRole]       = useState(savedSession?.role || null);
  const [currentZone, setCurrentZone] = useState(savedSession?.zone || null);
  const [loading, setLoading]         = useState(false);
  const [syncError, setSyncError]     = useState(null);
  const [showSelector, setShowSelector] = useState(!!savedAdmin && !savedSession?.user);
  const [adminUser, setAdminUser]       = useState(savedAdmin || null);

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
  const [splitOrder, setSplitOrder]         = useState(null);

  const [isLandscape, setIsLandscape] = useState(
    () => window.matchMedia('(orientation: landscape)').matches
  );
  useEffect(() => {
    const check = () => setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
    const mq = window.matchMedia('(orientation: landscape)');
    mq.addEventListener('change', check);
    window.addEventListener('resize', check);
    return () => { mq.removeEventListener('change', check); window.removeEventListener('resize', check); };
  }, []);

  // Auto-cargar datos si hay sesión guardada
  useEffect(() => {
    if (savedSession?.user && savedSession?.role && savedSession?.zone) {
      loadData(savedSession.zone, savedSession.role);
    }
  }, []); // eslint-disable-line

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
    const interval = setInterval(() => loadData(currentZone, userRole, true), 15000);
    return () => clearInterval(interval);
  }, [currentUser, userRole, currentZone, loadData]);

  const handleLogin = async (name, role, zone) => {
    setCurrentUser(name); setUserRole(role); setCurrentZone(zone);
    localStorage.setItem('lore_session', JSON.stringify({ user: name, role, zone }));
    await loadData(zone, role);
  };

  const handleLogout = () => {
    localStorage.removeItem('lore_session');
    const wasAdmin = adminUser !== null;
    setCurrentUser(null); setUserRole(null); setCurrentZone(null);
    if (wasAdmin) localStorage.setItem('lore_admin', adminUser);
    setCartItems([]); setSelectedTable(null); setSelectedBarra(null);
    setClientName(''); setOrderType(null); setSelectedAccount(null);
    setOpenAccounts([]); setPaidOrders([]); setKitchenOrders([]);
    setSyncError(null);
    if (wasAdmin) {
      setShowSelector(true); // Admin vuelve al selector, no al PIN
    } else {
      setShowSelector(false);
      setAdminUser(null);
      localStorage.removeItem('lore_admin');
    }
  };

  const loginWithPin = async (pin) => {
    const entry = Object.entries(PINES).find(([, v]) => v.pin === pin);
    if (!entry) return false;
    const [name, { role }] = entry;
    if (role === 'admin') {
      setAdminUser(name);
      setShowSelector(true);
      localStorage.setItem('lore_admin', name);
      api.logAccess(name, pin, 'login');
      return true;
    }
    const [, { zone }] = entry;
    api.logAccess(name, pin, 'login');
    await handleLogin(name, role, zone);
    return true;
  };

  // Entradas del selector que no tienen PIN propio (solo accesibles via admin)
  const SELECTOR_EXTRAS = {
    'Tablet Restaurante': { role: 'mesera', zone: 'restaurante' },
    'Cocina':             { role: 'cocina', zone: 'restaurante' },
  };

  const handleSelectorLogin = async (name) => {
    // '__admin__' significa entrar al Panel Admin con el usuario admin actual
    if (name === '__admin__') {
      api.logAccess(adminUser, '', 'select', 'Panel Admin');
      await handleLogin(adminUser, 'admin', 'admin');
      setShowSelector(false);
      return;
    }
    const user = PINES[name] || SELECTOR_EXTRAS[name];
    if (!user) return;
    api.logAccess(adminUser, '', 'select', name);
    await handleLogin(name, user.role, user.zone);
    setShowSelector(false);
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

  const handleSplitAccount = async (account, newItems, remaining) => {
    setLoading(true);
    try {
      const accId = account.id || account._id;
      const remainTotal = remaining.reduce((s, i) => s + i.price * i.quantity, 0);
      const newTotal    = newItems.reduce((s, i) => s + i.price * i.quantity, 0);
      // Actualizar cuenta original con los items restantes
      await api.updateAccount(accId, { items: remaining, total: remainTotal });
      // Crear cuenta nueva con los items separados (mismos datos de ubicación y nombre)
      await api.createAccount({
        id: `acc-split-${Date.now()}`,
        zone: account.zone,
        mesera: account.mesera,
        items: newItems,
        total: newTotal,
        type: account.type || 'dine-in',
        table: account.table || null,
        barra: account.barra || null,
        locationLabel: account.locationLabel || null,
        clientName: account.clientName || '',
        foodItems: newItems.filter(i => i.category === 'food'),
        drinkItems: newItems.filter(i => ['alcoholic','beverage','soda'].includes(i.category)),
        status: 'open',
        createdAt: new Date(),
      });
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid);
      setSplitOrder(null);
      alert('✅ Cuenta separada correctamente');
    } catch (err) {
      alert('❌ Error al separar: ' + err.message);
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
  // Meseras ven todas las cuentas normales de su zona (no solo las propias)
  // para poder agregar items a cuentas de otros clientes
  // La Tablet Restaurante sigue viendo solo las suyas (es una terminal fija)
  const zoneOpenAccounts = (currentZone === 'bar' ? barAccounts : restAccounts)
    .filter(a => a.type !== 'direct' && (currentUser === 'Tablet Restaurante' ? a.mesera === currentUser : true));

  // ── LOGIN ─────────────────────────────────────
  if (!currentUser) {
    if (showSelector) {
      return <SelectorScreen
        isLandscape={isLandscape}
        syncError={syncError}
        loading={loading}
        onSelect={handleSelectorLogin}
        onBack={() => { setShowSelector(false); setAdminUser(null); localStorage.removeItem('lore_admin'); }}
      />;
    }
    return <PinLoginScreen
      isLandscape={isLandscape}
      syncError={syncError}
      loading={loading}
      onLogin={loginWithPin}
    />;
  }

  if (userRole === 'mesera') {
    return (
      <>
        {loading && <Spinner />}
        <MeseraScreen
          currentUser={currentUser} zona={currentZone === 'bar' ? 'Bar' : 'Restaurante'}
          menu={currentZone === 'bar' ? MENU.bar : MENU.restaurante}
          licores={LICORES}
          maxTables={currentZone === 'bar' ? 12 : 5}
          tables={currentZone === 'bar' ? [0,1,2,3,4,5,6,7,8,9,10,11,12] : null}
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
          splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount}
        />
      </>
    );
  }

  if (userRole === 'cocina') {
    return <KitchenScreen kitchenOrders={kitchenOrders} loading={loading} onLogout={handleLogout} onReady={markOrderReady} onDelivered={markOrderDelivered} />;
  }

  if (userRole === 'caja' && currentZone === 'bar') {
    return <CajaScreen zona="bar" zonaNombre="Bar" accounts={barAccounts} paid={barPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount} onLogout={handleLogout} onPay={payAccount} />;
  }

  if (userRole === 'caja' && currentZone === 'restaurante') {
    return <CajaScreen zona="restaurante" zonaNombre="Restaurante" accounts={restAccounts} paid={restPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount} onLogout={handleLogout} onPay={payAccount} />;
  }

  return <AdminScreen barPaid={barPaid} restPaid={restPaid} loading={loading} onLogout={handleLogout} setPaidOrders={setPaidOrders} />;
}
