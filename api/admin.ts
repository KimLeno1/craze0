import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get Admin Metrics
router.get('/metrics', async (req, res) => {
  try {
    const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
    const productsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any).count;
    const ordersCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
    const suppliersCount = (db.prepare('SELECT COUNT(*) as count FROM suppliers').get() as any).count;
    
    const totalRevenue = (db.prepare('SELECT SUM(total) as total FROM orders').get() as any).total || 0;

    res.json({
      totalUsers: usersCount,
      totalProducts: productsCount,
      totalOrders: ordersCount,
      totalRevenue,
      totalSuppliers: suppliersCount,
      activeSessions: Math.floor(Math.random() * 100) + 50, // Mocked
      systemHealth: 'OPTIMAL'
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get All Users
router.get('/users', async (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    const parsedUsers = users.map((u: any) => ({
      ...u,
      stats: JSON.parse(u.stats || '{}')
    }));
    res.json(parsedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    const parsedProducts = products.map((p: any) => ({
      ...p,
      details: JSON.parse(p.details || '[]'),
      tags: JSON.parse(p.tags || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      inStock: !!p.inStock,
      isNew: !!p.isNew,
      isHallOfFame: !!p.isHallOfFame
    }));
    res.json(parsedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get All Orders
router.get('/orders', async (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY timestamp DESC').all();
    const parsedOrders = orders.map((o: any) => ({
      ...o,
      items: JSON.parse(o.items || '[]')
    }));
    res.json(parsedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get All Suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = db.prepare('SELECT * FROM suppliers').all();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get All Promos
router.get('/promos', async (req, res) => {
  try {
    const promos = db.prepare('SELECT * FROM promos').all();
    res.json(promos);
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
});

// Get All Flash Sales
router.get('/flash-sales', async (req, res) => {
  try {
    const flashSales = db.prepare('SELECT * FROM flash_sales').all();
    const parsedFlashSales = flashSales.map((fs: any) => ({
      ...fs,
      active: !!fs.active
    }));
    res.json(parsedFlashSales);
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    res.status(500).json({ error: 'Failed to fetch flash sales' });
  }
});

// Get All Kits
router.get('/kits', async (req, res) => {
  try {
    const bundles = db.prepare('SELECT * FROM bundles').all();
    const parsedBundles = bundles.map((b: any) => ({
      ...b,
      products: JSON.parse(b.products || '[]')
    }));
    res.json(parsedBundles);
  } catch (error) {
    console.error('Error fetching kits:', error);
    res.status(500).json({ error: 'Failed to fetch kits' });
  }
});

// Get All Notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY timestamp DESC').all();
    const parsedNotifications = notifications.map((n: any) => ({
      ...n,
      read: !!n.read
    }));
    res.json(parsedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get All Pay For Me Requests
router.get('/pay-for-me', async (req, res) => {
  try {
    const requests = db.prepare('SELECT * FROM pay_for_me ORDER BY timestamp DESC').all();
    const parsedRequests = requests.map((r: any) => ({
      ...r,
      items: JSON.parse(r.items || '[]')
    }));
    res.json(parsedRequests);
  } catch (error) {
    console.error('Error fetching pay-for-me requests:', error);
    res.status(500).json({ error: 'Failed to fetch pay-for-me requests' });
  }
});

// Update Pay For Me Status
router.put('/pay-for-me/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    db.prepare('UPDATE pay_for_me SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating pay-for-me status:', error);
    res.status(500).json({ error: 'Failed to update pay-for-me status' });
  }
});

// Get All Site Settings
router.get('/settings', async (req, res) => {
  try {
    const row = db.prepare('SELECT data FROM settings WHERE id = ?').get('admin') as any;
    res.json(row ? JSON.parse(row.data) : {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update Site Setting
router.put('/settings/:key', async (req, res) => {
  const { value } = req.body;
  const key = req.params.key;
  try {
    const row = db.prepare('SELECT data FROM settings WHERE id = ?').get('admin') as any;
    const data = row ? JSON.parse(row.data) : {};
    data[key] = value;
    db.prepare('INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)').run('admin', JSON.stringify(data));
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, error: 'Failed to update setting.' });
  }
});

// Add Promo
router.post('/promos', async (req, res) => {
  const p = req.body;
  const id = p.id || `promo${Date.now()}`;
  try {
    db.prepare(`
      INSERT OR REPLACE INTO promos (id, code, type, value, description, expiresAt, usageLimit)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, p.code, p.type, p.value, p.description, p.expiresAt, p.usageLimit);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ success: false, error: 'Failed to create promo.' });
  }
});

// Add Flash Sale
router.post('/flash-sales', async (req, res) => {
  const fs = req.body;
  const id = fs.id || `fs${Date.now()}`;
  try {
    db.prepare(`
      INSERT OR REPLACE INTO flash_sales (id, name, discount, endsAt, active)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, fs.name, fs.discount, fs.endsAt, fs.active ? 1 : 0);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    res.status(500).json({ success: false, error: 'Failed to create flash sale.' });
  }
});

// Add Kit
router.post('/kits', async (req, res) => {
  const k = req.body;
  const id = k.id || `kit${Date.now()}`;
  try {
    db.prepare(`
      INSERT OR REPLACE INTO bundles (id, name, description, bundlePrice, products, expiresIn)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, k.name, k.description, k.bundlePrice, JSON.stringify(k.products || []), k.expiresIn);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating kit:', error);
    res.status(500).json({ success: false, error: 'Failed to create kit.' });
  }
});

// Update Product (Admin)
router.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    const values = fields.map(key => {
      if (Array.isArray(updates[key])) return JSON.stringify(updates[key]);
      if (typeof updates[key] === 'boolean') return updates[key] ? 1 : 0;
      return updates[key];
    });
    db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`).run(...values, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

// Update Order Status (Admin)
router.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, trackingNumber } = req.body;
  try {
    if (trackingNumber !== undefined) {
      db.prepare('UPDATE orders SET status = ?, trackingNumber = ? WHERE id = ?').run(status, trackingNumber, id);
    } else {
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status.' });
  }
});

// Update User Status (Admin)
router.put('/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

// Add Notification (Admin)
router.post('/notifications', async (req, res) => {
  const n = req.body;
  const id = `notif_${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO notifications (id, title, message, type, timestamp, recipientId, read)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, n.title, n.message, n.type, Date.now(), n.recipientId, 0);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: 'Failed to create notification.' });
  }
});

export default router;
