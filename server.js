const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'lore-pos-secret-fallback';

const sanitizeStr = (val, maxLen = 200) => {
  if (val === null || val === undefined) return null;
  return String(val).trim().slice(0, maxLen).replace(/[${}[\]]/g, '');
};
const sanitizeNum = (val, fallback = null) => {
  const n = Number(val);
  return isFinite(n) ? n : fallback;
};
const sanitizeStatus = (val, allowed, fallback) =>
  allowed.includes(val) ? val : fallback;

const app = express();
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2000,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: false,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' },
});
const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: false,
  message: { error: 'Demasiadas solicitudes de escritura, intenta más tarde.' },
});
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: false,
  message: { error: 'Demasiadas solicitudes administrativas, intenta más tarde.' },
});

app.use('/api', (req, res, next) => {
  if (req.path === '/auth/login') return next(); // login sin rate limit
  return generalLimiter(req, res, next);
});
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 10000,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('✅ Connected to MongoDB'));

// ── PINs de acceso — fuente de verdad en servidor ──
const PINES_SERVER = {
  'Caja Bar':        { pin: '1970', role: 'caja',   zone: 'bar' },
  'Caja Restaurante':{ pin: '1969', role: 'caja',   zone: 'restaurante' },
  'Mari':            { pin: '5456', role: 'mesera', zone: 'bar' },
  'Mile':            { pin: '8995', role: 'mesera', zone: 'bar' },
  'Lin':             { pin: '7777', role: 'mesera', zone: 'bar' },
  'Temp Bar':        { pin: '1221', role: 'mesera', zone: 'bar' },
  'Guido':           { pin: '0000', role: 'admin',  zone: 'admin' },
  'Lindsey':         { pin: '1324', role: 'admin',  zone: 'admin' },
  'Ariel':           { pin: '3306', role: 'admin',  zone: 'admin' },
  'Aaron':           { pin: '7878', role: 'admin',  zone: 'admin' },
};

// ── Middleware de autenticación ──
const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// ============ SCHEMAS ============
const accountSchema = new mongoose.Schema({
  id: String,
  zone: String,
  mesera: String,
  lastEditedBy: String,
  approvedAt: Date,
  rejectedReason: String,
  rejectedAt: Date,
  clientName: String,
  table: Number,
  barra: String,
  type: String,
  items: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String, breakdown: mongoose.Schema.Types.Mixed, kitchen: Boolean, conServicio: Boolean,
  }],
  foodItems: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String, breakdown: mongoose.Schema.Types.Mixed, kitchen: Boolean, conServicio: Boolean,
  }],
  drinkItems: [{
    id: String, name: String, price: Number, quantity: Number,
    category: String, notes: String, addedBy: String, breakdown: mongoose.Schema.Types.Mixed, kitchen: Boolean, conServicio: Boolean,
  }],
  total: Number,
  totalOriginal: Number,
  descuento: { type: Number, default: 0 },
  efectivoMixto: Number,
  tarjetaMixto: Number,
  createdAt: Date,
  lastUpdated: Date,
  status: { type: String, default: 'open' },
  pendingNote: String,
  closedAt: Date,
  paymentMethod: { type: String, default: 'efectivo' },
  locationLabel: String,
});

const kitchenOrderSchema = new mongoose.Schema({
  id: String, zone: String, mesera: String, clientName: String,
  table: Number, barra: String, locationLabel: String,
  items: [{ id: String, name: String, quantity: Number, notes: String, category: String, esNuevo: Boolean }],
  status: { type: String, default: 'pending' },
  createdAt: Date,
  esActualizacion: { type: Boolean, default: false },
});

// Índices para acelerar las queries más frecuentes
accountSchema.index({ zone: 1, status: 1 });
accountSchema.index({ zone: 1, status: 1, closedAt: 1 });
kitchenOrderSchema.index({ zone: 1, status: 1 });

const Account = mongoose.model('Account', accountSchema);
const KitchenOrder = mongoose.model('KitchenOrder', kitchenOrderSchema);

const accessLogSchema = new mongoose.Schema({
  user:      { type: String, required: true },
  pin:       { type: String, required: true },
  action:    { type: String, default: 'login' },
  selected:  { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});
const AccessLog = mongoose.model('AccessLog', accessLogSchema);

const configSchema = new mongoose.Schema({
  key:   { type: String, unique: true, required: true },
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now },
});
const Config = mongoose.model('Config', configSchema);

const dailyReportSchema = new mongoose.Schema({
  fecha:    { type: String, required: true }, // 'YYYY-MM-DD'
  zona:     { type: String, required: true }, // 'bar' | 'restaurante'
  totalVendido:    { type: Number, default: 0 },
  cuentasCobradas: { type: Number, default: 0 },
  porMetodo: {
    efectivo: { type: Number, default: 0 },
    sinpe:    { type: Number, default: 0 },
    tarjeta:  { type: Number, default: 0 },
    mixto:    { type: Number, default: 0 },
  },
  porMesera: { type: mongoose.Schema.Types.Mixed, default: {} },
  creadoEn: { type: Date, default: Date.now },
});
const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

// ── Endpoint de login — fuera del rate limiter general ──
app.post('/api/auth/login', async (req, res) => {
  try {
    const { pin } = req.body;
    console.log('LOGIN REQUEST - pin recibido:', pin ? 'si' : 'no');
    if (!pin) return res.status(400).json({ error: 'PIN requerido' });

    const perfilesConfig = await Config.findOne({ key: 'meseras_perfiles' });
    console.log('perfiles encontrados:', perfilesConfig ? 'si' : 'no');
    const perfiles = perfilesConfig?.value || {};

    let nombre = null, role = null, zone = null;
    for (const [slot, perfil] of Object.entries(perfiles)) {
      if (perfil.pin === pin && PINES_SERVER[slot]) {
        nombre = perfil.nombre || slot;
        role = PINES_SERVER[slot].role;
        zone = PINES_SERVER[slot].zone;
        break;
      }
    }

    if (!nombre) {
      for (const [name, data] of Object.entries(PINES_SERVER)) {
        if (data.pin === pin) {
          nombre = name; role = data.role; zone = data.zone; break;
        }
      }
    }

    console.log('LOGIN ATTEMPT - nombre:', nombre, 'role:', role);
    if (!nombre) { console.log('PIN no encontrado'); return res.status(401).json({ error: 'PIN incorrecto' }); }

    const token = jwt.sign({ name: nombre, role, zone }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, name: nombre, role, zone });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// ============ API ROUTES ============
app.get('/api/accounts/:zone/open', requireAuth, async (req, res) => {
  try {
    const accounts = await Account.find({ zone: req.params.zone, status: { $in: ['open', 'pending_payment', 'pending_approval', 'rejected'] } }).sort({ createdAt: 1 });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/accounts/:zone/closed', requireAuth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const accounts = await Account.find({ zone: req.params.zone, status: 'paid', closedAt: { $gte: today } });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/accounts', requireAuth, writeLimiter, async (req, res) => {
  try {
    const data = req.body;
    if (data.id) {
      const existing = await Account.findOne({ id: sanitizeStr(data.id, 100) });
      if (existing) return res.json(existing);
    }
    const itemsWithBy = (data.items || []).map(item => ({
      ...item,
      name: sanitizeStr(item.name, 100),
      notes: sanitizeStr(item.notes, 200),
      addedBy: sanitizeStr(item.addedBy || data.mesera, 50),
      price: sanitizeNum(item.price, 0),
      quantity: sanitizeNum(item.quantity, 1),
    }));
    const newAccount = new Account({
      ...data,
      mesera: sanitizeStr(data.mesera, 50),
      clientName: sanitizeStr(data.clientName, 100),
      zone: sanitizeStatus(data.zone, ['bar','restaurante'], 'bar'),
      table: sanitizeNum(data.table, null),
      barra: sanitizeStr(data.barra, 50),
      items: itemsWithBy,
      createdAt: new Date(), lastUpdated: new Date(),
      status: sanitizeStatus(data.status, ['open', 'pending_approval'], 'open')
    });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/accounts/:id', requireAuth, writeLimiter, async (req, res) => {
  try {
    const { items, total } = req.body;
    const account = await Account.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    account.items = items;
    account.total = total;
    account.foodItems = items.filter(i => i.category === 'food');
    account.drinkItems = items.filter(i => i.category !== 'food');
    account.lastUpdated = new Date();
    if (req.body.editedBy) account.lastEditedBy = sanitizeStr(req.body.editedBy, 50);
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/accounts/:id/close', requireAuth, writeLimiter, async (req, res) => {
  try {
    const account = await Account.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    if (account.status === 'paid') return res.json(account);
    account.status = 'paid';
    account.closedAt = new Date();
    const allowedMethods = ['efectivo','sinpe','tarjeta','mixto','efectivo_sinpe','tarjeta_sinpe'];
    account.paymentMethod = sanitizeStatus(req.body.paymentMethod, allowedMethods, 'efectivo');
    if (['mixto', 'efectivo_sinpe', 'tarjeta_sinpe'].includes(account.paymentMethod)) {
      account.efectivoMixto = sanitizeNum(req.body.efectivoMixto, 0);
      account.tarjetaMixto  = sanitizeNum(req.body.tarjetaMixto, 0);
    }
    if (req.body.totalCobrado !== undefined) {
      account.totalOriginal = account.total;
      account.total = sanitizeNum(req.body.totalCobrado, account.total);
      account.descuento = sanitizeNum(req.body.descuento, 0);
    }
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/kitchen/:zone', requireAuth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const orders = await KitchenOrder.find({ zone: req.params.zone, createdAt: { $gte: today }, status: { $ne: 'delivered' } });
    res.json(orders);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/kitchen', requireAuth, writeLimiter, async (req, res) => {
  try {
    const newOrder = new KitchenOrder({ ...req.body, createdAt: new Date() });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/kitchen/:id', async (req, res) => {
  try {
    const order = await KitchenOrder.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    order.status = sanitizeStatus(req.body.status, ['pending','ready','delivered'], order.status);
    await order.save();
    res.json(order);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/accounts/:id', requireAuth, async (req, res) => {
  try {
    await Account.deleteOne({ id: sanitizeStr(req.params.id, 100) });
    res.json({ deleted: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/kitchen/:id', requireAuth, async (req, res) => {
  try {
    await KitchenOrder.deleteOne({ id: sanitizeStr(req.params.id, 100) });
    res.json({ deleted: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/accounts/:id/approve', writeLimiter, async (req, res) => {
  try {
    const account = await Account.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    if (account.status !== 'pending_approval') return res.json(account);
    account.status = 'open';
    account.approvedAt = new Date();
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/accounts/:id/reject', writeLimiter, async (req, res) => {
  try {
    const account = await Account.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    if (account.status !== 'pending_approval') return res.status(400).json({ error: 'Solo se pueden rechazar cuentas pendientes' });
    account.status = 'rejected';
    account.rejectedReason = sanitizeStr(req.body.reason || 'Sin motivo', 200);
    account.rejectedAt = new Date();
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.put('/api/accounts/:id/pending', async (req, res) => {
  try {
    const account = await Account.findOne({ id: sanitizeStr(req.params.id, 100) });
    if (!account) return res.status(404).json({ error: 'Cuenta no encontrada' });
    if (!['open', 'pending_payment'].includes(account.status)) return res.status(400).json({ error: 'No se puede cambiar estado de esta cuenta' });
    account.status = account.status === 'pending_payment' ? 'open' : 'pending_payment';
    account.pendingNote = sanitizeStr(req.body.note || '', 100);
    await account.save();
    res.json(account);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ── Helper: generar reporte diario desde cuentas pagadas ──
async function generarReporte(zona) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const cuentas = await Account.find({ zone: zona, status: 'paid', closedAt: { $gte: today } });
  const fecha = today.toISOString().split('T')[0];
  const porMetodo = { efectivo: 0, sinpe: 0, tarjeta: 0, mixto: 0 };
  const porMesera = {};
  let totalVendido = 0;
  cuentas.forEach(c => {
    totalVendido += c.total || 0;
    const m = c.paymentMethod || 'efectivo';
    const key = ['sinpe','tarjeta','mixto'].includes(m) ? m : 'efectivo';
    porMetodo[key] = (porMetodo[key] || 0) + (c.total || 0);
    if (c.mesera) porMesera[c.mesera] = (porMesera[c.mesera] || 0) + (c.total || 0);
  });
  if (cuentas.length > 0) {
    await DailyReport.findOneAndUpdate(
      { fecha, zona },
      { fecha, zona, totalVendido, cuentasCobradas: cuentas.length, porMetodo, porMesera, creadoEn: new Date() },
      { upsert: true }
    );
  }
}

app.delete('/api/admin/clear-bar', adminLimiter, async (req, res) => {
  try {
    await generarReporte('bar');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const accounts = await Account.deleteMany({ zone: 'bar', $or: [{ status: 'paid', closedAt: { $gte: today } }, { status: 'rejected', createdAt: { $gte: today } }] });
    const kitchen = await KitchenOrder.deleteMany({ zone: 'bar', createdAt: { $gte: today } });
    res.json({ deleted: accounts.deletedCount, kitchen: kitchen.deletedCount });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/admin/clear-restaurante', adminLimiter, async (req, res) => {
  try {
    await generarReporte('restaurante');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const accounts = await Account.deleteMany({ zone: 'restaurante', $or: [{ status: 'paid', closedAt: { $gte: today } }, { status: 'rejected', createdAt: { $gte: today } }] });
    const kitchen = await KitchenOrder.deleteMany({ zone: 'restaurante', createdAt: { $gte: today } });
    res.json({ deleted: accounts.deletedCount, kitchen: kitchen.deletedCount });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/admin/clear-day', adminLimiter, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await Account.deleteMany({ status: { $in: ['paid', 'rejected'] }, $or: [{ closedAt: { $gte: today } }, { status: 'rejected', createdAt: { $gte: today } }] });
    const kitchenResult = await KitchenOrder.deleteMany({ createdAt: { $gte: today } });
    res.json({ deleted: result.deletedCount, kitchen: kitchenResult.deletedCount });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/access-log', async (req, res) => {
  try {
    const { user, pin, action, selected } = req.body;
    const log = await AccessLog.create({ user, pin, action: action || 'login', selected: selected || null });
    res.json(log);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/access-log', async (req, res) => {
  try {
    const logs = await AccessLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/config/:key', async (req, res) => {
  try {
    const doc = await Config.findOne({ key: sanitizeStr(req.params.key, 50) });
    res.json(doc ? { value: doc.value } : { value: null });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/config/:key', adminLimiter, async (req, res) => {
  try {
    const { value } = req.body;
    const doc = await Config.findOneAndUpdate(
      { key: sanitizeStr(req.params.key, 50) },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(doc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Reportes históricos ──
app.get('/api/reports/history', async (req, res) => {
  try {
    const reports = await DailyReport.find().sort({ fecha: -1 }).limit(90);
    res.json(reports);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Limpieza de datos viejos (más de 30 días) — solo paid/rejected, nunca pending ──
app.delete('/api/admin/clean-old', adminLimiter, async (req, res) => {
  try {
    const treintaDias = new Date();
    treintaDias.setDate(treintaDias.getDate() - 30);
    const result = await Account.deleteMany({
      status: { $in: ['paid', 'rejected'] },
      createdAt: { $lt: treintaDias }
    });
    res.json({ deleted: result.deletedCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
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

const publicPath = path.join(__dirname, 'public');
console.log('📁 Public path:', publicPath);
console.log('📁 Public exists:', fs.existsSync(publicPath));
console.log('📁 index.html exists:', fs.existsSync(path.join(publicPath, 'index.html')));

app.get('/api/reports/:zone', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const accounts = await Account.find({ zone: req.params.zone, status: 'paid', closedAt: { $gte: today } });
    res.json(accounts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

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
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor LORE POS corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});
