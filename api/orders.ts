import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get All Orders
router.get('/', (req, res) => {
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

// Create Order
router.post('/', (req, res) => {
  const order = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO orders (id, userId, userName, total, status, timestamp, trackingNumber, deliveryAddress, phone, items)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      order.id, order.userId, order.userName, order.total, order.status, order.timestamp,
      order.trackingNumber, order.deliveryAddress, order.phone, JSON.stringify(order.items || [])
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update Order Status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  try {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Failed to update order status.' });
  }
});

export default router;
