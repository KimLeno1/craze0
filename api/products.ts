import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get all products
router.get('/', (req, res) => {
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
    res.status(500).json({ success: false, error: 'Failed to fetch products.' });
  }
});

// Add Product
router.post('/', (req, res) => {
  const p = req.body;
  const id = p.id || `p${Date.now()}`;
  try {
    const stmt = db.prepare(`
      INSERT INTO products (
        id, name, price, originalPrice, shippingFee, image, category, gender, 
        description, details, inStock, isNew, viewers, stockCount, hypeScore, 
        velocityScore, isHallOfFame, brand, tags, supplierId, sizes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id, p.name, p.price, p.originalPrice, p.shippingFee || 0, p.image, p.category, p.gender,
      p.description, JSON.stringify(p.details || []), p.inStock ? 1 : 0, p.isNew ? 1 : 0,
      p.viewers || 0, p.stockCount || 100, p.hypeScore || 0, p.velocityScore || 50,
      p.isHallOfFame ? 1 : 0, p.brand, JSON.stringify(p.tags || []), p.supplierId, JSON.stringify(p.sizes || [])
    );

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product.' });
  }
});

// Update Product
router.put('/:id', (req, res) => {
  const p = req.body;
  const id = req.params.id;
  try {
    const stmt = db.prepare(`
      UPDATE products SET 
        name = ?, price = ?, originalPrice = ?, shippingFee = ?, image = ?, 
        category = ?, gender = ?, description = ?, details = ?, inStock = ?, 
        isNew = ?, viewers = ?, stockCount = ?, hypeScore = ?, velocityScore = ?, 
        isHallOfFame = ?, brand = ?, tags = ?, supplierId = ?, sizes = ?
      WHERE id = ?
    `);

    stmt.run(
      p.name, p.price, p.originalPrice, p.shippingFee || 0, p.image, p.category, p.gender,
      p.description, JSON.stringify(p.details || []), p.inStock ? 1 : 0, p.isNew ? 1 : 0,
      p.viewers || 0, p.stockCount || 100, p.hypeScore || 0, p.velocityScore || 50,
      p.isHallOfFame ? 1 : 0, p.brand, JSON.stringify(p.tags || []), p.supplierId, JSON.stringify(p.sizes || []),
      id
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

export default router;
