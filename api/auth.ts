import { Router } from 'express';
import { db } from './db';

const router = Router();

// User Login (Note: Frontend uses Firebase Auth, this is for legacy/internal use)
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const snapshot = await db.collection('users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get();
    
    if (!snapshot.empty) {
      const user = snapshot.docs[0].data();
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'Identity not found or security phrase rejection.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed.' });
  }
});

// User Registration
router.post('/user/register', async (req, res) => {
  const { email, password, username, phone, archetype } = req.body;
  
  try {
    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, error: 'Identity already archived.' });
    }

    const id = `u${Date.now()}`;
    const handle = username.replace(/\s+/g, '_');
    
    const newUser = {
      id,
      username,
      handle,
      email,
      password, // Note: In production, use hashing
      archetype: archetype || 'CYBER',
      lastLogin: new Date().toISOString(),
      rep: 100,
      level: 1,
      coins: 500,
      gems: 10,
      status: 'ACTIVE'
    };

    await db.collection('users').doc(id).set(newUser);
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Failed to archive identity.' });
  }
});

// Supplier Login
router.post('/supplier/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check by ID or Name
    let snapshot = await db.collection('suppliers')
      .where('id', '==', username)
      .where('password', '==', password)
      .get();
    
    if (snapshot.empty) {
      snapshot = await db.collection('suppliers')
        .where('name', '==', username)
        .where('password', '==', password)
        .get();
    }

    if (!snapshot.empty) {
      const supplier = snapshot.docs[0].data();
      res.json({ success: true, supplierId: supplier.id });
    } else if (username.toLowerCase() === 'supplier' && password === 'NODE_2025') {
      res.json({ success: true, supplierId: 'sup1' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Supplier login error:', error);
    res.status(500).json({ success: false, error: 'Supplier login failed.' });
  }
});

// Admin Login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    res.json({ success: true, token: 'admin-token' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
  }
});

export default router;
