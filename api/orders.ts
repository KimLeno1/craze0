import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get All Orders
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('timestamp', 'desc').get();
    res.json(snapshot.docs.map(doc => doc.data()));
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Create Order
router.post('/', async (req, res) => {
  const order = req.body;
  try {
    await db.collection('orders').doc(order.id).set(order);
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update Order Status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    await db.collection('orders').doc(id).update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status.' });
  }
});

export default router;
