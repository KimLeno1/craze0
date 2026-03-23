import { Router } from 'express';
import { db } from './db';

const router = Router();

// Get User by Email
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (user) {
      user.stats = JSON.parse(user.stats || '{}');
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get Users Ranked by Rep/Loves
router.get('/ranked', async (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users ORDER BY rep DESC LIMIT 10').all();
    const parsedUsers = users.map((u: any) => ({
      ...u,
      stats: JSON.parse(u.stats || '{}')
    }));
    res.json(parsedUsers);
  } catch (error) {
    console.error('Error fetching ranked users:', error);
    res.status(500).json({ error: 'Failed to fetch ranked users' });
  }
});

// Get User Pay For Me Requests
router.get('/:userId/pay-for-me', async (req, res) => {
  const { userId } = req.params;
  try {
    const requests = db.prepare('SELECT * FROM pay_for_me WHERE requesterId = ? ORDER BY timestamp DESC').all(userId);
    const parsedRequests = requests.map((r: any) => ({
      ...r,
      items: JSON.parse(r.items || '[]')
    }));
    res.json(parsedRequests);
  } catch (error) {
    console.error('Error fetching user pay-for-me requests:', error);
    res.status(500).json({ error: 'Failed to fetch pay-for-me requests' });
  }
});

// Get User Credits
router.get('/:userId/credits', async (req, res) => {
  const { userId } = req.params;
  try {
    const credits = db.prepare('SELECT * FROM credits WHERE userId = ? AND status = ?').all(userId, 'AVAILABLE');
    res.json(credits);
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Failed to fetch credits' });
  }
});

// Get User Notifications
router.get('/:userId/notifications', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = db.prepare('SELECT * FROM notifications WHERE recipientId = ? ORDER BY timestamp DESC').all(userId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Use Credit
router.post('/user-credits/use', async (req, res) => {
  const { creditId, userId } = req.body;
  try {
    db.prepare('UPDATE credits SET status = ? WHERE id = ?').run('USED', creditId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error using credit:', error);
    res.status(500).json({ success: false, error: 'Failed to use credit.' });
  }
});

export default router;
