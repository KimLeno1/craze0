import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../database.sqlite');
export const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT,
    email TEXT UNIQUE,
    password_hash TEXT,
    handle TEXT,
    rep INTEGER DEFAULT 0,
    archetype TEXT,
    level INTEGER DEFAULT 1,
    coins INTEGER DEFAULT 0,
    gems INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    lastLogin TEXT,
    totalSpent REAL DEFAULT 0,
    role TEXT DEFAULT 'client',
    stats TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price REAL,
    originalPrice REAL,
    shippingFee REAL,
    image TEXT,
    category TEXT,
    gender TEXT,
    description TEXT,
    details TEXT, -- JSON
    inStock INTEGER, -- Boolean
    isNew INTEGER, -- Boolean
    viewers INTEGER,
    stockCount INTEGER,
    hypeScore REAL,
    velocityScore REAL,
    isHallOfFame INTEGER, -- Boolean
    brand TEXT,
    tags TEXT, -- JSON
    supplierId TEXT,
    sizes TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT,
    contactEmail TEXT,
    region TEXT,
    status TEXT,
    performanceScore REAL,
    totalRevenueYield REAL,
    joinedDate TEXT,
    password_hash TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    userName TEXT,
    total REAL,
    status TEXT,
    timestamp TEXT,
    trackingNumber TEXT,
    deliveryAddress TEXT,
    phone TEXT,
    items TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS promos (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE,
    type TEXT,
    value REAL,
    discount REAL, -- Added to match admin.ts
    description TEXT,
    expiresAt TEXT,
    expiryDate TEXT, -- Added to match admin.ts
    usageLimit INTEGER,
    active INTEGER -- Added to match admin.ts
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    type TEXT,
    timestamp INTEGER,
    read INTEGER, -- Boolean
    recipientId TEXT
  );

  CREATE TABLE IF NOT EXISTS credits (
    id TEXT PRIMARY KEY,
    userId TEXT,
    amount REAL,
    createdAt INTEGER,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    username TEXT,
    userImage TEXT,
    image TEXT,
    caption TEXT,
    likes INTEGER DEFAULT 0,
    loves INTEGER DEFAULT 0,
    likedBy TEXT, -- JSON
    lovedBy TEXT, -- JSON
    timestamp INTEGER,
    tags TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    bundlePrice REAL,
    price REAL, -- Added to match admin.ts
    products TEXT, -- JSON
    items TEXT, -- Added to match admin.ts
    image TEXT, -- Added to match admin.ts
    expiresIn INTEGER
  );

  CREATE TABLE IF NOT EXISTS pay_for_me (
    id TEXT PRIMARY KEY,
    requesterId TEXT,
    requesterName TEXT,
    amount REAL,
    reason TEXT,
    status TEXT,
    timestamp INTEGER,
    items TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    siteName TEXT,
    maintenanceMode INTEGER,
    globalDiscount REAL,
    flash_sale_window TEXT, -- JSON
    jackpot_product_id TEXT
  );
`);

export default db;
