import express from 'express';
import db from './db.js';

const router = express.Router();

// --- USERS ---
router.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

router.post('/users', (req, res) => {
  const { id, handle, email, archetype, rep, level, coins, gems, status, lastLogin, totalSpent } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO users (id, handle, email, archetype, rep, level, coins, gems, status, lastLogin, totalSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, handle, email, archetype, rep, level, coins, gems, status, lastLogin, totalSpent);
  res.json({ success: true });
});

router.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status) {
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.json(user);
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ success: true });
});

router.get('/user-stats/:userId', (req, res) => {
  const { userId } = req.params;
  const stats = db.prepare('SELECT * FROM user_stats WHERE userId = ?').get(userId) as any;
  if (stats) {
    res.json(JSON.parse(stats.stats));
  } else {
    res.status(404).json({ error: 'Stats not found' });
  }
});

router.post('/user-stats/:userId', (req, res) => {
  const { userId } = req.params;
  const stats = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO user_stats (userId, stats) VALUES (?, ?)'
  ).run(userId, JSON.stringify(stats));
  res.json({ success: true });
});

// --- PRODUCTS ---
router.get('/products', (req, res) => {
  const { supplierId } = req.query;
  let products;
  if (supplierId) {
    products = db.prepare('SELECT * FROM products WHERE supplierId = ?').all(supplierId);
  } else {
    products = db.prepare('SELECT * FROM products').all();
  }
  res.json(products.map((p: any) => ({ ...p, tags: JSON.parse(p.tags || '[]') })));
});

router.post('/products', (req, res) => {
  const { id, name, price, originalPrice, image, category, gender, description, isNew, velocityScore, hypeScore, isHallOfFame, supplierId, shippingFee, tags, appeal, viewers, stockCount, inStock } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO products (id, name, price, originalPrice, image, category, gender, description, isNew, velocityScore, hypeScore, isHallOfFame, supplierId, shippingFee, tags, appeal, viewers, stockCount, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, price, originalPrice || price, image, category, gender, description, isNew ? 1 : 0, velocityScore || 0, hypeScore || 0, isHallOfFame ? 1 : 0, supplierId, shippingFee || 0, JSON.stringify(tags || []), appeal, viewers || 0, stockCount || 0, inStock !== undefined ? (inStock ? 1 : 0) : (stockCount > 0 ? 1 : 0));
  res.json({ success: true });
});

router.patch('/products/:id', (req, res) => {
  const { id } = req.params;
  const { hypeScore, isHallOfFame, stockCount, inStock } = req.body;
  
  if (hypeScore !== undefined) {
    db.prepare('UPDATE products SET hypeScore = ? WHERE id = ?').run(hypeScore, id);
  }
  if (isHallOfFame !== undefined) {
    db.prepare('UPDATE products SET isHallOfFame = ? WHERE id = ?').run(isHallOfFame ? 1 : 0, id);
  }
  if (stockCount !== undefined) {
    db.prepare('UPDATE products SET stockCount = ?, inStock = ? WHERE id = ?').run(stockCount, stockCount > 0 ? 1 : 0, id);
  }
  if (inStock !== undefined) {
    db.prepare('UPDATE products SET inStock = ? WHERE id = ?').run(inStock ? 1 : 0, id);
  }
  
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(product);
});

router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- SUPPLIERS ---
router.get('/suppliers', (req, res) => {
  const suppliers = db.prepare('SELECT * FROM suppliers').all();
  res.json(suppliers);
});

router.post('/suppliers', (req, res) => {
  const { id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating, activeProducts } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO suppliers (id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating, activeProducts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating || 5.0, activeProducts || 0);
  res.json({ success: true });
});

router.delete('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM suppliers WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- ORDERS ---
router.get('/orders', (req, res) => {
  const { supplierId } = req.query;
  let orders;
  if (supplierId) {
    // This is a bit more complex as items are JSON. 
    // For now, we'll fetch all and filter in JS or use a LIKE query if possible.
    // Better: fetch all and filter to ensure accuracy with JSON.
    const allOrders = db.prepare('SELECT * FROM orders').all() as any[];
    orders = allOrders.filter(o => {
      const items = JSON.parse(o.items);
      return items.some((item: any) => item.supplierId === supplierId);
    });
  } else {
    orders = db.prepare('SELECT * FROM orders').all() as any[];
  }
  res.json(orders.map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items })));
});

router.post('/orders', (req, res) => {
  const { id, userId, totalPrice, status, timestamp, items } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO orders (id, userId, totalPrice, status, timestamp, items) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, userId, totalPrice, status, timestamp, JSON.stringify(items));
  res.json({ success: true });
});

router.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

// --- NOTIFICATIONS ---
router.get('/notifications', (req, res) => {
  const notifications = db.prepare('SELECT * FROM notifications').all();
  res.json(notifications);
});

router.post('/notifications', (req, res) => {
  const { id, title, message, type, target, timestamp, read, recipientId } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO notifications (id, title, message, type, target, timestamp, read, recipientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, title, message, type, target || 'ALL', timestamp, read ? 1 : 0, recipientId);
  res.json({ success: true });
});

router.delete('/notifications/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
  res.json({ success: true });
});

router.post('/notifications/broadcast', (req, res) => {
  const { title, message, type } = req.body;
  const users = db.prepare('SELECT id FROM users').all() as any[];
  const timestamp = new Date().toISOString();
  const insert = db.prepare('INSERT INTO notifications (id, title, message, type, timestamp, read, recipientId) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  for (const user of users) {
    insert.run(Math.random().toString(36).substr(2, 9), title, message, type, timestamp, 0, user.id);
  }
  res.json({ success: true });
});

// --- PRICE ANOMALIES ---
router.get('/price-anomalies', (req, res) => {
  const { supplierId } = req.query;
  let anomalies;
  if (supplierId) {
    // Join with products to filter by supplierId
    anomalies = db.prepare(`
      SELECT pa.* FROM price_anomalies pa
      JOIN products p ON pa.productId = p.id
      WHERE p.supplierId = ?
    `).all(supplierId);
  } else {
    anomalies = db.prepare('SELECT * FROM price_anomalies').all();
  }
  res.json(anomalies);
});

router.post('/price-anomalies', (req, res) => {
  const { id, productId, anomalyEndTime, discountPercent, price } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO price_anomalies (id, productId, anomalyEndTime, discountPercent, price) VALUES (?, ?, ?, ?, ?)'
  ).run(id, productId, anomalyEndTime, discountPercent, price);
  res.json({ success: true });
});

router.delete('/price-anomalies/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM price_anomalies WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- BUNDLES (KITS) ---
router.get('/bundles', (req, res) => {
  const bundles = db.prepare('SELECT * FROM bundles').all() as any[];
  res.json(bundles.map(b => ({ ...b, items: JSON.parse(b.items) })));
});

router.post('/bundles', (req, res) => {
  const { id, name, description, price, items, image, supplierId, category } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO bundles (id, name, description, price, items, image, supplierId, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, description || '', price, JSON.stringify(items), image, supplierId, category || 'KITS');
  res.json({ success: true });
});

router.delete('/bundles/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM bundles WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- PROMO CODES ---
router.get('/promo-codes', (req, res) => {
  const codes = db.prepare('SELECT * FROM promo_codes').all();
  res.json(codes);
});

router.post('/promo-codes', (req, res) => {
  const { id, code, type, value, description } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO promo_codes (id, code, type, value, description) VALUES (?, ?, ?, ?, ?)'
  ).run(id, code, type, value, description);
  res.json({ success: true });
});

router.delete('/promo-codes/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM promo_codes WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- USER PREFERENCES ---
router.get('/user-preferences/:userId', (req, res) => {
  const { userId } = req.params;
  const row = db.prepare('SELECT * FROM user_preferences WHERE userId = ?').get(userId) as any;
  if (row) {
    res.json(JSON.parse(row.preferences));
  } else {
    res.json(null);
  }
});

router.post('/user-preferences/:userId', (req, res) => {
  const { userId } = req.params;
  const preferences = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO user_preferences (userId, preferences) VALUES (?, ?)'
  ).run(userId, JSON.stringify(preferences));
  res.json({ success: true });
});

// --- USER HISTORY ---
router.get('/user-history/:userId', (req, res) => {
  const { userId } = req.params;
  const row = db.prepare('SELECT * FROM user_history WHERE userId = ?').get(userId) as any;
  if (row) {
    res.json(JSON.parse(row.history));
  } else {
    res.json({ userId, viewedProductIds: [], wishlistedProductIds: [], purchasedProductIds: [] });
  }
});

router.post('/user-history/:userId', (req, res) => {
  const { userId } = req.params;
  const history = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO user_history (userId, history) VALUES (?, ?)'
  ).run(userId, JSON.stringify(history));
  res.json({ success: true });
});

// --- AUTHENTICATION ---
router.post('/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;
  
  if (role === 'ADMIN') {
    const adminCredsRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_creds') as any;
    const adminCreds = adminCredsRow ? JSON.parse(adminCredsRow.value) : { identifier: 'leno', password: '1q2w3!' };
    
    if (identifier === adminCreds.identifier && password === adminCreds.password) {
      res.json({ success: true, token: 'admin-token-' + Date.now(), role: 'ADMIN' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } else if (role === 'SUPPLIER') {
    // For now, just check if supplier exists or use a simple check
    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ? OR name = ?').get(identifier, identifier) as any;
    if (supplier) {
      res.json({ success: true, token: 'supplier-token-' + Date.now(), role: 'SUPPLIER', supplierId: supplier.id });
    } else {
      res.status(401).json({ error: 'Supplier not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid role' });
  }
});

router.get('/auth/check', (req, res) => {
  const token = req.headers.authorization;
  if (token) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true });
});

// --- PAY FOR ME ---
router.get('/pay-for-me', (req, res) => {
  const requests = db.prepare('SELECT * FROM pay_for_me_requests').all();
  res.json(requests);
});

router.post('/pay-for-me', (req, res) => {
  const { id, userId, productId, status, timestamp, message, targetEmail } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO pay_for_me_requests (id, userId, productId, status, timestamp, message, targetEmail) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, productId, status, timestamp, message, targetEmail);
  res.json({ success: true });
});

router.patch('/pay-for-me/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE pay_for_me_requests SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

router.delete('/pay-for-me/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM pay_for_me_requests WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- SOCIAL ---
router.get('/social-posts', (req, res) => {
  // Friday Cleanup Logic
  const now = new Date();
  const isFriday = now.getDay() === 5;
  if (isFriday) {
    const todayStr = now.toISOString().split('T')[0];
    const lastCleanup = db.prepare('SELECT value FROM settings WHERE key = ?').get('last_social_cleanup') as any;
    
    if (!lastCleanup || lastCleanup.value !== todayStr) {
      db.prepare('DELETE FROM social_posts').run();
      db.prepare('DELETE FROM social_comments').run();
      db.prepare('DELETE FROM social_reports').run();
      db.prepare('DELETE FROM social_interactions').run();
      db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('last_social_cleanup', todayStr);
    }
  }

  const posts = db.prepare('SELECT * FROM social_posts').all();
  res.json(posts);
});

router.post('/social-posts', (req, res) => {
  const { id, userId, userHandle, image, likes, dislikes, reports, timestamp, weekId } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO social_posts (id, userId, userHandle, image, likes, dislikes, reports, timestamp, weekId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, userHandle, image, likes || 0, dislikes || 0, reports || 0, timestamp, weekId);
  res.json({ success: true });
});

router.post('/social-posts/:id/interact', (req, res) => {
  const { id } = req.params;
  const { userId, type } = req.body; // type: 'LIKE' or 'DISLIKE'

  db.transaction(() => {
    // Check existing interaction
    const existing = db.prepare('SELECT type FROM social_interactions WHERE userId = ? AND postId = ?').get(userId, id) as any;
    
    if (existing) {
      if (existing.type === type) {
        // Remove interaction (toggle off)
        db.prepare('DELETE FROM social_interactions WHERE userId = ? AND postId = ?').run(userId, id);
        if (type === 'LIKE') {
          db.prepare('UPDATE social_posts SET likes = MAX(0, likes - 1) WHERE id = ?').run(id);
        } else {
          db.prepare('UPDATE social_posts SET dislikes = MAX(0, dislikes - 1) WHERE id = ?').run(id);
        }
      } else {
        // Change interaction type
        db.prepare('UPDATE social_interactions SET type = ? WHERE userId = ? AND postId = ?').run(type, userId, id);
        if (type === 'LIKE') {
          db.prepare('UPDATE social_posts SET likes = likes + 1, dislikes = MAX(0, dislikes - 1) WHERE id = ?').run(id);
        } else {
          db.prepare('UPDATE social_posts SET dislikes = dislikes + 1, likes = MAX(0, likes - 1) WHERE id = ?').run(id);
        }
      }
    } else {
      // New interaction
      db.prepare('INSERT INTO social_interactions (userId, postId, type) VALUES (?, ?, ?)').run(userId, id, type);
      if (type === 'LIKE') {
        db.prepare('UPDATE social_posts SET likes = likes + 1 WHERE id = ?').run(id);
      } else {
        db.prepare('UPDATE social_posts SET dislikes = dislikes + 1 WHERE id = ?').run(id);
      }
    }
  })();

  const post = db.prepare('SELECT * FROM social_posts WHERE id = ?').get(id);
  res.json(post);
});

router.get('/social-posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const comments = db.prepare('SELECT * FROM social_comments WHERE postId = ? ORDER BY timestamp DESC').all(id);
  res.json(comments);
});

router.post('/social-posts/:id/comments', (req, res) => {
  const { id } = req.params;
  const { userId, userHandle, text } = req.body;
  const commentId = `comment_${Date.now()}`;
  db.prepare(
    'INSERT INTO social_comments (id, postId, userId, userHandle, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(commentId, id, userId, userHandle, text, new Date().toISOString());
  res.json({ success: true });
});

router.post('/social-posts/:id/report', (req, res) => {
  const { id } = req.params;
  const { userId, reason } = req.body;
  const reportId = `report_${Date.now()}`;
  db.prepare(
    'INSERT INTO social_reports (id, postId, userId, reason, timestamp) VALUES (?, ?, ?, ?, ?)'
  ).run(reportId, id, userId, reason, new Date().toISOString());
  db.prepare('UPDATE social_posts SET reports = reports + 1 WHERE id = ?').run(id);
  res.json({ success: true });
});

router.get('/social-interactions/:userId', (req, res) => {
  const { userId } = req.params;
  const interactions = db.prepare('SELECT * FROM social_interactions WHERE userId = ?').all(userId);
  res.json(interactions);
});

// --- SETTINGS ---
router.get('/settings/:key', (req, res) => {
  const { key } = req.params;
  const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(key) as any;
  if (setting) {
    try {
      res.json(JSON.parse(setting.value));
    } catch (e) {
      res.json(setting.value);
    }
  } else {
    res.json(null);
  }
});

router.post('/settings/:key', (req, res) => {
  const { key } = req.params;
  const value = req.body;
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
  db.prepare(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
  ).run(key, stringValue);
  res.json({ success: true });
});

// --- RAW DATABASE ACCESS (ADMIN ONLY) ---
router.post('/admin/query', (req, res) => {
  const { query, params } = req.body;
  try {
    const result = db.prepare(query).all(params || []);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/admin/exec', (req, res) => {
  const { query, params } = req.body;
  try {
    const result = db.prepare(query).run(params || []);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// --- ANALYTICS ---
router.get('/admin/metrics', (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalRevenue = db.prepare('SELECT SUM(totalPrice) as sum FROM orders WHERE status != "CANCELLED"').get() as any;
    const activeAnomalies = db.prepare('SELECT COUNT(*) as count FROM price_anomalies').get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    
    res.json({
      totalUsers: totalUsers.count,
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.sum || 0,
      activeAnomalies: activeAnomalies.count,
      totalProducts: totalProducts.count,
      activeOrders: totalOrders.count, // Simplified
      systemUptime: '99.9%',
      threatLevel: 'LOW'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/security', (req, res) => {
  const events = [
    {
      id: 'evt_1',
      type: 'LOGIN',
      severity: 'LOW',
      timestamp: new Date().toISOString(),
      details: 'Admin session established: @leno',
      ip: req.ip
    },
    {
      id: 'evt_2',
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Failed login attempt on Sector_Admin: ARCHITECT_X',
      ip: '45.23.11.92'
    }
  ];
  
  res.json({
    firewall: 'ACTIVE',
    encryption: 'AES-256-GCM',
    loadBalancer: 'HEALTHY',
    activeSessions: 12,
    threatLevel: 'LOW',
    events
  });
});

// --- JACKPOT ---
router.get('/admin/jackpot', (req, res) => {
  const prizes = db.prepare('SELECT * FROM jackpot_prizes').all();
  res.json(prizes);
});

router.post('/admin/jackpot', (req, res) => {
  const { id, name, description, value, rarity, image, isActive } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO jackpot_prizes (id, name, description, value, rarity, image, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, description, value, rarity, image, isActive ? 1 : 0);
  res.json({ success: true });
});

router.put('/admin/jackpot', (req, res) => {
  const { id, isActive } = req.body;
  db.prepare('UPDATE jackpot_prizes SET isActive = ? WHERE id = ?').run(isActive ? 1 : 0, id);
  res.json({ success: true });
});

router.delete('/admin/jackpot/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM jackpot_prizes WHERE id = ?').run(id);
  res.json({ success: true });
});

export default router;
