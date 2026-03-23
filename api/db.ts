import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'data/database.sqlite');
const db = new Database(dbPath);

// Create tables based on firebase-blueprint.json
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    handle TEXT,
    username TEXT,
    email TEXT,
    archetype TEXT,
    rep REAL,
    level INTEGER,
    coins REAL,
    gems REAL,
    status TEXT,
    lastLogin TEXT,
    totalSpent REAL,
    role TEXT,
    password TEXT,
    phone TEXT,
    stats TEXT -- JSON string
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
    details TEXT, -- JSON string
    inStock BOOLEAN,
    isNew BOOLEAN,
    viewers REAL,
    stockCount REAL,
    hypeScore REAL,
    velocityScore REAL,
    isHallOfFame BOOLEAN,
    brand TEXT,
    tags TEXT, -- JSON string
    supplierId TEXT,
    sizes TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT,
    password TEXT,
    contactEmail TEXT,
    region TEXT,
    status TEXT,
    performanceScore REAL,
    totalRevenueYield REAL,
    joinedDate TEXT
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
    items TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS promos (
    id TEXT PRIMARY KEY,
    code TEXT,
    type TEXT,
    value REAL,
    description TEXT,
    expiresAt TEXT,
    usageLimit REAL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    type TEXT,
    timestamp TEXT,
    read BOOLEAN,
    recipientId TEXT
  );

  CREATE TABLE IF NOT EXISTS credits (
    id TEXT PRIMARY KEY,
    userId TEXT,
    amount REAL,
    createdAt REAL,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    username TEXT,
    userImage TEXT,
    image TEXT,
    caption TEXT,
    likes REAL,
    loves REAL,
    likedBy TEXT, -- JSON string
    lovedBy TEXT, -- JSON string
    timestamp REAL,
    tags TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    bundlePrice REAL,
    products TEXT, -- JSON string
    expiresIn REAL
  );

  CREATE TABLE IF NOT EXISTS pay_for_me (
    id TEXT PRIMARY KEY,
    requesterId TEXT,
    requesterName TEXT,
    amount REAL,
    reason TEXT,
    status TEXT,
    timestamp REAL,
    items TEXT -- JSON string
  );

  CREATE TABLE IF NOT EXISTS flash_sales (
    id TEXT PRIMARY KEY,
    name TEXT,
    discount REAL,
    endsAt TEXT,
    active BOOLEAN
  );

  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    data TEXT -- JSON string
  );
`);

export { db };
