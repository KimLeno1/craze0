import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get Admin Metrics
router.get('/metrics', async (req, res) => {
  try {
    const usersCount = (await db.collection('users').count().get()).data().count;
    const productsCount = (await db.collection('products').count().get()).data().count;
    const ordersCount = (await db.collection('orders').count().get()).data().count;
    const suppliersCount = (await db.collection('suppliers').count().get()).data().count;
    
    const ordersSnap = await db.collection('orders').get();
    const totalRevenue = ordersSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);

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
    const snapshot = await db.collection('users').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get All Orders
router.get('/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get All Suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const snapshot = await db.collection('suppliers').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Get All Promos
router.get('/promos', async (req, res) => {
  try {
    const snapshot = await db.collection('promos').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Failed to fetch promos' });
  }
});

// Get All Flash Sales
router.get('/flash-sales', async (req, res) => {
  try {
    const snapshot = await db.collection('flash_sales').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching flash sales:', error);
    res.status(500).json({ error: 'Failed to fetch flash sales' });
  }
});

// Get All Kits
router.get('/kits', async (req, res) => {
  try {
    const snapshot = await db.collection('bundles').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching kits:', error);
    res.status(500).json({ error: 'Failed to fetch kits' });
  }
});

// Get All Notifications
router.get('/notifications', async (req, res) => {
  try {
    const snapshot = await db.collection('notifications').orderBy('timestamp', 'desc').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get All Pay For Me Requests
router.get('/pay-for-me', async (req, res) => {
  try {
    const snapshot = await db.collection('pay_for_me').orderBy('timestamp', 'desc').get();
    res.json(snapshot.docs.map(doc => doc.data()));
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
    await db.collection('pay_for_me').doc(id).update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating pay-for-me status:', error);
    res.status(500).json({ error: 'Failed to update pay-for-me status' });
  }
});

// Get All Site Settings
router.get('/settings', async (req, res) => {
  try {
    const docSnap = await db.collection('settings').doc('admin').get();
    res.json(docSnap.exists ? docSnap.data() : {});
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
    await db.collection('settings').doc('admin').update({ [key]: value });
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
    await db.collection('promos').doc(id).set({ ...p, id });
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
    await db.collection('flash_sales').doc(id).set({ ...fs, id });
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
    await db.collection('bundles').doc(id).set({ ...k, id });
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
    await db.collection('products').doc(id).update(updates);
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
    const updates: any = { status };
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    await db.collection('orders').doc(id).update(updates);
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
    await db.collection('users').doc(id).update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, error: 'Failed to update user status.' });
  }
});

// Add Notification (Admin)
router.post('/notifications', async (req, res) => {
  const n = req.body;
  try {
    const docRef = await db.collection('notifications').add({
      ...n,
      timestamp: Date.now(),
      read: false
    });
    res.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ success: false, error: 'Failed to create notification.' });
  }
});

export default router;
