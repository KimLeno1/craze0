import { Router } from 'express';
import { db } from './db';

const router = Router();

// Add Product
router.post('/', async (req, res) => {
  const p = req.body;
  const id = p.id || `p${Date.now()}`;
  try {
    await db.collection('products').doc(id).set({
      ...p,
      id,
      sizes: p.sizes || [],
      colors: p.colors || [],
      stock: p.stock ?? 100,
      velocityScore: p.velocityScore ?? 50,
      hypeScore: p.hypeScore ?? 0,
      isNew: p.isNew ?? false,
      isHallOfFame: p.isHallOfFame ?? false
    });
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
    await db.collection('products').doc(id).update({
      ...p,
      sizes: p.sizes || [],
      colors: p.colors || []
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Failed to update product.' });
  }
});

export default router;
