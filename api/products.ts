import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
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

// Add Product
router.post('/', async (req, res) => {
  const p = req.body;
  const id = p.id || `p${Date.now()}`;
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO products (
        id, name, price, originalPrice, shippingFee, image, category, gender, 
        description, details, inStock, isNew, viewers, stockCount, hypeScore, 
        velocityScore, isHallOfFame, brand, tags, supplierId, sizes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      p.name,
      p.price,
      p.originalPrice,
      p.shippingFee || 0,
      p.image,
      p.category,
      p.gender,
      p.description,
      JSON.stringify(p.details || []),
      p.inStock ? 1 : 0,
      p.isNew ? 1 : 0,
      p.viewers || 0,
      p.stockCount || 100,
      p.hypeScore || 0,
      p.velocityScore || 50,
      p.isHallOfFame ? 1 : 0,
      p.brand,
      JSON.stringify(p.tags || []),
      p.supplierId,
      JSON.stringify(p.sizes || [])
    );
    
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, error: 'Failed to add product.' });
  }
});

// Update Product
router.put('/:id', async (req, res) => {
  const p = req.body;
  const id = req.params.id;
  try {
    const fields = Object.keys(p).filter(key => key !== 'id');
    const setClause = fields.map(key => `${key} = ?`).join(', ');
    const values = fields.map(key => {
      if (Array.isArray(p[key])) return JSON.stringify(p[key]);
      if (typeof p[key] === 'boolean') return p[key] ? 1 : 0;
      return p[key];
    });
    
    const stmt = db.prepare(`UPDATE products SET ${setClause} WHERE id = ?`);
    stmt.run(...values, id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

export default router;
