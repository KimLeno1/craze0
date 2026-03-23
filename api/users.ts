import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get User Credits
router.get('/users/:userId/credits', (req, res) => {
  const { userId } = req.params;
  try {
    const credits = db.prepare('SELECT * FROM credits WHERE userId = ? AND status = ?').all(userId, 'AVAILABLE');
    res.json(credits);
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Use Credit
router.post('/user-credits/use', (req, res) => {
  const { creditId } = req.body;
  try {
    db.prepare('UPDATE credits SET status = ? WHERE id = ?').run('USED', creditId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error using credit:', error);
    res.status(500).json({ success: false, error: 'Failed to use credit.' });
  }
});

export default router;
