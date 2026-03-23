import { Router } from 'express';
import { db } from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// User Login
router.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      const { password_hash, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword, token });
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
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Identity already archived.' });
    }

    const id = `u${Date.now()}`;
    const handle = username.replace(/\s+/g, '_');
    const password_hash = await bcrypt.hash(password, 10);
    
    const newUser = {
      id,
      username,
      handle,
      email,
      password_hash,
      archetype: archetype || 'CYBER',
      lastLogin: new Date().toISOString(),
      rep: 100,
      level: 1,
      coins: 500,
      gems: 10,
      status: 'ACTIVE',
      role: 'client'
    };

    db.prepare(`
      INSERT INTO users (id, username, handle, email, password_hash, archetype, lastLogin, rep, level, coins, gems, status, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      newUser.id, newUser.username, newUser.handle, newUser.email, newUser.password_hash,
      newUser.archetype, newUser.lastLogin, newUser.rep, newUser.level, newUser.coins,
      newUser.gems, newUser.status, newUser.role
    );

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password_hash: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword, token });
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
    let supplier = db.prepare('SELECT * FROM suppliers WHERE id = ? OR name = ?').get(username, username) as any;
    
    if (supplier && (await bcrypt.compare(password, supplier.password_hash))) {
      const token = jwt.sign({ id: supplier.id, role: 'supplier' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, supplierId: supplier.id, token });
    } else if (username.toLowerCase() === 'supplier' && password === 'NODE_2025') {
      // Hardcoded fallback for demo
      const token = jwt.sign({ id: 'sup1', role: 'supplier' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ success: true, supplierId: 'sup1', token });
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
    const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
  }
});

export default router;
