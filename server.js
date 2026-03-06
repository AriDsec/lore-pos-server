const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lore:lore123@lore-pos.mongodb.net/lore-pos?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// ============ SCHEMAS ============

// Schema para Cuentas Abiertas
const accountSchema = new mongoose.Schema({
  id: String,
  zone: String, // 'bar' o 'restaurante'
  mesera: String,
  clientName: String,
  table: Number,
  barra: String,
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    category: String,
    notes: String,
    addedBy: String, // Quién agregó este item
  }],
  total: Number,
  createdAt: Date,
  lastUpdated: Date,
  status: { type: String, default: 'open' }, // 'open' o 'paid'
  closedAt: Date,
});

// Schema para Pedidos en Cocina
const kitchenOrderSchema = new mongoose.Schema({
  id: String,
  zone: String,
  mesera: String,
  clientName: String,
  table: Number,
  barra: String,
  items: [{
    id: String,
    name: String,
    quantity: Number,
    notes: String,
    category: String,
  }],
  status: { type: String, default: 'pending' }, // 'pending', 'ready', 'delivered'
  createdAt: Date,
});

const Account = mongoose.model('Account', accountSchema);
const KitchenOrder = mongoose.model('KitchenOrder', kitchenOrderSchema);

// ============ RUTAS - CUENTAS ============

// GET: Obtener todas las cuentas abiertas de una zona
app.get('/api/accounts/:zone/open', async (req, res) => {
  try {
    const { zone } = req.params;
    const accounts = await Account.find({ zone, status: 'open' });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener todas las cuentas pagadas de una zona
app.get('/api/accounts/:zone/closed', async (req, res) => {
  try {
    const { zone } = req.params;
    const accounts = await Account.find({ zone, status: 'paid' });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener una cuenta específica
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const account = await Account.findOne({ id: req.params.id });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear nueva cuenta
app.post('/api/accounts', async (req, res) => {
  try {
    const { id, zone, mesera, clientName, table, barra, items, total } = req.body;
    
    // Agregar mesera a cada item si no la tiene
    const itemsWithMesera = items.map(item => ({
      ...item,
      addedBy: item.addedBy || mesera,
    }));

    const newAccount = new Account({
      id,
      zone,
      mesera,
      clientName,
      table,
      barra,
      items: itemsWithMesera,
      total,
      createdAt: new Date(),
      lastUpdated: new Date(),
      status: 'open',
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Editar cuenta (agregar items)
app.put('/api/accounts/:id', async (req, res) => {
  try {
    const { items, total } = req.body;
    
    const account = await Account.findOne({ id: req.params.id });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    // Agregar nuevos items
    account.items.push(...items);
    account.total = total;
    account.lastUpdated = new Date();

    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Cobrar cuenta (cerrar)
app.post('/api/accounts/:id/close', async (req, res) => {
  try {
    const account = await Account.findOne({ id: req.params.id });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });

    account.status = 'paid';
    account.closedAt = new Date();
    await account.save();

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS - COCINA ============

// GET: Obtener pedidos de cocina por zona
app.get('/api/kitchen/:zone', async (req, res) => {
  try {
    const { zone } = req.params;
    const orders = await KitchenOrder.find({ zone });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear pedido de cocina
app.post('/api/kitchen', async (req, res) => {
  try {
    const { id, zone, mesera, clientName, table, barra, items } = req.body;

    const newOrder = new KitchenOrder({
      id,
      zone,
      mesera,
      clientName,
      table,
      barra,
      items,
      status: 'pending',
      createdAt: new Date(),
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Actualizar estado de pedido (pending -> ready -> delivered)
app.put('/api/kitchen/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await KitchenOrder.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Eliminar pedido de cocina
app.delete('/api/kitchen/:id', async (req, res) => {
  try {
    const result = await KitchenOrder.deleteOne({ id: req.params.id });
    res.json({ deleted: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS - REPORTES ============

// GET: Obtener reportes del día
app.get('/api/reports/:zone', async (req, res) => {
  try {
    const { zone } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const closedAccounts = await Account.find({
      zone,
      status: 'paid',
      closedAt: { $gte: today },
    });

    const totalSales = closedAccounts.reduce((sum, acc) => sum + acc.total, 0);
    const foodTotal = closedAccounts.reduce((sum, acc) => {
      const food = acc.items
        .filter(item => item.category === 'food')
        .reduce((s, item) => s + (item.price * item.quantity), 0);
      return sum + food;
    }, 0);
    const drinksTotal = totalSales - foodTotal;

    res.json({
      zone,
      totalSales,
      foodTotal,
      drinksTotal,
      accountsPaid: closedAccounts.length,
      accounts: closedAccounts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ HEALTH CHECK ============
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '✅ Servidor funcionando' });
});

// ============ PUERTO ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor LORE POS corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});
