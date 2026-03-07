const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// ============ SCHEMAS ============

const accountSchema = new mongoose.Schema({
  id: String,
  zone: String,
  mesera: String,
  clientName: String,
  table: Number,
  barra: String,
  type: String,
  items: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String,
  }],
  foodItems: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String,
  }],
  drinkItems: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String,
  }],
  total: Number,
  createdAt: Date,
  lastUpdated: Date,
  status: { type: String, default: 'open' },
  closedAt: Date,
});

const kitchenOrderSchema = new mongoose.Schema({
  id: String, zone: String, mesera: String, clientName: String,
  table: Number, barra: String,
  items: [{ id: String, name: String, quantity: Number, notes: String, category: String }],
  status: { type: String, default: 'pending' },
  createdAt: Date,
});

const Account = mongoose.model('Account', accountSchema);
const KitchenOrder = mongoose.model('KitchenOrder', kitchenOrderSchema);

// ============ API ROUTES — deben ir ANTES del static ============

app.get('/api/accounts/:zone/open', async (req, res) => {
  try {
    const accounts = await Account.find({ zone: req.params.zone, status: 'open' });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/accounts/:zone/closed', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const accounts = await Account.find({ zone: req.params.zone, status: 'paid', closedAt: { $gte: today } });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const data = req.body;
    const itemsWithBy = (data.items || []).map(item => ({ ...item, addedBy: item.addedBy || data.mesera }));
    const newAccount = new Account({ ...data, items: itemsWithBy, createdAt: new Date(), lastUpdated: new Date(), status: 'open' });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/accounts/:id', async (req, res) => {
  try {
    const { items, total } = req.body;
    const account = await Account.findOne({ id: req.params.id });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    account.items = items;
    account.total = total;
    account.foodItems = items.filter(i => i.category === 'food');
    account.drinkItems = items.filter(i => i.category !== 'food');
    account.lastUpdated = new Date();
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/accounts/:id/close', async (req, res) => {
  try {
    const account = await Account.findOne({ id: req.params.id });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    account.status = 'paid';
    account.closedAt = new Date();
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/kitchen/:zone', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const orders = await KitchenOrder.find({ zone: req.params.zone, createdAt: { $gte: today }, status: { $ne: 'delivered' } });
    res.json(orders);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/kitchen', async (req, res) => {
  try {
    const newOrder = new KitchenOrder({ ...req.body, createdAt: new Date() });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/kitchen/:id', async (req, res) => {
  try {
    const order = await KitchenOrder.findOne({ id: req.params.id });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/kitchen/:id', async (req, res) => {
  try {
    await KitchenOrder.deleteOne({ id: req.params.id });
    res.json({ deleted: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/reports/:zone', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const closedAccounts = await Account.find({ zone: req.params.zone, status: 'paid', closedAt: { $gte: today } });
    const totalSales = closedAccounts.reduce((sum, acc) => sum + acc.total, 0);
    const foodTotal = closedAccounts.reduce((sum, acc) =>
      sum + acc.items.filter(i => i.category === 'food').reduce((s, i) => s + i.price * i.quantity, 0), 0);
    res.json({ zone: req.params.zone, totalSales, foodTotal, drinksTotal: totalSales - foodTotal, accountsPaid: closedAccounts.length, accounts: closedAccounts });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/health', (req, res) => {
  const publicExists = fs.existsSync(path.join(__dirname, 'public', 'index.html'));
  res.json({
    status: 'OK',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    frontend: publicExists ? 'built' : 'NOT BUILT - missing public/index.html',
    publicPath: path.join(__dirname, 'public'),
  });
});

// ── Servir frontend DESPUÉS de las rutas API ──
const publicPath = path.join(__dirname, 'public');
console.log('📁 Public path:', publicPath);
console.log('📁 Public exists:', fs.existsSync(publicPath));
console.log('📁 index.html exists:', fs.existsSync(path.join(publicPath, 'index.html')));

app.use(express.static(publicPath));

app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built', path: indexPath });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor LORE POS corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});
