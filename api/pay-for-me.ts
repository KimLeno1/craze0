import { Router } from 'express';
import { db } from './db';

const router = Router();

// Create Pay For Me Request
router.post('/', async (req, res) => {
  const { requesterId, productId, total, message, productName, productImage } = req.body;
  const id = `pfm_${Date.now()}`;
  const timestamp = new Date().toISOString();
  try {
    await db.collection('pay_for_me').doc(id).set({
      id,
      requesterId,
      productId,
      productName,
      productImage,
      total,
      message,
      timestamp,
      status: 'PENDING'
    });
    res.json({ success: true, id, timestamp });
  } catch (error) {
    console.error('Error creating sponsorship request:', error);
    res.status(500).json({ success: false, error: 'Failed to create sponsorship request.' });
  }
});

// Get User's Pay For Me Requests
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const snapshot = await db.collection('pay_for_me')
      .where('requesterId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();
    
    const requests = snapshot.docs.map(doc => {
      const r = doc.data();
      return {
        ...r,
        items: [{ 
          id: r.productId, 
          name: r.productName || 'Product', 
          image: r.productImage || '', 
          price: r.total, 
          quantity: 1 
        }]
      };
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Update Pay For Me Status
router.patch('/:requestId/status', async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;
  try {
    await db.collection('pay_for_me').doc(requestId).update({ status });
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating pay-for-me status:', error);
    res.status(500).json({ error: 'Failed to update pay-for-me status' });
  }
});

// Helper to process expired Pay For Me requests
export const processExpiredRequests = async () => {
  const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const twoWeeksAgoIso = new Date(twoWeeksAgo).toISOString();
  
  try {
    const snapshot = await db.collection('pay_for_me')
      .where('status', '==', 'PENDING')
      .where('timestamp', '<', twoWeeksAgoIso)
      .get();
    
    for (const docSnap of snapshot.docs) {
      const req = docSnap.data();
      const amount = req.total || 0;
      const creditId = `credit_${Date.now()}_${req.id}`;
      
      await db.runTransaction(async (transaction) => {
        // Create credit
        const creditRef = db.collection('credits').doc(creditId);
        transaction.set(creditRef, {
          id: creditId,
          userId: req.requesterId,
          amount,
          status: 'AVAILABLE',
          createdAt: new Date().toISOString()
        });

        // Update request status
        const requestRef = db.collection('pay_for_me').doc(req.id);
        transaction.update(requestRef, { status: 'EXPIRED' });

        // Notify user
        const notifId = `notif_${Date.now()}_${req.id}`;
        const notifRef = db.collection('notifications').doc(notifId);
        transaction.set(notifRef, {
          id: notifId,
          title: 'Sponsorship Expired',
          message: `Your sponsorship request for ${req.id} has expired. A credit of GH₵${amount} has been added to your account.`,
          type: 'INFO',
          timestamp: Date.now(),
          recipientId: req.requesterId,
          read: false
        });
      });
    }
  } catch (error) {
    console.error('Error processing expired requests:', error);
  }
};

export default router;
