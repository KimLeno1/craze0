import express from 'express';
import db from './db.js';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

// --- AUTH ---
router.post('/auth/signup', (req, res) => {
  const { email, password, handle, phone } = req.body;
  const id = `u_${Date.now()}`;
  try {
    db.prepare('INSERT INTO users (id, email, password, handle, joinedAt) VALUES (?, ?, ?, ?, ?)')
      .run(id, email, password, handle || `User_${Math.floor(Math.random()*1000)}`, Date.now());
    
    // Initialize stats and preferences
    const initialStats = {
      userId: id,
      level: 1,
      experience: 0,
      nextLevelExp: 1000,
      rank: 'NEOPHYTE',
      totalSpent: 0,
      itemsOwned: 0,
      achievements: [],
      dailyQuests: [],
      tickets: 5,
      aiTryOnsUsedToday: 0,
      dailyGameAttempts: 3,
      lastGameReset: new Date().toISOString(),
      quests: [],
      selectedPath: null,
      brandSubscriptions: [],
      tagSubscriptions: []
    };
    db.prepare('INSERT INTO user_stats (userId, stats) VALUES (?, ?)').run(id, JSON.stringify(initialStats));
    db.prepare('INSERT INTO user_preferences (userId, preferences) VALUES (?, ?)').run(id, JSON.stringify({}));
    
    res.json({ success: true, userId: id, token: 'true' });
  } catch (error: any) {
    res.status(400).json({ error: 'Email already exists or invalid data' });
  }
});

router.post('/auth/login', (req, res) => {
  const { email, identifier, password, role } = req.body;
  const loginId = identifier || email;

  if (role === 'ADMIN') {
    const adminCredsRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('admin_creds') as any;
    const adminCreds = adminCredsRow ? JSON.parse(adminCredsRow.value) : { identifier: 'leno', password: '1q2w3!' };
    
    if (loginId === adminCreds.identifier && password === adminCreds.password) {
      return res.json({ success: true, token: 'admin-token-' + Date.now(), role: 'ADMIN' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } else if (role === 'SUPPLIER') {
    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ? OR name = ?').get(loginId, loginId) as any;
    if (supplier) {
      return res.json({ success: true, token: 'supplier-token-' + Date.now(), role: 'SUPPLIER', supplierId: supplier.id });
    } else {
      return res.status(401).json({ error: 'Supplier not found' });
    }
  } else {
    // Default to normal user login
    const user = db.prepare('SELECT id, handle FROM users WHERE email = ? AND password = ?').get(loginId, password) as any;
    if (user) {
      return res.json({ success: true, userId: user.id, handle: user.handle, token: 'true' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
});

router.get('/auth/check', (req, res) => {
  const token = req.headers.authorization;
  if (token && token !== 'undefined' && token !== 'null') {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

router.post('/auth/logout', (req, res) => {
  res.json({ success: true });
});

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

router.patch('/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  res.json(user);
});

router.post('/users/:id/rep', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  db.prepare('UPDATE users SET rep = rep + ? WHERE id = ?').run(amount, id);
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

router.patch('/user-stats/:userId/achievements/:achievementId', (req, res) => {
  const { userId, achievementId } = req.params;
  const { progress } = req.body;
  
  const row = db.prepare('SELECT stats FROM user_stats WHERE userId = ?').get(userId) as any;
  if (row) {
    const stats = JSON.parse(row.stats);
    const achievements = stats.achievements || [];
    const index = achievements.findIndex((a: any) => a.id === achievementId);
    if (index !== -1) {
      achievements[index].progress = progress;
      if (progress >= 100) achievements[index].completed = true;
    } else {
      achievements.push({ id: achievementId, progress, completed: progress >= 100 });
    }
    stats.achievements = achievements;
    db.prepare('UPDATE user_stats SET stats = ? WHERE userId = ?').run(JSON.stringify(stats), userId);
    res.json({ success: true, stats });
  } else {
    res.status(404).json({ error: 'Stats not found' });
  }
});

// --- PRODUCTS ---
router.get('/products/velocity-heat', (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY velocityScore DESC LIMIT 10').all();
  res.json(products.map((p: any) => ({ 
    ...p, 
    tags: JSON.parse(p.tags || '[]'),
    details: JSON.parse(p.details || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
    customizationFields: JSON.parse(p.customizationFields || '[]'),
    isCustom: !!p.isCustom,
    inStock: !!p.inStock,
    isHallOfFame: !!p.isHallOfFame,
    isNew: !!p.isNew
  })));
});

router.get('/products/hall-of-fame', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE isHallOfFame = 1').all();
  res.json(products.map((p: any) => ({ 
    ...p, 
    tags: JSON.parse(p.tags || '[]'),
    details: JSON.parse(p.details || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
    customizationFields: JSON.parse(p.customizationFields || '[]'),
    isCustom: !!p.isCustom,
    inStock: !!p.inStock,
    isHallOfFame: !!p.isHallOfFame,
    isNew: !!p.isNew
  })));
});

router.get('/products', (req, res) => {
  const { supplierId } = req.query;
  let products;
  if (supplierId) {
    products = db.prepare('SELECT * FROM products WHERE supplierId = ?').all(supplierId);
  } else {
    products = db.prepare('SELECT * FROM products').all();
  }
  res.json(products.map((p: any) => ({ 
    ...p, 
    tags: JSON.parse(p.tags || '[]'),
    details: JSON.parse(p.details || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
    customizationFields: JSON.parse(p.customizationFields || '[]'),
    isCustom: !!p.isCustom,
    inStock: !!p.inStock,
    isHallOfFame: !!p.isHallOfFame,
    isNew: !!p.isNew
  })));
});

router.post('/products', (req, res) => {
  const { 
    id, name, price, originalPrice, image, category, gender, description, 
    isNew, velocityScore, hypeScore, isHallOfFame, supplierId, shippingFee, 
    tags, appeal, viewers, stockCount, inStock,
    details, sizes, isCustom, priceRange, customizationFields
  } = req.body;
  
  db.transaction(() => {
    db.prepare(
      `INSERT OR REPLACE INTO products (
        id, name, price, originalPrice, image, category, gender, description, 
        isNew, velocityScore, hypeScore, isHallOfFame, supplierId, shippingFee, 
        tags, appeal, viewers, stockCount, inStock,
        details, sizes, isCustom, priceRange, customizationFields
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id, name, price, originalPrice || price, image, category, gender, description, 
      isNew ? 1 : 0, velocityScore || 0, hypeScore || 0, isHallOfFame ? 1 : 0, supplierId, shippingFee || 0, 
      JSON.stringify(tags || []), appeal, viewers || 0, stockCount || 0, inStock !== undefined ? (inStock ? 1 : 0) : (stockCount > 0 ? 1 : 0),
      JSON.stringify(details || []), JSON.stringify(sizes || []), isCustom ? 1 : 0, 
      JSON.stringify(priceRange || { min: 0, max: 0 }), JSON.stringify(customizationFields || [])
    );

    if (supplierId) {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE supplierId = ?').get(supplierId) as any;
      db.prepare('UPDATE suppliers SET activeProducts = ? WHERE id = ?').run(count.count, supplierId);
    }
  })();
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

router.patch('/products/:id/hype', (req, res) => {
  const { id } = req.params;
  const { hypeScore } = req.body;
  db.prepare('UPDATE products SET hypeScore = ? WHERE id = ?').run(hypeScore, id);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(product);
});

router.patch('/products/:id/hall-of-fame', (req, res) => {
  const { id } = req.params;
  const { isHallOfFame } = req.body;
  db.prepare('UPDATE products SET isHallOfFame = ? WHERE id = ?').run(isHallOfFame ? 1 : 0, id);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.json(product);
});

router.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = db.prepare('SELECT supplierId FROM products WHERE id = ?').get(id) as any;
  
  db.transaction(() => {
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    if (product && product.supplierId) {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE supplierId = ?').get(product.supplierId) as any;
      db.prepare('UPDATE suppliers SET activeProducts = ? WHERE id = ?').run(count.count, product.supplierId);
    }
  })();
  res.json({ success: true });
});

// --- SUPPLIERS ---
router.get('/suppliers', (req, res) => {
  const suppliers = db.prepare('SELECT * FROM suppliers').all();
  res.json(suppliers);
});

router.get('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(id);
  if (supplier) {
    res.json(supplier);
  } else {
    res.status(404).json({ error: 'Supplier not found' });
  }
});

router.post('/suppliers', (req, res) => {
  const { id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating, activeProducts, commissionRate } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO suppliers (id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating, activeProducts, commissionRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate, rating || 5.0, activeProducts || 0, commissionRate || 0.10);
  res.json({ success: true });
});

router.patch('/suppliers/:id/commission', (req, res) => {
  const { id } = req.params;
  const { commissionRate } = req.body;
  db.prepare('UPDATE suppliers SET commissionRate = ? WHERE id = ?').run(commissionRate, id);
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
  const { id, userId, totalPrice, status, timestamp, items, paystackReference } = req.body;
  db.prepare(
    'INSERT OR REPLACE INTO orders (id, userId, totalPrice, status, timestamp, items, paystackReference) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, totalPrice, status, timestamp, JSON.stringify(items), paystackReference);
  res.json({ success: true });
});

router.patch('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const oldOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
  if (!oldOrder) return res.status(404).json({ error: 'Order not found' });

  db.transaction(() => {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);

    // If status changed to DELIVERED, update supplier revenue and distribute earnings
    if (status === 'DELIVERED' && oldOrder.status !== 'DELIVERED') {
      const items = JSON.parse(oldOrder.items);
      const timestamp = new Date().toISOString();
      
      items.forEach((item: any) => {
        if (item.supplierId) {
          const revenue = (item.price * (item.quantity || 1));
          
          // Get supplier commission rate
          const supplier = db.prepare('SELECT commissionRate FROM suppliers WHERE id = ?').get(item.supplierId) as any;
          const commissionRate = supplier ? supplier.commissionRate : 0.10;
          
          const adminCommission = Math.floor(revenue * commissionRate);
          const supplierEarning = revenue - adminCommission;
          
          // Update Supplier Wallet
          db.prepare('INSERT OR IGNORE INTO wallets (id, balance, updatedAt) VALUES (?, 0, ?)').run(item.supplierId, timestamp);
          db.prepare('UPDATE wallets SET balance = balance + ?, updatedAt = ? WHERE id = ?').run(supplierEarning, timestamp, item.supplierId);
          db.prepare('INSERT INTO wallet_transactions (id, walletId, amount, type, description, timestamp, orderId) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(`tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, item.supplierId, supplierEarning, 'EARNING', `Sale: ${item.name}`, timestamp, id);
          
          // Update Admin Wallet
          db.prepare('INSERT OR IGNORE INTO wallets (id, balance, updatedAt) VALUES (?, 0, ?)').run('ADMIN_WALLET', timestamp);
          db.prepare('UPDATE wallets SET balance = balance + ?, updatedAt = ? WHERE id = ?').run(adminCommission, timestamp, 'ADMIN_WALLET');
          db.prepare('INSERT INTO wallet_transactions (id, walletId, amount, type, description, timestamp, orderId) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(`tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, 'ADMIN_WALLET', adminCommission, 'COMMISSION', `Commission: ${item.name} from ${item.supplierId}`, timestamp, id);

          // Legacy revenue update
          db.prepare('UPDATE suppliers SET totalRevenueYield = totalRevenueYield + ? WHERE id = ?').run(revenue, item.supplierId);
        }
      });
    }

    // Update performance score for involved suppliers
    const items = JSON.parse(oldOrder.items);
    const involvedSupplierIds = [...new Set(items.map((i: any) => i.supplierId).filter(Boolean))];
    
    involvedSupplierIds.forEach((sId: any) => {
      const allSupplierOrders = db.prepare('SELECT * FROM orders').all() as any[];
      const supplierOrders = allSupplierOrders.filter(o => {
        const oItems = JSON.parse(o.items);
        return oItems.some((oi: any) => oi.supplierId === sId);
      });
      
      const total = supplierOrders.length;
      const delivered = supplierOrders.filter(o => o.status === 'DELIVERED').length;
      const score = total > 0 ? Math.round((delivered / total) * 100) : 100;
      
      db.prepare('UPDATE suppliers SET performanceScore = ? WHERE id = ?').run(score, sId);
    });
  })();

  res.json({ success: true });
});

// --- NOTIFICATIONS ---
router.post('/notifications/supplier', (req, res) => {
  const { supplierId, title, message } = req.body;
  const id = `notif_${Date.now()}`;
  db.prepare(
    'INSERT INTO notifications (id, title, message, type, target, timestamp, read, recipientId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, title, message, 'INFO', 'SUPPLIER', new Date().toISOString(), 0, supplierId);
  res.json({ success: true });
});

router.get('/notifications', (req, res) => {
  const { recipientId, target } = req.query;
  let query = 'SELECT * FROM notifications';
  const params: any[] = [];
  
  if (recipientId || target) {
    query += ' WHERE ';
    const conditions = [];
    if (recipientId) {
      conditions.push('recipientId = ?');
      params.push(recipientId);
    }
    if (target) {
      conditions.push('target = ?');
      params.push(target);
    }
    query += conditions.join(' OR ');
  }
  
  query += ' ORDER BY timestamp DESC';
  const notifications = db.prepare(query).all(...params);
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
  const { userId, supplierId } = req.query;
  
  if (userId) {
    // Get user session
    const session = db.prepare('SELECT * FROM user_anomaly_sessions WHERE userId = ?').get(userId) as any;
    if (!session) return res.json([]);
    
    // Check if session is still active
    const now = Date.now();
    if (now > session.endTime) return res.json([]);
    
    // Get anomaly config
    const configRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('anomaly_config') as any;
    if (!configRow) return res.json([]);
    const config = JSON.parse(configRow.value);
    
    // If session eventId doesn't match current config eventId, session is stale
    if (session.eventId !== config.eventId) return res.json([]);
    
    // Return products with calculated endTime
    const products = db.prepare(`
      SELECT p.* FROM products p
      WHERE p.id IN (${config.productIds.map(() => '?').join(',')})
    `).all(...config.productIds) as any[];
    
    const anomalies = products.map(p => ({
      id: `anomaly_${p.id}`,
      productId: p.id,
      anomalyEndTime: session.endTime,
      discountPercent: config.discount,
      price: Math.floor(p.price * (1 - config.discount / 100)),
      ...p,
      tags: JSON.parse(p.tags || '[]'),
      details: JSON.parse(p.details || '[]'),
      sizes: JSON.parse(p.sizes || '[]'),
      priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
      customizationFields: JSON.parse(p.customizationFields || '[]')
    }));
    
    return res.json(anomalies);
  }

  let anomalies;
  if (supplierId) {
    anomalies = db.prepare(`
      SELECT pa.*, p.name, p.image, p.price as originalPrice FROM price_anomalies pa
      JOIN products p ON pa.productId = p.id
      WHERE p.supplierId = ?
    `).all(supplierId);
  } else {
    anomalies = db.prepare('SELECT * FROM price_anomalies').all();
  }
  res.json(anomalies);
});

router.get('/anomalies', (req, res) => {
  const { supplierId, userId } = req.query;
  let url = '/api/price-anomalies';
  if (supplierId) url += `?supplierId=${supplierId}`;
  else if (userId) url += `?userId=${userId}`;
  res.redirect(url);
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

router.get('/admin/anomaly-config', (req, res) => {
  const config = db.prepare('SELECT value FROM settings WHERE key = ?').get('anomaly_config') as any;
  res.json(config ? JSON.parse(config.value) : null);
});

router.post('/admin/anomaly-config', (req, res) => {
  const { duration, productIds, discount } = req.body;
  const config = {
    eventId: `event_${Date.now()}`,
    duration: parseInt(duration), // in seconds
    productIds,
    discount: parseInt(discount)
  };
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('anomaly_config', JSON.stringify(config));
  res.json({ success: true, config });
});

router.get('/user/anomaly-session/:userId', (req, res) => {
  const { userId } = req.params;
  const session = db.prepare('SELECT * FROM user_anomaly_sessions WHERE userId = ?').get(userId);
  res.json(session || null);
});

router.post('/user/anomaly-session/start', (req, res) => {
  const { userId } = req.body;
  const configRow = db.prepare('SELECT value FROM settings WHERE key = ?').get('anomaly_config') as any;
  if (!configRow) return res.status(404).json({ error: 'No anomaly configured' });
  
  const config = JSON.parse(configRow.value);
  const now = Date.now();
  const endTime = now + (config.duration * 1000);
  
  db.prepare(`
    INSERT OR REPLACE INTO user_anomaly_sessions (userId, eventId, startTime, endTime)
    VALUES (?, ?, ?, ?)
  `).run(userId, config.eventId, now, endTime);
  
  res.json({ success: true, endTime });
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

router.post('/user-history/:userId/track', (req, res) => {
  const { userId } = req.params;
  const { productId, action } = req.body;
  
  const row = db.prepare('SELECT history FROM user_history WHERE userId = ?').get(userId) as any;
  let history = row ? JSON.parse(row.history) : { viewedProductIds: [], wishlistedProductIds: [], purchasedProductIds: [] };
  
  if (action === 'view') {
    if (!history.viewedProductIds.includes(productId)) {
      history.viewedProductIds.push(productId);
    }
  } else if (action === 'wishlist') {
    if (!history.wishlistedProductIds.includes(productId)) {
      history.wishlistedProductIds.push(productId);
    }
  } else if (action === 'purchase') {
    if (!history.purchasedProductIds.includes(productId)) {
      history.purchasedProductIds.push(productId);
    }
  }
  
  db.prepare('INSERT OR REPLACE INTO user_history (userId, history) VALUES (?, ?)').run(userId, JSON.stringify(history));
  res.json({ success: true, history });
});

// --- SETTINGS ---
router.get('/pay-for-me', (req, res) => {
  const requests = db.prepare(`
    SELECT 
      pfr.*, 
      u.handle as userName
    FROM pay_for_me_requests pfr
    JOIN users u ON pfr.userId = u.id
    ORDER BY pfr.timestamp DESC
  `).all() as any[];

  const formattedRequests = requests.map(r => ({
    ...r,
    items: JSON.parse(r.items || '[]'),
    total: r.total,
    status: r.status,
    timestamp: r.timestamp,
    message: r.message,
    targetEmail: r.targetEmail,
    payerName: r.payerName,
    payerContact: r.payerContact
  }));

  res.json(formattedRequests);
});

router.post('/pay-for-me', (req, res) => {
  const { id, userId, items, total, status, timestamp, message, targetEmail, payerName, payerContact } = req.body;
  db.prepare(`
    INSERT OR REPLACE INTO pay_for_me_requests 
    (id, userId, items, total, status, timestamp, message, targetEmail, payerName, payerContact) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, userId, JSON.stringify(items), total, status, timestamp, message, targetEmail, payerName, payerContact);
  res.json({ success: true });
});

router.patch('/pay-for-me/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.prepare('UPDATE pay_for_me_requests SET status = ? WHERE id = ?').run(status, id);
  
  // Return updated list
  const requests = db.prepare(`
    SELECT 
      pfr.*, 
      u.handle as userName
    FROM pay_for_me_requests pfr
    JOIN users u ON pfr.userId = u.id
    ORDER BY pfr.timestamp DESC
  `).all() as any[];

  const formattedRequests = requests.map(r => ({
    ...r,
    items: JSON.parse(r.items || '[]'),
    total: r.total,
    status: r.status,
    timestamp: r.timestamp,
    message: r.message,
    targetEmail: r.targetEmail,
    payerName: r.payerName,
    payerContact: r.payerContact
  }));

  res.json(formattedRequests);
});

router.delete('/pay-for-me/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM pay_for_me_requests WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- DROPS ---
router.get('/drops', (req, res) => {
  const drops = db.prepare('SELECT * FROM drops WHERE isActive = 1 ORDER BY startTime ASC').all() as any[];
  res.json(drops.map(d => ({ ...d, productIds: JSON.parse(d.productIds || '[]') })));
});

router.post('/drops', (req, res) => {
  const { id, name, description, startTime, endTime, productIds, rarity } = req.body;
  db.prepare(`
    INSERT OR REPLACE INTO drops (id, name, description, startTime, endTime, productIds, isActive, rarity)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `).run(id || `drop_${Date.now()}`, name, description, startTime, endTime, JSON.stringify(productIds || []), rarity || 'COMMON');
  res.json({ success: true });
});

router.delete('/drops/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('UPDATE drops SET isActive = 0 WHERE id = ?').run(id);
  res.json({ success: true });
});

// --- WALLETS ---
router.get('/wallets/:id', (req, res) => {
  const { id } = req.params;
  const wallet = db.prepare('SELECT * FROM wallets WHERE id = ?').get(id) as any;
  const transactions = db.prepare('SELECT * FROM wallet_transactions WHERE walletId = ? ORDER BY timestamp DESC').all(id);
  
  res.json({
    id,
    balance: wallet ? wallet.balance : 0,
    transactions: transactions || []
  });
});

router.post('/wallets/:id/payout', (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;
  const timestamp = new Date().toISOString();
  
  db.transaction(() => {
    const wallet = db.prepare('SELECT balance FROM wallets WHERE id = ?').get(id) as any;
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    db.prepare('UPDATE wallets SET balance = balance - ?, updatedAt = ? WHERE id = ?').run(amount, timestamp, id);
    db.prepare('INSERT INTO wallet_transactions (id, walletId, amount, type, description, timestamp) VALUES (?, ?, ?, ?, ?, ?)')
      .run(`tx_${Date.now()}`, id, -amount, 'PAYOUT', description || 'Payout', timestamp);
  })();
  
  res.json({ success: true });
});

// --- SOCIAL ---
const MOCK_SOCIAL_POSTS = [
  {
    id: 'post_1',
    userId: 'u1',
    userHandle: 'Viper_X',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    likes: 124,
    dislikes: 12,
    reports: 0,
    timestamp: new Date().toISOString(),
    weekId: ''
  },
  {
    id: 'post_2',
    userId: 'u2',
    userHandle: 'Ghost_Shell',
    image: 'https://images.unsplash.com/photo-1539109132314-34a77bd6819f?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    dislikes: 5,
    reports: 0,
    timestamp: new Date().toISOString(),
    weekId: ''
  },
  {
    id: 'post_3',
    userId: 'u3',
    userHandle: 'Luxe_Lord',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    likes: 256,
    dislikes: 20,
    reports: 0,
    timestamp: new Date().toISOString(),
    weekId: ''
  }
];

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

  let posts = db.prepare('SELECT * FROM social_posts').all();
  
  // Seed if empty
  if (posts.length === 0) {
    const insertPost = db.prepare(
      'INSERT INTO social_posts (id, userId, userHandle, image, likes, dislikes, reports, timestamp, weekId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    for (const p of MOCK_SOCIAL_POSTS) {
      insertPost.run(p.id, p.userId, p.userHandle, p.image, p.likes, p.dislikes, p.reports, p.timestamp, p.weekId);
    }
    posts = db.prepare('SELECT * FROM social_posts').all();
  }
  
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
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
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

// --- SECURITY EVENTS ---
router.get('/admin/security-events', (req, res) => {
  const events = db.prepare('SELECT * FROM security_events ORDER BY timestamp DESC LIMIT 100').all();
  res.json(events);
});

router.post('/admin/security-events', (req, res) => {
  const { id, type, severity, timestamp, details, ip } = req.body;
  db.prepare(
    'INSERT INTO security_events (id, type, severity, timestamp, details, ip) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id || `evt_${Date.now()}`, type, severity, timestamp || new Date().toISOString(), details, ip || req.ip);
  res.json({ success: true });
});

// --- ANALYTICS ---
router.get('/admin/metrics', (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalRevenue = db.prepare('SELECT SUM(totalPrice) as sum FROM orders WHERE status != "CANCELLED"').get() as any;
    const activeAnomalies = db.prepare('SELECT COUNT(*) as count FROM price_anomalies').get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    
    // Get revenue over time (last 12 periods - simplified)
    const revenueOverTime = db.prepare(`
      SELECT strftime('%Y-%m-%d', timestamp) as date, SUM(totalPrice) as revenue 
      FROM orders 
      WHERE status != "CANCELLED" 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 12
    `).all();

    res.json({
      totalUsers: totalUsers.count,
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.sum || 0,
      activeAnomalies: activeAnomalies.count,
      totalProducts: totalProducts.count,
      activeOrders: totalOrders.count, // Simplified
      systemUptime: '99.9%',
      threatLevel: 'LOW',
      revenueOverTime: revenueOverTime.reverse()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/security', (req, res) => {
  const events = db.prepare('SELECT * FROM security_events ORDER BY timestamp DESC LIMIT 10').all();
  
  const firewall = db.prepare('SELECT value FROM settings WHERE key = ?').get('firewall_status') as any;
  const threatLevel = db.prepare('SELECT value FROM settings WHERE key = ?').get('threat_level') as any;

  res.json({
    firewall: firewall ? firewall.value : 'ACTIVE',
    encryption: 'AES-256-GCM',
    loadBalancer: 'HEALTHY',
    activeSessions: 12,
    threatLevel: threatLevel ? threatLevel.value : 'LOW',
    events: events.length > 0 ? events : [
      {
        id: 'evt_1',
        type: 'LOGIN',
        severity: 'LOW',
        timestamp: new Date().toISOString(),
        details: 'Admin session established: @leno',
        ip: req.ip
      }
    ]
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

// --- USER PROFILE & STATS ---
router.get('/user/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const user = db.prepare('SELECT id, email, handle, rep, joinedAt FROM users WHERE id = ?').get(userId) as any;
  const stats = db.prepare('SELECT stats FROM user_stats WHERE userId = ?').get(userId) as any;
  const prefs = db.prepare('SELECT preferences FROM user_preferences WHERE userId = ?').get(userId) as any;
  
  if (user) {
    res.json({
      ...user,
      stats: stats ? JSON.parse(stats.stats) : null,
      preferences: prefs ? JSON.parse(prefs.preferences) : null
    });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

router.patch('/user/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const { handle, rep, stats, preferences, coins, gems, level, status, totalSpent, loyaltyPoints } = req.body;
  
  db.transaction(() => {
    if (handle !== undefined) {
      db.prepare('UPDATE users SET handle = ? WHERE id = ?').run(handle, userId);
    }
    if (rep !== undefined) {
      db.prepare('UPDATE users SET rep = ? WHERE id = ?').run(rep, userId);
    }
    if (status !== undefined) {
      db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, userId);
    }
    if (stats !== undefined) {
      db.prepare('INSERT OR REPLACE INTO user_stats (userId, stats) VALUES (?, ?)').run(userId, JSON.stringify(stats));
    }
    if (preferences !== undefined) {
      db.prepare('INSERT OR REPLACE INTO user_preferences (userId, preferences) VALUES (?, ?)').run(userId, JSON.stringify(preferences));
    }
    
    // Update stats if individual fields are provided
    if (coins !== undefined || gems !== undefined || level !== undefined || totalSpent !== undefined || loyaltyPoints !== undefined) {
      const row = db.prepare('SELECT stats FROM user_stats WHERE userId = ?').get(userId) as any;
      const currentStats = row ? JSON.parse(row.stats) : {
        userId,
        level: 1,
        xp: 0,
        coins: 0,
        gems: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        ordersCount: 0,
        achievements: [],
        rank: 'Novice'
      };
      
      if (coins !== undefined) currentStats.coins = coins;
      if (gems !== undefined) currentStats.gems = gems;
      if (level !== undefined) currentStats.level = level;
      if (totalSpent !== undefined) currentStats.totalSpent = totalSpent;
      if (loyaltyPoints !== undefined) currentStats.loyaltyPoints = loyaltyPoints;
      
      db.prepare('INSERT OR REPLACE INTO user_stats (userId, stats) VALUES (?, ?)').run(userId, JSON.stringify(currentStats));
    }
  })();
  
  res.json({ success: true });
});

// --- WISHLIST ---
router.get('/user/wishlist/:userId', (req, res) => {
  const { userId } = req.params;
  const wishlist = db.prepare(`
    SELECT p.* FROM products p
    JOIN wishlist_items w ON p.id = w.productId
    WHERE w.userId = ?
  `).all();
  
  const parsedProducts = wishlist.map((p: any) => ({
    ...p,
    tags: JSON.parse(p.tags || '[]'),
    details: JSON.parse(p.details || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
    customizationFields: JSON.parse(p.customizationFields || '[]'),
    isCustom: !!p.isCustom,
    inStock: !!p.inStock,
    isHallOfFame: !!p.isHallOfFame,
    isNew: !!p.isNew
  }));
  
  res.json(parsedProducts);
});

router.post('/user/wishlist', (req, res) => {
  const { userId, productId } = req.body;
  db.prepare('INSERT OR IGNORE INTO wishlist_items (userId, productId, addedAt) VALUES (?, ?, ?)')
    .run(userId, productId, Date.now());
  res.json({ success: true });
});

router.delete('/user/wishlist/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  db.prepare('DELETE FROM wishlist_items WHERE userId = ? AND productId = ?').run(userId, productId);
  res.json({ success: true });
});

// --- CART ---
router.get('/user/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = db.prepare(`
    SELECT p.*, c.quantity, c.selectedSize, c.selectedColor FROM products p
    JOIN cart_items c ON p.id = c.productId
    WHERE c.userId = ?
  `).all();
  
  const parsedCart = cart.map((p: any) => ({
    ...p,
    tags: JSON.parse(p.tags || '[]'),
    details: JSON.parse(p.details || '[]'),
    sizes: JSON.parse(p.sizes || '[]'),
    priceRange: JSON.parse(p.priceRange || '{"min":0,"max":0}'),
    customizationFields: JSON.parse(p.customizationFields || '[]'),
    isCustom: !!p.isCustom,
    inStock: !!p.inStock,
    isHallOfFame: !!p.isHallOfFame,
    isNew: !!p.isNew
  }));
  
  res.json(parsedCart);
});

router.post('/user/cart', (req, res) => {
  const { userId, productId, quantity, selectedSize, selectedColor } = req.body;
  db.prepare(`
    INSERT INTO cart_items (userId, productId, quantity, selectedSize, selectedColor, addedAt)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId, productId, selectedSize, selectedColor) DO UPDATE SET
    quantity = quantity + excluded.quantity
  `).run(userId, productId, quantity || 1, selectedSize || '', selectedColor || '', Date.now());
  res.json({ success: true });
});

router.put('/user/cart', (req, res) => {
  const { userId, productId, quantity, selectedSize, selectedColor } = req.body;
  db.prepare(`
    UPDATE cart_items SET quantity = ? 
    WHERE userId = ? AND productId = ? AND selectedSize = ? AND selectedColor = ?
  `).run(quantity, userId, productId, selectedSize || '', selectedColor || '');
  res.json({ success: true });
});

router.delete('/user/cart/:userId/:productId/:size/:color', (req, res) => {
  const { userId, productId, size, color } = req.params;
  db.prepare('DELETE FROM cart_items WHERE userId = ? AND productId = ? AND selectedSize = ? AND selectedColor = ?')
    .run(userId, productId, size === 'none' ? '' : size, color === 'none' ? '' : color);
  res.json({ success: true });
});

// --- MYSTERY BOX ---
router.post('/user/mystery-box/open', (req, res) => {
  const { id, userId, boxType, cost, rewardProductId, rewardType } = req.body;
  db.prepare(`
    INSERT INTO mystery_box_logs (id, userId, boxType, cost, rewardProductId, rewardType, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id || `mbox_${Date.now()}`, userId, boxType, cost, rewardProductId, rewardType, Date.now());
  res.json({ success: true });
});

router.get('/user/mystery-box/history/:userId', (req, res) => {
  const { userId } = req.params;
  const history = db.prepare('SELECT * FROM mystery_box_logs WHERE userId = ? ORDER BY timestamp DESC').all();
  res.json(history);
});

// --- GAME SCORES ---
router.post('/user/game-scores', (req, res) => {
  const { id, userId, gameId, score, rank, rewardRep, details } = req.body;
  db.prepare(`
    INSERT INTO game_scores (id, userId, gameId, score, rank, rewardRep, details, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id || `score_${Date.now()}`, userId, gameId, score, rank || 'N/A', rewardRep || 0, JSON.stringify(details || {}), Date.now());
  res.json({ success: true });
});

router.get('/user/game-scores/:userId', (req, res) => {
  const { userId } = req.params;
  const scores = db.prepare('SELECT * FROM game_scores WHERE userId = ? ORDER BY timestamp DESC').all() as any[];
  res.json(scores.map(s => ({ ...s, details: JSON.parse(s.details || '{}') })));
});

// --- STYLIST SESSIONS ---
router.post('/user/stylist-sessions', (req, res) => {
  const { id, userId, messages, recommendations } = req.body;
  db.prepare(`
    INSERT INTO stylist_sessions (id, userId, messages, recommendations, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(id || `stylist_${Date.now()}`, userId, JSON.stringify(messages), JSON.stringify(recommendations), Date.now());
  res.json({ success: true });
});

router.get('/user/stylist-sessions/:userId', (req, res) => {
  const { userId } = req.params;
  const sessions = db.prepare('SELECT * FROM stylist_sessions WHERE userId = ? ORDER BY timestamp DESC').all();
  const parsedSessions = sessions.map((s: any) => ({
    ...s,
    messages: JSON.parse(s.messages),
    recommendations: JSON.parse(s.recommendations)
  }));
  res.json(parsedSessions);
});

// --- TRY-ON HISTORY ---
router.post('/user/try-on', (req, res) => {
  const { id, userId, productId, userImage, resultImage } = req.body;
  db.prepare(`
    INSERT INTO try_on_history (id, userId, productId, userImage, resultImage, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id || `tryon_${Date.now()}`, userId, productId, userImage, resultImage, Date.now());
  res.json({ success: true });
});

router.get('/user/try-on/:userId', (req, res) => {
  const { userId } = req.params;
  const history = db.prepare('SELECT * FROM try_on_history WHERE userId = ? ORDER BY timestamp DESC').all();
  res.json(history);
});

// --- PAYSTACK ---
router.post('/paystack/initialize', async (req, res) => {
  const { email, amount, metadata } = req.body;
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Paystack secret key not configured' });
  }

  try {
    const response = await axios.post('https://api.paystack.co/transaction/initialize', {
      email,
      amount: Math.round(amount * 100), // Paystack expects amount in kobo
      metadata,
    }, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Paystack Initialization Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize Paystack transaction' });
  }
});

router.post('/paystack/webhook', (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).send('Secret not configured');

  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, metadata, customer } = event.data;
    const orderId = metadata?.orderId;
    const payForMeId = metadata?.payForMeId;

    if (orderId) {
      const order = db.prepare('SELECT totalPrice FROM orders WHERE id = ?').get(orderId) as any;
      if (order && Math.round(order.totalPrice * 100) === event.data.amount) {
        db.prepare('UPDATE orders SET status = ?, paystackReference = ? WHERE id = ?')
          .run('PAID', reference, orderId);
      } else {
        console.error('Amount mismatch in webhook for order', { orderId, expected: order?.totalPrice * 100, actual: event.data.amount });
      }
    }

    if (payForMeId) {
      const request = db.prepare('SELECT total FROM pay_for_me_requests WHERE id = ?').get(payForMeId) as any;
      if (request && Math.round(request.total * 100) === event.data.amount) {
        const payerName = metadata?.payerName || customer?.first_name || 'Anonymous Sponsor';
        const payerContact = metadata?.payerContact || customer?.email;
        
        db.prepare('UPDATE pay_for_me_requests SET status = ?, payerName = ?, payerContact = ? WHERE id = ?')
          .run('PAID', payerName, payerContact, payForMeId);
      } else {
        console.error('Amount mismatch in webhook for pay-for-me', { payForMeId, expected: request?.total * 100, actual: event.data.amount });
      }
    }
  } else if (event.event === 'transfer.success') {
    const { transfer_code, reference, amount } = event.data;
    const withdrawal = db.prepare('SELECT amount, status FROM withdrawals WHERE transferCode = ? OR reference = ?').get(transfer_code, reference) as any;
    
    if (withdrawal && withdrawal.status === 'PENDING') {
      if (Math.round(withdrawal.amount * 100) === amount) {
        db.prepare('UPDATE withdrawals SET status = ? WHERE transferCode = ? OR reference = ?')
          .run('SUCCESS', transfer_code, reference);
      } else {
        console.error('Transfer success amount mismatch', { transfer_code, reference, expected: withdrawal?.amount * 100, actual: amount });
      }
    }
  } else if (event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
    const { transfer_code, reference, amount } = event.data;
    const status = event.event === 'transfer.failed' ? 'FAILED' : 'REVERSED';
    
    const withdrawal = db.prepare('SELECT userId, amount, status FROM withdrawals WHERE transferCode = ? OR reference = ?').get(transfer_code, reference) as any;
    
    if (withdrawal && withdrawal.status === 'PENDING') {
      if (Math.round(withdrawal.amount * 100) === amount) {
        db.prepare('UPDATE withdrawals SET status = ? WHERE transferCode = ? OR reference = ?')
          .run(status, transfer_code, reference);
        // Refund balance
        db.prepare('UPDATE wallets SET balance = balance + ?, updatedAt = ? WHERE id = ?')
          .run(withdrawal.amount, new Date().toISOString(), withdrawal.userId);
      } else {
        console.error('Transfer failed/reversed amount mismatch', { transfer_code, reference, expected: withdrawal?.amount * 100, actual: amount });
      }
    }
  }

  res.sendStatus(200);
});

router.get('/paystack/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Paystack secret key not configured' });
  }

  try {
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    if (response.data.data.status === 'success') {
      const orderId = response.data.data.metadata?.orderId;
      if (orderId) {
        const order = db.prepare('SELECT totalPrice FROM orders WHERE id = ?').get(orderId) as any;
        if (order && Math.round(order.totalPrice * 100) === response.data.data.amount) {
          db.prepare('UPDATE orders SET status = ?, paystackReference = ? WHERE id = ?')
            .run('PAID', reference, orderId);
        } else {
          console.error('Amount mismatch during Paystack verification', { orderId, expected: order?.totalPrice * 100, actual: response.data.data.amount });
          return res.status(400).json({ error: 'Amount mismatch' });
        }
      }
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('Paystack Verification Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify Paystack transaction' });
  }
});

// --- PAYSTACK WITHDRAWAL ---
router.get('/paystack/banks', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Secret not configured' });

  try {
    const response = await axios.get('https://api.paystack.co/bank?currency=GHS', {
      headers: { Authorization: `Bearer ${secret}` }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch banks' });
  }
});

router.get('/paystack/resolve-account', async (req, res) => {
  const account_number = req.query.account_number || req.query.accountNumber;
  const bank_code = req.query.bank_code || req.query.bankCode;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Secret not configured' });

  try {
    const response = await axios.get(`https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(400).json({ error: 'Could not resolve account' });
  }
});

router.post('/paystack/withdraw', async (req, res) => {
  const { userId, amount, bankCode, bankName, accountNumber, accountName, type = 'ghipss', currency = 'GHS' } = req.body;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Secret not configured' });

  // 1. Check balance
  const wallet = db.prepare('SELECT balance FROM wallets WHERE id = ?').get(userId) as any;
  if (!wallet || wallet.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  const reference = `wd_${crypto.randomUUID()}`;

  try {
    // 2. Create Transfer Recipient
    const recipientResponse = await axios.post('https://api.paystack.co/transferrecipient', {
      type,
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency
    }, {
      headers: { Authorization: `Bearer ${secret}` }
    });

    const recipientCode = recipientResponse.data.data.recipient_code;

    // 3. Initiate Transfer
    const transferResponse = await axios.post('https://api.paystack.co/transfer', {
      source: 'balance',
      amount: Math.round(amount * 100),
      recipient: recipientCode,
      reason: 'Wallet Withdrawal',
      reference
    }, {
      headers: { Authorization: `Bearer ${secret}` }
    });

    const transferData = transferResponse.data.data;

    // 4. Record withdrawal and deduct balance (optimistic)
    db.prepare(`
      INSERT INTO withdrawals (id, userId, amount, bankCode, bankName, accountNumber, accountName, recipientCode, transferCode, reference, status, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `wd_${Date.now()}`,
      userId,
      amount,
      bankCode,
      bankName,
      accountNumber,
      accountName,
      recipientCode,
      transferData.transfer_code,
      reference,
      'PENDING',
      new Date().toISOString()
    );

    db.prepare('UPDATE wallets SET balance = balance - ?, updatedAt = ? WHERE id = ?')
      .run(amount, new Date().toISOString(), userId);

    res.json({ success: true, message: 'Withdrawal initiated', reference });
  } catch (error: any) {
    console.error('Withdrawal Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

router.get('/paystack/transfer/verify/:reference', async (req, res) => {
  const { reference } = req.params;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ error: 'Secret not configured' });

  try {
    const response = await axios.get(`https://api.paystack.co/transfer/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });

    const transferData = response.data.data;
    const status = transferData.status.toUpperCase(); // SUCCESS, FAILED, REVERSED, PENDING
    const transfer_code = transferData.transfer_code;

    if (status === 'SUCCESS' || status === 'FAILED' || status === 'REVERSED') {
      const withdrawal = db.prepare('SELECT userId, amount, status FROM withdrawals WHERE reference = ?').get(reference) as any;
      
      if (withdrawal && withdrawal.status === 'PENDING') {
        db.prepare('UPDATE withdrawals SET status = ?, transferCode = ? WHERE reference = ?')
          .run(status, transfer_code, reference);

        if (status === 'FAILED' || status === 'REVERSED') {
          // Refund balance
          db.prepare('UPDATE wallets SET balance = balance + ?, updatedAt = ? WHERE id = ?')
            .run(withdrawal.amount, new Date().toISOString(), withdrawal.userId);
        }
      }
    }

    res.json(response.data);
  } catch (error: any) {
    console.error('Transfer Verification Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify transfer' });
  }
});

router.get('/paystack/withdrawals/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const withdrawals = db.prepare('SELECT * FROM withdrawals WHERE userId = ? ORDER BY timestamp DESC').all(userId);
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

export default router;
