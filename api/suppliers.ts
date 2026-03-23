import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get Supplier Profile
router.get('/:id', (req, res) => {
  try {
    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(req.params.id);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ error: 'Supplier not found' });
    }
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// Update Supplier Profile
router.put('/:id', (req, res) => {
  const { name, contactEmail, region } = req.body;
  const id = req.params.id;
  try {
    db.prepare('UPDATE suppliers SET name = ?, contactEmail = ?, region = ? WHERE id = ?').run(name, contactEmail, region, id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating supplier profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update supplier profile.' });
  }
});

// Get Supplier Products
router.get('/:id/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products WHERE supplierId = ?').all(req.params.id) as any[];
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
    console.error('Error fetching supplier products:', error);
    res.status(500).json({ error: 'Failed to fetch supplier products' });
  }
});

// Get Supplier Orders
router.get('/:id/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders').all() as any[];
    const supplierOrders = orders.filter((o: any) => {
      const items = JSON.parse(o.items || '[]');
      return items.some((item: any) => item.supplierId === req.params.id);
    }).map(o => ({
      ...o,
      items: JSON.parse(o.items || '[]')
    }));
    res.json(supplierOrders);
  } catch (error) {
    console.error('Error fetching supplier orders:', error);
    res.status(500).json({ error: 'Failed to fetch supplier orders' });
  }
});

export default router;
