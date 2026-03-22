import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get Supplier Profile
router.get('/:id', async (req, res) => {
  try {
    const docSnap = await db.collection('suppliers').doc(req.params.id).get();
    if (docSnap.exists) {
      res.json(docSnap.data());
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Update Supplier Profile
router.put('/:id', async (req, res) => {
  const { name, contactEmail, region } = req.body;
  const id = req.params.id;
  try {
    await db.collection('suppliers').doc(id).update({ name, contactEmail, region });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating supplier profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update supplier profile.' });
  }
});

// Get Supplier Products
router.get('/:id/products', async (req, res) => {
  try {
    const snapshot = await db.collection('products').where('supplierId', '==', req.params.id).get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching supplier products:', error);
    res.status(500).json({ error: 'Failed to fetch supplier products' });
  }
});

// Get Supplier Orders
router.get('/:id/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').get();
    const allOrders = snapshot.docs.map(doc => doc.data());
    const supplierOrders = allOrders.filter((o: any) => {
      const items = o.items || [];
      return items.some((item: any) => item.supplierId === req.params.id);
    });
    res.json(supplierOrders);
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    res.status(500).json({ error: 'Failed to fetch supplier orders' });
  }
});

export default router;
