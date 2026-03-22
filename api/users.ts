import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get User Credits
router.get('/users/:userId/credits', async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db.collection('credits')
      .where('userId', '==', userId)
      .where('status', '==', 'AVAILABLE')
      .get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Use Credit
router.post('/user-credits/use', async (req, res) => {
  const { creditId, userId } = req.body;
  try {
    await db.collection('credits').doc(creditId).update({ status: 'USED' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error using credit:', error);
    res.status(500).json({ success: false, error: 'Failed to use credit.' });
  }
});

export default router;
