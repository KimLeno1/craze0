import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import apiRouter from './api/index.js';
import db from './api/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Seed initial data if tables are empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    const MOCK_USERS = [
      { id: 'u1', handle: 'Viper_X', email: 'viper@archivers.net', archetype: 'CYBER', rep: 4500, level: 7, coins: 1200, gems: 45, status: 'ACTIVE', lastLogin: '2h ago', totalSpent: 850 },
      { id: 'u2', handle: 'Ghost_Shell', email: 'ghost@void.com', archetype: 'VOID', rep: 8900, level: 10, coins: 5400, gems: 120, status: 'ACTIVE', lastLogin: '15m ago', totalSpent: 2400 },
      { id: 'u3', handle: 'Luxe_Lord', email: 'lord@heirloom.io', archetype: 'LUXE', rep: 12000, level: 12, coins: 8900, gems: 300, status: 'ACTIVE', lastLogin: '5d ago', totalSpent: 12500 },
      { id: 'u4', handle: 'Glitch_Boi', email: 'glitch@chaos.org', archetype: 'CYBER', rep: 1200, level: 4, coins: 400, gems: 5, status: 'BANNED', lastLogin: '1y ago', totalSpent: 0 },
    ];
    const insertUser = db.prepare('INSERT INTO users (id, handle, email, archetype, rep, level, coins, gems, status, lastLogin, totalSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertStats = db.prepare('INSERT INTO user_stats (userId, stats) VALUES (?, ?)');
    for (const u of MOCK_USERS) {
      insertUser.run(u.id, u.handle, u.email, u.archetype, u.rep, u.level, u.coins, u.gems, u.status, u.lastLogin, u.totalSpent);
      
      const initialStats = {
        userId: u.id,
        dailyGameAttempts: 3,
        lastGameReset: new Date().toISOString(),
        quests: [],
        selectedPath: null,
        aiTryOnsUsedToday: 0,
        tickets: 0,
        brandSubscriptions: [],
        tagSubscriptions: [],
        achievements: []
      };
      insertStats.run(u.id, JSON.stringify(initialStats));
    }
  }

  const supplierCount = db.prepare('SELECT COUNT(*) as count FROM suppliers').get() as { count: number };
  if (supplierCount.count === 0) {
    const MOCK_SUPPLIERS = [
      { id: 'sup1', name: 'CyberKnit Industries', contactEmail: 'ops@cyberknit.nt', region: 'Neo Tokyo Central', status: 'ACTIVE', performanceScore: 94, totalRevenueYield: 450000, joinedDate: '2024-01-12' },
      { id: 'sup2', name: 'Void Loom Textiles', contactEmail: 'archive@voidloom.de', region: 'Neo Berlin', status: 'ACTIVE', performanceScore: 82, totalRevenueYield: 280000, joinedDate: '2024-03-05' },
      { id: 'sup3', name: 'Ethereal Silks', contactEmail: 'luxury@ethereal.sh', region: 'Emerald Heights', status: 'RESTRICTED', performanceScore: 45, totalRevenueYield: 120000, joinedDate: '2024-06-20' },
    ];
    const insertSupplier = db.prepare('INSERT INTO suppliers (id, name, contactEmail, region, status, performanceScore, totalRevenueYield, joinedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const s of MOCK_SUPPLIERS) {
      insertSupplier.run(s.id, s.name, s.contactEmail, s.region, s.status, s.performanceScore, s.totalRevenueYield, s.joinedDate);
    }
  }

  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (productCount.count === 0) {
    const MOCK_PRODUCTS = [
      {
        id: '1',
        name: 'Midnight Cyber Cloak',
        price: 850,
        originalPrice: 1200,
        shippingFee: 45,
        category: 'Apparel',
        gender: 'UNISEX',
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
        description: 'Limited edition technical outerwear with integrated fiber-optic lining.',
        isNew: 1,
        velocityScore: 95,
        hypeScore: 98,
        isHallOfFame: 0,
        supplierId: 'sup1',
        tags: JSON.stringify(['CYBER', 'TECHWEAR', 'POWER']),
        appeal: 'STREETS',
        viewers: 124,
        stockCount: 3,
        inStock: 1
      },
      {
        id: '2',
        name: 'Neon Glitch Sneakers',
        price: 350,
        originalPrice: 450,
        shippingFee: 25,
        category: 'Accessories',
        gender: 'UNISEX',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
        description: 'Deconstructed footwear featuring reactive "Glitch" sole technology.',
        isNew: 0,
        velocityScore: 78,
        hypeScore: 82,
        isHallOfFame: 0,
        supplierId: 'sup1',
        tags: JSON.stringify(['CYBER', 'STREETWEAR']),
        appeal: 'STREETS',
        viewers: 89,
        stockCount: 12,
        inStock: 1
      },
      {
        id: '3',
        name: 'Holographic Utility Vest',
        price: 220,
        originalPrice: 300,
        shippingFee: 20,
        category: 'Apparel',
        gender: 'MALE',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
        description: 'Modular storage solution with iridescent structural panels.',
        isNew: 1,
        velocityScore: 60,
        hypeScore: 75,
        isHallOfFame: 0,
        supplierId: 'sup1',
        tags: JSON.stringify(['CYBER', 'POWER', 'UTILITY']),
        appeal: 'CASUAL',
        viewers: 56,
        stockCount: 5,
        inStock: 1
      },
      {
        id: '4',
        name: 'Liquid Chrome Mini Bag',
        price: 195,
        originalPrice: 250,
        shippingFee: 15,
        category: 'Accessories',
        gender: 'FEMALE',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
        description: 'Sculptural accessory finished in vacuum-plated high-shine silver.',
        isNew: 0,
        velocityScore: 92,
        hypeScore: 94,
        isHallOfFame: 1,
        supplierId: 'sup2',
        tags: JSON.stringify(['CLASSIC', 'LUXE', 'POWER']),
        appeal: 'OLD MONEY',
        viewers: 212,
        stockCount: 2,
        inStock: 1
      },
      {
        id: '5',
        name: 'Titanium Link Choker',
        price: 145,
        originalPrice: 190,
        shippingFee: 10,
        category: 'Accessories',
        gender: 'UNISEX',
        image: 'https://images.unsplash.com/photo-1573408302354-014545c92557?auto=format&fit=crop&q=80&w=800',
        description: 'Heavyweight industrial chain designed for the modern metropolitan.',
        isNew: 0,
        velocityScore: 20,
        hypeScore: 40,
        isHallOfFame: 0,
        supplierId: 'sup2',
        tags: JSON.stringify(['VOID', 'INDUSTRIAL']),
        appeal: 'STREETS',
        viewers: 15,
        stockCount: 0,
        inStock: 0
      },
      {
        id: '6',
        name: 'Void Fragrance No. 01',
        price: 120,
        originalPrice: 150,
        shippingFee: 15,
        category: 'Beauty',
        gender: 'UNISEX',
        image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800',
        description: 'Notes of cold metal, ozone, and dark cedar.',
        isNew: 0,
        velocityScore: 55,
        hypeScore: 65,
        isHallOfFame: 0,
        supplierId: 'sup2',
        tags: JSON.stringify(['OLD MONEY', 'CLASSIC', 'VOID']),
        appeal: 'OLD MONEY',
        viewers: 34,
        stockCount: 45,
        inStock: 1
      }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, price, originalPrice, image, category, gender, 
        description, isNew, velocityScore, hypeScore, isHallOfFame, 
        supplierId, shippingFee, tags, appeal, viewers, stockCount, inStock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of MOCK_PRODUCTS) {
      insertProduct.run(
        p.id, p.name, p.price, p.originalPrice, p.image, p.category, p.gender,
        p.description, p.isNew, p.velocityScore, p.hypeScore, p.isHallOfFame,
        p.supplierId, p.shippingFee, p.tags, p.appeal, p.viewers, p.stockCount, p.inStock
      );
    }
  }

  const jackpotCount = db.prepare('SELECT COUNT(*) as count FROM jackpot_prizes').get() as { count: number };
  if (jackpotCount.count === 0) {
    const MOCK_JACKPOTS = [
      { id: 'j1', name: 'Cyber-Core Processor', description: 'Ultra-rare hardware for the ultimate rig.', value: 5000, rarity: 'LEGENDARY', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400', isActive: 1 },
      { id: 'j2', name: 'Neon Glitch Aura', handle: 'A digital shimmer that follows your every move.', value: 2500, rarity: 'EPIC', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400', isActive: 1 },
      { id: 'j3', name: '1000 Gems Pack', description: 'A massive stack of premium currency.', value: 1000, rarity: 'RARE', image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=400', isActive: 1 },
    ];
    const insertJackpot = db.prepare('INSERT INTO jackpot_prizes (id, name, description, value, rarity, image, isActive) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const j of MOCK_JACKPOTS) {
      insertJackpot.run(j.id, j.name, j.description || j.handle, j.value, j.rarity, j.image, j.isActive);
    }
  }

  // Use the modular API router
  app.use('/api', apiRouter);

  // Recommendations logic (kept in server for now or could be moved)
  app.get('/api/recommendations/:userId', (req, res) => {
    const { userId } = req.params;
    const prefsRow = db.prepare('SELECT * FROM user_preferences WHERE userId = ?').get(userId) as any;
    const historyRow = db.prepare('SELECT * FROM user_history WHERE userId = ?').get(userId) as any;
    const prefs = prefsRow ? JSON.parse(prefsRow.preferences) : null;
    const history = historyRow ? JSON.parse(historyRow.history) : { viewedProductIds: [], wishlistedProductIds: [], purchasedProductIds: [] };
    const allProducts = db.prepare('SELECT * FROM products').all() as any[];
    
    const recommendations = allProducts
      .filter(p => !history.purchasedProductIds.includes(p.id))
      .map(p => {
        let score = 0;
        const pTags = JSON.parse(p.tags || '[]');
        if (prefs) {
          if (prefs.preferredCategories?.includes(p.category)) score += 10;
          if (prefs.preferredGenders?.includes(p.gender)) score += 10;
          if (prefs.styleArchetype) {
            const userArchetypes = prefs.styleArchetype.split(',').map((s: string) => s.trim());
            userArchetypes.forEach((archetype: string) => {
              if (pTags.includes(archetype)) score += 15;
            });
          }
        }
        history.viewedProductIds.forEach(vid => {
          const viewedProduct = allProducts.find(ap => ap.id === vid);
          if (viewedProduct && viewedProduct.category === p.category) score += 2;
        });
        history.wishlistedProductIds.forEach(wid => {
          const wishProduct = allProducts.find(ap => ap.id === wid);
          if (wishProduct && wishProduct.category === p.category) score += 5;
        });
        score += (p.hypeScore || 0) / 100;
        score += (p.velocityScore || 0) / 100;
        return { ...p, score, tags: pTags };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    res.json(recommendations);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
