import { useState, useEffect, useCallback, useRef } from "react";
import { sonidoPedidoNuevo, sonidoPedidoListo, sonidoCobro } from "./sounds.js";
import * as api from "./api.js";
import { MENU, LICORES, PINES, meseras, barras } from './constants.js';
import { Spinner, Toast } from './ui.jsx';
import { PinLoginScreen, SelectorScreen } from './modals.jsx';
import { MeseraScreen } from './MeseraScreen.jsx';
import { KitchenScreen } from './KitchenScreen.jsx';
import { CajaScreen } from './CajaScreen.jsx';
import { AdminScreen } from './AdminScreen.jsx';

// LORE POS v2.1
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
  const [toasts, setToasts]             = useState([]);
  const modalOpenRef = useRef(false); // pausa el sync cuando hay modal abierto
  const prevKitchenIds = useRef(new Set()); // para detectar pedidos nuevos en cocina
  const prevReadyIds   = useRef(new Set()); // para detectar pedidos listos para meseras

  // Servicio 10% — estado reactivo, persiste en servidor + localStorage como fallback
  const [servicioActivoGlobal, setServicioActivoGlobal] = useState(() => {
    return new Date().getDay() === 6; // true solo si es sábado
  });

  // Al iniciar, sincronizar — sábado siempre activo, cualquier otro día siempre desactivo
  useEffect(() => {
    const esSabado = new Date().getDay() === 6;
    setServicioActivoGlobal(esSabado);
    localStorage.setItem('lore_servicio', String(esSabado));
    // Si admin lo cambió manualmente hoy, respetar solo si el servidor lo dice Y es sábado
    if (!esSabado) {
      api.getConfig('servicio_activo').then(({ value }) => {
        // No sábado: solo activar si admin lo forzó manualmente (value===true guardado hoy)
        // Para simplificar: no sábado = siempre false al cargar, admin puede activar
      }).catch(() => {});
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    const duration = type === 'error' ? 5000 : type === 'warning' ? 4500 : 4000;
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('lore_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedBarra, setSelectedBarra] = useState(null);
  const [clientName, setClientName]       = useState('');
  const [orderType, setOrderType]         = useState(null);

  const [openAccounts, setOpenAccounts]   = useState([]);
  const [paidOrders, setPaidOrders]       = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Persistir carrito en sessionStorage — sobrevive recarga de página pero no cierre del browser
  useEffect(() => {
    try {
      if (cartItems.length > 0) {
        sessionStorage.setItem('lore_cart', JSON.stringify(cartItems));
      } else {
        sessionStorage.removeItem('lore_cart');
      }
    } catch {}
  }, [cartItems]);
  const [modoRestaurante, setModoRestaurante] = useState(false);

  const [billOrder, setBillOrder]           = useState(null);
  const [viewItemsOrder, setViewItemsOrder] = useState(null);
  const [splitOrder, setSplitOrder]         = useState(null);
  const [mesaConflict, setMesaConflict]     = useState(null); // {existingAcc, onConfirm}

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
        const allOrders = [...kr, ...kb];
        if (silent) {
          const newOrders = allOrders.filter(o => !prevKitchenIds.current.has(o.id));
          if (newOrders.length > 0) sonidoPedidoNuevo();
          prevKitchenIds.current = new Set(allOrders.map(o => o.id));
        }
        setKitchenOrders(allOrders);
      }
      if (role === 'mesera') {
        const kitchen = await api.getKitchenOrders(zone);
        if (!silent) {
          // Primer load — inicializar refs sin disparar sonidos
          prevKitchenIds.current = new Set(kitchen.map(o => o.id));
          prevReadyIds.current = new Set(kitchen.filter(o => o.status === 'ready').map(o => o.id));
        }
        if (silent) {
          // Detectar pedidos nuevos (solo actualizar refs — el sonido de nuevo pedido es solo para cocina)
          const allIds = new Set(kitchen.map(o => o.id));
          prevKitchenIds.current = allIds;

          // Detectar pedidos recién marcados como listos (sonido diferente)
          const readyNow = kitchen.filter(o => o.status === 'ready');
          const newReady = readyNow.filter(o => !prevReadyIds.current.has(o.id));
          if (newReady.length > 0) sonidoPedidoListo();
          prevReadyIds.current = new Set(readyNow.map(o => o.id));
        }
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
    const interval_ms = (userRole === 'mesera' || userRole === 'cocina' || userRole === 'caja') ? 5000 : 15000;
    const interval = setInterval(async () => {
      const anyModalOpen = modalOpenRef.current || !!splitOrder || !!billOrder || !!viewItemsOrder;
      if (!anyModalOpen) loadData(currentZone, userRole, true);
      // Validar si la sesión sigue activa (meseras pueden ser bloqueadas desde admin)
      if (userRole === 'mesera' || userRole === 'caja') {
        const cfg = await api.getMeserasActivas().catch(() => null);
        if (cfg && cfg.value && cfg.value[currentUser] === false) {
          showToast('Tu acceso fue desactivado por el administrador', 'error');
          setTimeout(() => handleLogout(), 2000);
        }
      }
    }, interval_ms);
    return () => clearInterval(interval);
  }, [currentUser, userRole, currentZone, loadData]);

  // Recalcular precios del carrito cuando cambia mesa/barra (servicio 10%)
  useEffect(() => {
    if (cartItems.length === 0 || currentZone !== 'bar' || !servicioActivoGlobal || modoRestaurante) return;
    const esmesa = !!selectedTable && !selectedBarra;
    setCartItems(prev => prev.map(item => {
      // Solo recalcular items con conServicio explícitamente definido (boolean)
      // Items sin conServicio (cuentas antiguas) NO se tocan para evitar doble 10%
      if (item.conServicio === undefined || item.conServicio === null) return item;
      // Si el estado ya es correcto, no recalcular
      if (item.conServicio === esmesa) return item;
      // Recalcular desde el precio base
      const basePrice = item.conServicio
        ? Math.round(item.price / 1.10)
        : item.price;
      const newPrice = esmesa ? Math.round(basePrice * 1.10) : basePrice;
      return { ...item, price: newPrice, conServicio: esmesa };
    }));
  }, [selectedTable, selectedBarra]); // eslint-disable-line

  // Si la cuenta seleccionada fue cobrada por otra persona, limpiar selección
  useEffect(() => {
    if (!selectedAccount || openAccounts.length === 0) return;
    const stillOpen = openAccounts.find(a => (a._id === selectedAccount || a.id === selectedAccount) && a.status === 'open');
    if (!stillOpen) {
      setSelectedAccount(null);
      setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setModoRestaurante(false); sessionStorage.removeItem('lore_cart');
      setClientName(''); setOrderType(null);
      showToast('La cuenta fue cobrada por otra persona', 'warning');
    }
  }, [openAccounts, selectedAccount]);

  // Auto-cargar datos si hay sesión guardada
  useEffect(() => {
    if (savedSession?.user && savedSession?.role && savedSession?.zone) {
      loadData(savedSession.zone, savedSession.role);
    }
  }, []); // eslint-disable-line

  // Reintento automático cuando hay error de conexión
  useEffect(() => {
    if (!syncError || !currentUser) return;
    const retry = setTimeout(() => {
      if (currentZone && userRole) loadData(currentZone, userRole, true);
    }, 10000);
    return () => clearTimeout(retry);
  }, [syncError, currentUser, currentZone, userRole, loadData]);

  const handleLogin = async (name, role, zone) => {
    setCurrentUser(name); setUserRole(role); setCurrentZone(zone);
    localStorage.setItem('lore_session', JSON.stringify({ user: name, role, zone }));
    await loadData(zone, role);
  };

  const handleLogout = () => {
    localStorage.removeItem('lore_session');
    setLoading(false); // resetear loading para evitar pantalla negra
    const wasAdmin = adminUser !== null;
    setCurrentUser(null); setUserRole(null); setCurrentZone(null);
    if (wasAdmin) localStorage.setItem('lore_admin', adminUser);
    sessionStorage.removeItem('lore_cart'); setCartItems([]); setSelectedTable(null); setSelectedBarra(null);
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

  // ── PIN lockout — 5 intentos fallidos = bloqueo de 10 minutos ──
  const checkLockout = () => {
    const data = JSON.parse(localStorage.getItem('lore_lockout') || '{}');
    if (!data.until) return false;
    if (Date.now() < data.until) return true;
    localStorage.removeItem('lore_lockout');
    return false;
  };

  const registerFailedAttempt = () => {
    const data = JSON.parse(localStorage.getItem('lore_lockout') || '{}');
    // Si el último intento fue hace más de 30 minutos, resetear el contador
    const ahora = Date.now();
    const muyViejo = data.lastAttempt && (ahora - data.lastAttempt) > 30 * 60 * 1000;
    const attempts = muyViejo ? 1 : (data.attempts || 0) + 1;
    if (attempts >= 5) {
      localStorage.setItem('lore_lockout', JSON.stringify({
        attempts,
        until: ahora + 10 * 60 * 1000,
        lastAttempt: ahora,
      }));
    } else {
      localStorage.setItem('lore_lockout', JSON.stringify({ attempts, lastAttempt: ahora }));
    }
    return attempts >= 5;
  };

  const clearLockout = () => localStorage.removeItem('lore_lockout');

  const loginWithPin = async (pin) => {
    const entry = Object.entries(PINES).find(([, v]) => v.pin === pin);
    // Verificar PIN primero — si es correcto, limpiar lockout y continuar sin importar intentos
    if (!entry) {
      // PIN incorrecto — verificar lockout y registrar intento
      if (checkLockout()) return 'bloqueado';
      const locked = registerFailedAttempt();
      if (locked) {
        const data = JSON.parse(localStorage.getItem('lore_lockout') || '{}');
        const mins = Math.ceil((data.until - Date.now()) / 60000);
        return `bloqueado:${mins}`;
      }
      return false;
    }
    const [name, { role }] = entry;
    if (role === 'admin') {
      setAdminUser(name);
      setShowSelector(true);
      localStorage.setItem('lore_admin', name);
      api.logAccess(name, pin, 'login');
      clearLockout();
      return true;
    }
    // Verificar si la mesera está activa
    if (role === 'mesera' || role === 'caja') {
      const config = await api.getMeserasActivas();
      if (config && config.value) {
        const activas = config.value;
        if (activas[name] === false) {
          return 'desactivada';
        }
      }
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
    'Guido Bar':          { role: 'mesera', zone: 'bar' },
  };

  // Timeout de sesión — 8 horas, aviso 10 min antes (debe ir después de handleLogout)
  useEffect(() => {
    if (!currentUser || userRole === 'admin') return;
    const OCHO_HORAS = 8 * 60 * 60 * 1000;
    const AVISO = 10 * 60 * 1000;
    const avisoTimer = setTimeout(() => {
      showToast('⏰ La sesión cierra en 10 minutos', 'warning');
    }, OCHO_HORAS - AVISO);
    const logoutTimer = setTimeout(() => {
      // Si hay carrito lleno, avisar más claramente
      if (cartItems.length > 0) {
        showToast('⚠️ Sesión expirada — guarda o pierde el carrito', 'error');
      } else {
        showToast('Sesión cerrada por inactividad', 'warning');
      }
      setTimeout(handleLogout, 3000);
    }, OCHO_HORAS);
    return () => { clearTimeout(avisoTimer); clearTimeout(logoutTimer); };
  }, [currentUser, userRole]); // eslint-disable-line

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
      sessionStorage.removeItem('lore_cart'); setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setModoRestaurante(false); setOrderType(null);
      return;
    }
    const acc = openAccounts.find(a => (a._id === accountId || a.id === accountId));
    if (!acc) return;
    setSelectedAccount(accountId);
    setCartItems(acc.items);
    setSelectedTable((acc.table && Number(acc.table) > 0) ? Number(acc.table) : null);
    setSelectedBarra(acc.barra);
    setClientName(acc.clientName || '');
    setOrderType(acc.type || 'dine-in');
  };

  // Servicio 10% solo aplica en mesas (no en barras — ahí el cliente se sirve solo)
  const aplicaServicio = servicioActivoGlobal && currentZone === 'bar' && !modoRestaurante && !!selectedTable && !selectedBarra;
  const conServicio = (precio) => aplicaServicio ? Math.round(precio * 1.10) : precio;

  const addToCart = (item, withPotatoes = false) => {
    const itemId = `${item.id}${withPotatoes ? '_cp' : ''}::${currentUser}`;
    const basePrice = item.price + (withPotatoes && item.canHavePapas ? 500 : 0);
    const price = conServicio(basePrice);
    const displayName = withPotatoes && item.canHavePapas ? `${item.name} + Papas` : item.name;
    setCartItems(prev => {
      // Agrupar solo si el item fue agregado por el mismo usuario — si es otro, nueva línea
      const idx = prev.findIndex(i => i.id === itemId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...prev, { ...item, id: itemId, price, name: displayName, quantity: 1, notes: '', addedBy: currentUser, conServicio: aplicaServicio }];
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };
  const updateNotes = (id, notes) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));

  const completeOrder = async () => {
    const effectiveZone = (currentZone === 'bar' && modoRestaurante) ? 'restaurante' : currentZone;
    if (loading) return;
    if (cartItems.length === 0) { showToast('El carrito está vacío', 'warning'); return; }
    // En restaurante nunca debe haber barra
    if (currentZone === 'restaurante' && selectedBarra) setSelectedBarra(null);
    // Avisar si el servicio debería aplicar pero no hay mesa seleccionada
    if (servicioActivoGlobal && currentZone === 'bar' && !selectedTable && !selectedBarra) {
      showToast('El 10% de servicio aplica en mesas — selecciona una mesa o confirma que es barra', 'warning');
    }
    if (!orderType) { showToast('Selecciona el tipo de pedido', 'warning'); return; }
    const validZone = (currentZone === 'bar' && modoRestaurante) ? 'restaurante' : currentZone;
    if (orderType === 'dine-in' && (validZone === 'restaurante' ? !selectedTable : (!selectedTable && !selectedBarra))) { showToast('Selecciona una mesa o barra', 'warning'); return; }
    if (!clientName.trim()) { showToast('Ingresa un nombre o seña', 'warning'); return; }
    if (clientName.trim().toLowerCase() === 'cliente general') { showToast('Usa un nombre real, no "Cliente General"', 'warning'); return; }
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const foodItems = cartItems.filter(i => i.category === 'food' || i.category === 'batido' || (i.category === 'otro' && i.kitchen));
    setLoading(true);
    try {
      if (selectedAccount) {
        const acc = openAccounts.find(a => (a._id === selectedAccount || a.id === selectedAccount));
        if (!acc || !['open', 'pending_approval'].includes(acc.status)) {
          showToast('Esta cuenta ya fue cobrada o no existe', 'warning');
          setSelectedAccount(null); sessionStorage.removeItem('lore_cart'); setCartItems([]); setClientName(''); setOrderType(null);
          setLoading(false); return;
        }
        const accId = acc?.id || selectedAccount;
        // Solo guardar si hay items nuevos en el carrito
        if (cartItems.length === 0) {
          showToast('Agrega algo al carrito primero', 'warning');
          setLoading(false); return;
        }
        const existingItems = acc?.items || [];
        // Merge inteligente: los items del carrito son NUEVOS — no reemplazar los existentes
        // Agrupar por id base + addedBy para no duplicar
        const mergedMap = new Map();
        // Normalizar ids existentes (pueden tener :: de ediciones anteriores)
        existingItems.forEach(item => {
          const baseId = item.id.includes('::') ? item.id.split('::')[0] : item.id;
          const key = `${baseId}||${item.addedBy || ''}`;
          if (mergedMap.has(key)) {
            // Mismo item mismo usuario — sumar (no debería pasar pero por seguridad)
            const prev = mergedMap.get(key);
            mergedMap.set(key, { ...prev, id: baseId, quantity: prev.quantity + item.quantity });
          } else {
            mergedMap.set(key, { ...item, id: baseId });
          }
        });
        // Agregar los del carrito — si ya existe mismo id base + mismo usuario, sumar cantidad
        cartItems.forEach(item => {
          const baseId = item.id.includes('::') ? item.id.split('::')[0] : item.id;
          const key = `${baseId}||${item.addedBy || currentUser}`;
          if (mergedMap.has(key)) {
            const existing = mergedMap.get(key);
            mergedMap.set(key, { ...existing, quantity: existing.quantity + item.quantity });
          } else {
            mergedMap.set(key, { ...item, id: baseId, addedBy: item.addedBy || currentUser });
          }
        });
        const mergedItems = Array.from(mergedMap.values());
        const mergedTotal = mergedItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const updatedAcc = await api.updateAccount(accId, { items: mergedItems, total: mergedTotal, editedBy: currentUser });
        // Actualizar openAccounts en memoria inmediatamente con la cuenta ya mergeada
        // Evita que una segunda edición rápida lea items viejos
        if (updatedAcc) {
          setOpenAccounts(prev => prev.map(a => (a.id === accId || a._id === accId) ? { ...a, ...updatedAcc } : a));
        }

        // Detectar items nuevos vs lo que ya estaba en la cuenta
        const prevItems = existingItems;
        const itemsParaCocina = foodItems.reduce((nuevos, item) => {
          const baseId = item.id.includes('::') ? item.id.split('::')[0] : item.id;
          const prev = prevItems.find(p => (p.id.includes('::') ? p.id.split('::')[0] : p.id) === baseId);
          if (!prev) {
            // Item completamente nuevo
            nuevos.push({ ...item, esNuevo: true });
          } else if (item.quantity > prev.quantity) {
            // Cantidad aumentada — mandar solo la diferencia
            nuevos.push({ ...item, quantity: item.quantity - prev.quantity, esNuevo: true });
          }
          return nuevos;
        }, []);

        if (itemsParaCocina.length > 0) {
          await api.createKitchenOrder({
            id: `k-${Date.now()}`, zone: effectiveZone, mesera: currentUser,
            items: itemsParaCocina,
            table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: currentZone === 'bar' ? (selectedBarra || null) : null,
            clientName: clientName || '',
            locationLabel: selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : orderType === 'takeout' ? 'Para llevar' : 'Sin mesa'),
            status: 'pending', createdAt: new Date(),
            esActualizacion: true,  // bandera para que cocina sepa que es adicional
          });
        }
        showToast('Cuenta actualizada');
      } else {
        // Verificar si ya existe una cuenta en la misma mesa/barra
        // Solo preguntar conflicto en mesas — en barra es normal tener varias cuentas
        const cuentaExistente = selectedTable ? openAccounts.find(a =>
          a.status === 'open' && a.type !== 'direct' &&
          String(a.table) === String(selectedTable)
        ) : null;

        if (cuentaExistente && !mesaConflict) {
          // Hay cuenta en esa mesa — preguntar al usuario
          setLoading(false);
          setMesaConflict({
            existingAcc: cuentaExistente,
            onConfirm: async (createNew) => {
              setMesaConflict(null);
              if (!createNew) return; // canceló
              // Si eligió crear nueva, continuar normalmente
              setLoading(true);
              try {
                const exentoAprobacion2 = ['Guido Bar', 'Tablet Restaurante'].includes(currentUser);
                const accountStatus2 = (effectiveZone === 'bar' && userRole === 'mesera' && !exentoAprobacion2) ? 'pending_approval' : 'open';
                await api.createAccount({ id: `acc-${currentZone}-${currentUser}-${Date.now()}`, zone: effectiveZone, mesera: currentUser, items: [...cartItems], total, type: orderType, table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: (currentZone === 'bar' && !modoRestaurante) ? selectedBarra : null, clientName, foodItems, drinkItems: cartItems.filter(i => ['alcoholic','beverage','soda','batido'].includes(i.category)), locationLabel: selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : orderType === 'takeout' ? 'Para llevar' : 'Sin mesa'), status: accountStatus2, createdAt: new Date() });
                if (foodItems.length > 0 && accountStatus2 === 'open') {
                  await api.createKitchenOrder({ id: `k-${Date.now()}`, zone: effectiveZone, mesera: currentUser, items: foodItems, table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: currentZone === 'bar' ? (selectedBarra || null) : null, clientName: clientName || '', locationLabel: selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : orderType === 'takeout' ? 'Para llevar' : 'Sin mesa'), status: 'pending', createdAt: new Date() });
                }
                const fresh = await api.getOpenAccounts(currentZone);
                setOpenAccounts(fresh);
                sessionStorage.removeItem('lore_cart'); setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setModoRestaurante(false); setOrderType(null); setSelectedAccount(null);
                showToast(accountStatus2 === 'pending_approval' ? 'Cuenta enviada — esperando aprobación de caja' : 'Cuenta registrada');
              } catch(err) {
                showToast('Error al guardar: ' + err.message, 'error');
              } finally {
                setLoading(false);
              }
            }
          });
          return;
        }

        const exentoAprobacion = ['Guido Bar', 'Tablet Restaurante'].includes(currentUser);
        const accountStatus = (effectiveZone === 'bar' && userRole === 'mesera' && !exentoAprobacion) ? 'pending_approval' : 'open';
        await api.createAccount({ id: `acc-${currentZone}-${currentUser}-${Date.now()}`, zone: effectiveZone, mesera: currentUser, items: [...cartItems], total, type: orderType, table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: (currentZone === 'bar' && !modoRestaurante) ? selectedBarra : null, clientName, foodItems, drinkItems: cartItems.filter(i => ['alcoholic','beverage','soda','batido'].includes(i.category)), locationLabel: selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : orderType === 'takeout' ? 'Para llevar' : 'Sin mesa'), status: accountStatus, createdAt: new Date() });
        if (foodItems.length > 0 && accountStatus === 'open') {
          await api.createKitchenOrder({ id: `k-${Date.now()}`, zone: effectiveZone, mesera: currentUser, items: foodItems, table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: currentZone === 'bar' ? (selectedBarra || null) : null, clientName: clientName || '', locationLabel: selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : orderType === 'takeout' ? 'Para llevar' : 'Sin mesa'), status: 'pending', createdAt: new Date() });
        }
        showToast(accountStatus === 'pending_approval' ? 'Cuenta enviada — esperando aprobación de caja' : 'Cuenta registrada');
      }
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      sessionStorage.removeItem('lore_cart'); setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setOrderType(null); setSelectedAccount(null); setModoRestaurante(false);
    } catch (err) {
      showToast('Error al guardar: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPay = async () => {
    if (loading) return;
    if (cartItems.length === 0) { showToast('El carrito está vacío', 'warning'); return; }
    const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const foodItems = cartItems.filter(i => i.category === 'food' || i.category === 'batido' || (i.category === 'otro' && i.kitchen));
    const location = selectedBarra ? selectedBarra : ((selectedTable && Number(selectedTable) > 0) ? `Mesa ${selectedTable}` : 'Barra');
    setLoading(true);
    try {
      // Crear cuenta abierta tipo 'direct' — la caja la verá y cobrará con método de pago
      await api.createAccount({
        id: `acc-direct-${Date.now()}`, zone: currentZone, mesera: currentUser,
        items: [...cartItems], total, type: 'direct',
        table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: currentZone === 'bar' ? (selectedBarra || null) : null,
        locationLabel: location, clientName: 'Cliente General',
        foodItems, drinkItems: cartItems.filter(i => ['alcoholic','beverage','soda','batido'].includes(i.category)),
        status: 'open', createdAt: new Date(),
      });
      if (foodItems.length > 0) {
        await api.createKitchenOrder({
          id: `k-direct-${Date.now()}`, zone: currentZone, mesera: currentUser,
          items: foodItems, locationLabel: location,
          table: (selectedTable && Number(selectedTable) > 0) ? Number(selectedTable) : null, barra: currentZone === 'bar' ? (selectedBarra || null) : null,
          clientName: 'Cliente General', status: 'pending', createdAt: new Date(),
        });
      }
      sessionStorage.removeItem('lore_cart'); setCartItems([]); setSelectedTable(null); setSelectedBarra(null); setClientName(''); setOrderType(null); setSelectedAccount(null);
      showToast('Pedido enviado a caja');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const payAccount = async (account, paymentMethod = 'efectivo') => {
    // Verificar que la cuenta sigue abierta antes de cobrar
    const stillOpen = openAccounts.find(a => (a._id === account._id || a.id === account.id) && a.status === 'open');
    if (!stillOpen) {
      showToast('Esta cuenta ya fue cobrada', 'warning');
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid); setBillOrder(null);
      return;
    }
    setLoading(true);
    try {
      const descuentoData = account.descuento ? {
        totalCobrado: account.total,
        descuento: account.descuento,
      } : null;
      const mixtoData = paymentMethod === 'mixto' ? {
        efectivoMixto: account.efectivoMixto || 0,
        tarjetaMixto:  account.tarjetaMixto  || 0,
      } : null;
      await api.closeAccount(account.id || account._id, paymentMethod, descuentoData, mixtoData);
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid); setBillOrder(null);
      sonidoCobro();
      showToast('Cuenta cobrada ✓');
    } catch (err) {
      showToast('Error al cobrar: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPending = async (account) => {
    setLoading(true);
    try {
      await api.markPendingPayment(account.id || account._id);
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      const isPending = account.status !== 'pending_payment';
      showToast(isPending ? 'Cuenta marcada como pago pendiente' : 'Cuenta restaurada a abierta');
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (account) => {
    setLoading(true);
    try {
      await api.deleteAccount(account.id || account._id);
      // Borrar kitchen orders asociados — buscar en la zona correcta de la cuenta
      const accountZone = account.zone || currentZone;
      let allKitchen = kitchenOrders;
      if (accountZone !== currentZone) {
        // La cuenta es de otra zona (ej: mesera bar creó en modo restaurante)
        const extraKitchen = await api.getKitchenOrders(accountZone).catch(() => []);
        allKitchen = [...kitchenOrders, ...extraKitchen];
      }
      const kitchenToDelete = allKitchen.filter(o =>
        o.mesera === account.mesera &&
        (o.table === account.table || o.barra === account.barra) &&
        o.clientName === account.clientName
      );
      await Promise.all(kitchenToDelete.map(o => api.deleteKitchenOrder(o.id).catch(() => {})));
      setKitchenOrders(prev => prev.filter(o => !kitchenToDelete.find(k => k.id === o.id)));
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      showToast('Cuenta eliminada');
    } catch (err) {
      showToast('Error al eliminar: ' + err.message, 'error');
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
      await api.updateAccount(accId, { items: remaining, total: remainTotal, editedBy: currentUser });
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
        foodItems: newItems.filter(i => i.category === 'food' || i.category === 'batido' || (i.category === 'otro' && i.kitchen)),
        drinkItems: newItems.filter(i => ['alcoholic','beverage','soda','batido'].includes(i.category)),
        status: 'open',
        createdAt: new Date(),
      });
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid);
      setSplitOrder(null);
      showToast('Cuenta separada');
    } catch (err) {
      showToast('Error al separar: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const markOrderReady = async (orderId) => {
    const order = kitchenOrders.find(o => o.id === orderId);
    if (!order || order.status === 'ready') return;
    try {
      await api.updateKitchenOrder(orderId, 'ready');
      setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
  };

  const markOrderDelivered = async (orderId) => {
    const order = kitchenOrders.find(o => o.id === orderId);
    if (!order) return;
    try {
      await api.deleteKitchenOrder(orderId);
      setKitchenOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
  };

  const barAccounts      = openAccounts.filter(a => a.zone === 'bar');
  const restAccounts     = openAccounts.filter(a => a.zone === 'restaurante');
  const barPaid          = paidOrders.filter(a => a.zone === 'bar');
  const restPaid         = paidOrders.filter(a => a.zone === 'restaurante');
  // Meseras solo ven sus propias cuentas normales (no cobros directos de otras)
  // Meseras ven todas las cuentas normales de su zona
  // Tablet Restaurante ve todas las cuentas de restaurante — incluyendo las creadas por meseras en modo restaurante
  const zoneOpenAccounts = (currentZone === 'bar' ? barAccounts : restAccounts)
    .filter(a => a.type !== 'direct');

  const handlePayRejected = async (account) => {
    // Cobrar directo una cuenta rechazada — borrar la rejected y crear cobro directo
    setLoading(true);
    try {
      await api.deleteAccount(account.id || account._id);
      // Crear cuenta tipo direct con los mismos items
      const total = (account.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
      await api.createAccount({
        id: `acc-direct-${Date.now()}`, zone: account.zone, mesera: account.mesera,
        items: account.items || [], total, type: 'direct',
        table: account.table || null, barra: account.barra || null,
        clientName: account.clientName || 'Cliente General',
        foodItems: (account.items || []).filter(i => i.category === 'food' || i.category === 'batido'),
        drinkItems: (account.items || []).filter(i => ['alcoholic','beverage','soda'].includes(i.category)),
        locationLabel: account.locationLabel || '',
        status: 'open', createdAt: new Date(),
      });
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      showToast('Cuenta lista para cobrar en caja');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleDeleteRejected = async (account) => {
    setLoading(true);
    try {
      await api.deleteAccount(account.id || account._id);
      const fresh = await api.getOpenAccounts(currentZone);
      setOpenAccounts(fresh);
      showToast('Cuenta eliminada');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleApproveAccount = async (account) => {
    setLoading(true);
    try {
      await api.approveAccount(account.id || account._id);
      const foodItems = (account.items || []).filter(i => i.category === 'food' || i.category === 'batido' || (i.category === 'otro' && i.kitchen));
      if (foodItems.length > 0) {
        await api.createKitchenOrder({
          id: `k-${Date.now()}`, zone: account.zone, mesera: account.mesera,
          items: foodItems,
          table: (account.table && account.table > 0) ? Number(account.table) : null,
          barra: account.barra || null,
          clientName: account.clientName || '',
          locationLabel: account.locationLabel || '',
          status: 'pending', createdAt: new Date()
        });
      }
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid);
      showToast('Cuenta aprobada');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleRejectAccount = async (account, reason) => {
    setLoading(true);
    try {
      await api.rejectAccount(account.id || account._id, reason);
      const [open, paid] = await Promise.all([api.getOpenAccounts(currentZone), api.getPaidAccounts(currentZone)]);
      setOpenAccounts(open); setPaidOrders(paid);
      showToast('Cuenta rechazada');
    } catch (err) { showToast('Error: ' + err.message, 'error'); }
    finally { setLoading(false); }
  };

  // ── LOGIN ─────────────────────────────────────
  if (!currentUser) {
    if (showSelector) {
      return <SelectorScreen
        isLandscape={isLandscape}
        syncError={syncError}
        loading={loading}
        adminUser={adminUser}
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

  // Guard contra renders intermedios durante logout
  if (!currentUser || !userRole || !currentZone) {
    return (
      <>
        <Toast toasts={toasts} offline={!!syncError} />
        {showSelector
          ? <SelectorScreen isLandscape={isLandscape} syncError={syncError} loading={loading} onSelect={handleSelectorLogin} onBack={() => { setShowSelector(false); setAdminUser(null); localStorage.removeItem('lore_admin'); }} />
          : <PinLoginScreen isLandscape={isLandscape} syncError={syncError} loading={loading} onLogin={loginWithPin} onShowSelector={() => setShowSelector(true)} />
        }
      </>
    );
  }

  // Guard contra renders intermedios durante logout — debe estar ANTES de todos los renders por rol
  if (!currentUser || !userRole || !currentZone) {
    return (
      <>
        <Toast toasts={toasts} offline={!!syncError} />
        {showSelector
          ? <SelectorScreen isLandscape={isLandscape} syncError={syncError} loading={loading} adminUser={adminUser} onSelect={handleSelectorLogin} onBack={() => { setShowSelector(false); setAdminUser(null); localStorage.removeItem('lore_admin'); }} />
          : <PinLoginScreen isLandscape={isLandscape} syncError={syncError} loading={loading} onLogin={loginWithPin} onShowSelector={() => setShowSelector(true)} />
        }
      </>
    );
  }

  if (userRole === 'mesera') {
    return (
      <>
        <Toast toasts={toasts} offline={!!syncError} />
        {loading && <Spinner />}
        <MeseraScreen
          currentUser={currentUser} zona={currentZone === 'bar' ? 'Bar' : 'Restaurante'}
          menu={modoRestaurante ? MENU.restaurante : (currentZone === 'bar' ? MENU.bar : MENU.restaurante)}
          licores={LICORES}
          maxTables={modoRestaurante ? 5 : (currentZone === 'bar' ? 12 : 5)}
          tables={modoRestaurante ? null : (currentZone === 'bar' ? [0,1,2,3,4,5,6,7,8,9,10,11,12] : null)}
          modoRestaurante={modoRestaurante}
          onToggleModoRestaurante={() => {
            setModoRestaurante(v => !v);
            setSelectedTable(null);
            setSelectedBarra(null);
            sessionStorage.removeItem('lore_cart'); setCartItems([]);
            setClientName('');
            setOrderType(null);
            setSelectedAccount(null);
          }}
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
          onPayRejected={handlePayRejected} onDeleteRejected={handleDeleteRejected}
          splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount}
          onModalChange={(open) => { modalOpenRef.current = open; }}
          aplicaServicio={aplicaServicio} loading={loading}
          mesaConflict={mesaConflict} setMesaConflict={setMesaConflict}
          onAddToExisting={(accountId) => {
            // Solo selecciona la cuenta — NO reemplaza el carrito
            setSelectedAccount(accountId);
            const acc = openAccounts.find(a => (a._id === accountId || a.id === accountId));
            if (acc) {
              setSelectedTable((acc.table && Number(acc.table) > 0) ? Number(acc.table) : null);
              setSelectedBarra(currentZone === 'bar' ? acc.barra : null);
              setOrderType(acc.type || 'dine-in');
            }
          }}
        />
      </>
    );
  }

  if (userRole === 'cocina') {
    return <><Toast toasts={toasts} offline={!!syncError} /><KitchenScreen kitchenOrders={kitchenOrders} loading={loading} onLogout={handleLogout} onReady={markOrderReady} onDelivered={markOrderDelivered} /></>;
  }

  if (userRole === 'caja' && currentZone === 'bar') {
    return <><Toast toasts={toasts} offline={!!syncError} /><CajaScreen zona="bar" zonaNombre="Bar" accounts={barAccounts} paid={barPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount} onLogout={handleLogout} onPay={payAccount} onDelete={handleDeleteAccount} onMarkPending={handleMarkPending} onApprove={handleApproveAccount} onReject={handleRejectAccount} /></>;
  }

  if (userRole === 'caja' && currentZone === 'restaurante') {
    return <><Toast toasts={toasts} offline={!!syncError} /><CajaScreen zona="restaurante" zonaNombre="Restaurante" accounts={restAccounts} paid={restPaid} loading={loading} billOrder={billOrder} setBillOrder={setBillOrder} viewItemsOrder={viewItemsOrder} setViewItemsOrder={setViewItemsOrder} splitOrder={splitOrder} setSplitOrder={setSplitOrder} onSplit={handleSplitAccount} onLogout={handleLogout} onPay={payAccount} onDelete={handleDeleteAccount} onMarkPending={handleMarkPending} /></>;
  }

  return <><Toast toasts={toasts} offline={!!syncError} /><AdminScreen barPaid={barPaid} restPaid={restPaid} loading={loading} onLogout={handleLogout} setPaidOrders={setPaidOrders} showToast={showToast} adminUser={adminUser} /></>;
}
