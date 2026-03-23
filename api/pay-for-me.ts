import { Router } from 'express';
import { db } from './db';

const router = Router();

// Create Pay For Me Request
router.post('/', (req, res) => {
  const { requesterId, productId, total, message, productName, productImage } = req.body;
  const id = `pfm_${Date.now()}`;
  const timestamp = new Date().toISOString();
  try {
    const stmt = db.prepare(`
      INSERT INTO pay_for_me (id, requesterId, amount, reason, status, timestamp, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const items = [{ 
      id: productId, 
      name: productName || 'Product', 
      image: productImage || '', 
      price: total, 
      quantity: 1 
    }];
    stmt.run(id, requesterId, total, message, 'PENDING', timestamp, JSON.stringify(items));
    res.json({ success: true, id, timestamp });
  } catch (error) {
    console.error('Error creating sponsorship request:', error);
    res.status(500).json({ success: false, error: 'Failed to create sponsorship request.' });
  }
});

// Get User's Pay For Me Requests
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const requests = db.prepare('SELECT * FROM pay_for_me WHERE requesterId = ? ORDER BY timestamp DESC').all(userId) as any[];
    const parsedRequests = requests.map(r => ({
      ...r,
      items: JSON.parse(r.items || '[]')
    }));
    res.json(parsedRequests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Update Pay For Me Status
router.patch('/:requestId/status', (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  try {
    db.prepare('UPDATE pay_for_me SET status = ? WHERE id = ?').run(status, requestId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating pay-for-me status:', error);
    res.status(500).json({ error: 'Failed to update pay-for-me status' });
  }
});

// Helper to process expired Pay For Me requests
export const processExpiredRequests = () => {
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const twoWeeksAgoIso = new Date(twoWeeksAgo).toISOString();
  
  try {
    const expiredRequests = db.prepare('SELECT * FROM pay_for_me WHERE status = ? AND timestamp < ?').all('PENDING', twoWeeksAgoIso) as any[];
    
    const transaction = db.transaction((requests) => {
      for (const req of requests) {
        const amount = req.amount || 0;
        const creditId = `credit_${Date.now()}_${req.id}`;
        
        // Create credit
        db.prepare(`
          INSERT INTO credits (id, userId, amount, status, createdAt)
          VALUES (?, ?, ?, ?, ?)
        `).run(creditId, req.requesterId, amount, 'AVAILABLE', Date.now());

        // Update request status
        db.prepare('UPDATE pay_for_me SET status = ? WHERE id = ?').run('EXPIRED', req.id);

        // Notify user
        const notifId = `notif_${Date.now()}_${req.id}`;
        db.prepare(`
          INSERT INTO notifications (id, title, message, type, timestamp, recipientId, read)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          notifId, 'Sponsorship Expired', 
          `Your sponsorship request for ${req.id} has expired. A credit of GH₵${amount} has been added to your account.`,
          'INFO', Date.now(), req.requesterId, 0
        );
      }
    });

    transaction(expiredRequests);
  } catch (error) {
    console.error('Error processing expired requests:', error);
  }
};

export default router;
