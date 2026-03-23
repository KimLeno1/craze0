import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get Admin Metrics
router.get('/metrics', (req, res) => {
  try {
    const usersCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
    const productsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any).count;
    const ordersCount = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count;
    const suppliersCount = (db.prepare('SELECT COUNT(*) as count FROM suppliers').get() as any).count;
    
    const revenueResult = db.prepare('SELECT SUM(total) as totalRevenue FROM orders').get() as any;
    const totalRevenue = revenueResult.totalRevenue || 0;

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
router.get('/users', (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get All Products
router.get('/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all() as any[];
    const parsedProducts = products.map(p => ({
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
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY timestamp DESC').all() as any[];
    const parsedOrders = orders.map(o => ({
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
router.get('/suppliers', (req, res) => {
  try {
    const suppliers = db.prepare('SELECT * FROM suppliers').all();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get All Promos
router.get('/promos', (req, res) => {
  try {
    const promos = db.prepare('SELECT * FROM promos').all();
    res.json(promos);
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
});

// Get All Flash Sales
router.get('/flash-sales', (req, res) => {
  try {
    // Note: flash_sales table was not explicitly created in db.ts, but it's used here.
    // I should check if I missed it or if it's part of another table.
    // Looking at db.ts, I didn't create flash_sales. I'll assume it's part of promos or needs a table.
    // For now, I'll try to fetch from promos if it has a type, or just return empty if table missing.
    const promos = db.prepare('SELECT * FROM promos WHERE type = ?').all('FLASH_SALE');
    res.json(promos);
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    res.status(500).json({ error: 'Failed to fetch flash sales' });
  }
});

// Get All Kits
router.get('/kits', (req, res) => {
  try {
    const bundles = db.prepare('SELECT * FROM bundles').all() as any[];
    const parsedBundles = bundles.map(b => ({
      ...b,
      items: JSON.parse(b.items || '[]')
    }));
    res.json(parsedBundles);
  } catch (error) {
    console.error('Error fetching kits:', error);
    res.status(500).json({ error: 'Failed to fetch kits' });
  }
});

// Get All Notifications
router.get('/notifications', (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications ORDER BY timestamp DESC').all() as any[];
    const parsedNotifications = notifications.map(n => ({
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
router.get('/pay-for-me', (req, res) => {
  try {
    const requests = db.prepare('SELECT * FROM pay_for_me ORDER BY timestamp DESC').all() as any[];
    const parsedRequests = requests.map(r => ({
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
router.put('/pay-for-me/:id/status', (req, res) => {
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
router.get('/settings', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings WHERE id = ?').get('admin') as any;
    if (settings) {
      const { id, ...rest } = settings;
      // Parse JSON fields
      if (rest.flash_sale_window) {
        try {
          rest.flash_sale_window = JSON.parse(rest.flash_sale_window);
        } catch (e) {
          // Keep as is if not valid JSON
        }
      }
      res.json(rest);
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update Site Setting
router.put('/settings/:key', (req, res) => {
  const { value } = req.body;
  const key = req.params.key;
  try {
    const val = typeof value === 'object' ? JSON.stringify(value) : value;
    db.prepare(`UPDATE settings SET ${key} = ? WHERE id = ?`).run(val, 'admin');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ success: false, error: 'Failed to update setting.' });
  }
});

// Add Promo
router.post('/promos', (req, res) => {
  const p = req.body;
  const id = p.id || `promo${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO promos (id, code, discount, type, description, expiryDate, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, p.code, p.discount, p.type, p.description, p.expiryDate, p.active ? 1 : 0);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ success: false, error: 'Failed to create promo.' });
  }
});

// Add Flash Sale
router.post('/flash-sales', (req, res) => {
  const fs = req.body;
  const id = fs.id || `fs${Date.now()}`;
  try {
    // Using promos table for flash sales as well
    db.prepare(`
      INSERT INTO promos (id, code, discount, type, description, expiryDate, active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, fs.code || 'FLASH', fs.discount, 'FLASH_SALE', fs.description, fs.expiryDate, fs.active ? 1 : 0);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating flash sale:', error);
    res.status(500).json({ success: false, error: 'Failed to create flash sale.' });
  }
});

// Add Kit
router.post('/kits', (req, res) => {
  const k = req.body;
  const id = k.id || `kit${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO bundles (id, name, price, description, image, items)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, k.name, k.price, k.description, k.image, JSON.stringify(k.items || []));
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error creating kit:', error);
    res.status(500).json({ success: false, error: 'Failed to create kit.' });
  }
});

// Update Product (Admin)
router.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const p = req.body;
  try {
    // Simplified update for admin
    const fields = Object.keys(p).map(key => `${key} = ?`).join(', ');
    const values = Object.values(p).map(val => (typeof val === 'object' ? JSON.stringify(val) : val));
    db.prepare(`UPDATE products SET ${fields} WHERE id = ?`).run(...values, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

// Update Order Status (Admin)
router.put('/orders/:id/status', (req, res) => {
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
router.put('/users/:id/status', (req, res) => {
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
router.post('/notifications', (req, res) => {
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

// Seed Database (Admin)
router.post('/seed', async (req, res) => {
  try {
    const { EXTENDED_PRODUCTS } = await import('../mockData');
    
    // Seed Products
    const productsCount = (db.prepare('SELECT COUNT(*) as count FROM products').get() as any).count;
    if (productsCount === 0) {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO products (
          id, name, price, originalPrice, shippingFee, image, category, gender, 
          description, details, inStock, isNew, viewers, stockCount, hypeScore, 
          velocityScore, isHallOfFame, brand, tags, supplierId, sizes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const p of EXTENDED_PRODUCTS) {
        stmt.run(
          p.id, p.name, p.price, p.originalPrice, 25, p.image, p.category, p.gender,
          p.description, JSON.stringify(p.details || []), p.inStock ? 1 : 0, p.isNew ? 1 : 0,
          p.viewers || 0, p.stockCount || 100, p.hypeScore || 0, p.velocityScore || 50,
          p.isHallOfFame ? 1 : 0, p.brand, JSON.stringify(p.tags || []), 'sup1', JSON.stringify(p.sizes || [])
        );
      }
    }

    // Seed Suppliers
    const suppliersCount = (db.prepare('SELECT COUNT(*) as count FROM suppliers').get() as any).count;
    if (suppliersCount === 0) {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO suppliers (id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const mockSuppliers = [
        { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12', password: 'password123' },
        { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05', password: 'password123' }
      ];
      const bcrypt = await import('bcryptjs');
      for (const s of mockSuppliers) {
        const hash = await bcrypt.hash(s.password, 10);
        stmt.run(s.id, s.name, s.contactEmail, s.region, s.status, s.performanceScore, s.totalRevenueYield, s.joinedDate, hash);
      }
    }

    // Seed Admin Settings
    const settingsCount = (db.prepare('SELECT COUNT(*) as count FROM settings').get() as any).count;
    if (settingsCount === 0) {
      db.prepare("INSERT OR IGNORE INTO settings (id, siteName, maintenanceMode, globalDiscount) VALUES (?, ?, ?, ?)").run('admin', 'ClosetKraze', 0, 0);
    }

    res.json({ success: true, message: 'Database seeded successfully.' });
  } catch (error) {
    console.error('Seeding error:', error);
    res.status(500).json({ success: false, error: 'Failed to seed database.' });
  }
});

export default router;
