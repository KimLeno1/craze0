import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    handle TEXT,
    email TEXT,
    archetype TEXT,
    rep INTEGER,
    level INTEGER,
    coins INTEGER,
    gems INTEGER,
    status TEXT,
    lastLogin TEXT,
    totalSpent INTEGER
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    price INTEGER,
    originalPrice INTEGER,
    image TEXT,
    category TEXT,
    gender TEXT,
    description TEXT,
    isNew BOOLEAN,
    velocityScore INTEGER,
    hypeScore INTEGER,
    isHallOfFame BOOLEAN,
    supplierId TEXT,
    shippingFee INTEGER,
    tags JSON,
    appeal TEXT,
    viewers INTEGER,
    stockCount INTEGER DEFAULT 0,
    inStock BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS suppliers (
    id TEXT PRIMARY KEY,
    name TEXT,
    contactEmail TEXT,
    region TEXT,
    status TEXT,
    performanceScore INTEGER,
    totalRevenueYield INTEGER,
    joinedDate TEXT,
    rating REAL DEFAULT 5.0,
    activeProducts INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    totalPrice INTEGER,
    status TEXT,
    timestamp TEXT,
    items JSON,
    tracking TEXT
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    title TEXT,
    message TEXT,
    type TEXT,
    target TEXT,
    timestamp TEXT,
    read BOOLEAN,
    recipientId TEXT
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    userId TEXT PRIMARY KEY,
    stats JSON
  );

  CREATE TABLE IF NOT EXISTS promo_codes (
    id TEXT PRIMARY KEY,
    code TEXT,
    type TEXT,
    value INTEGER,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS price_anomalies (
    id TEXT PRIMARY KEY,
    productId TEXT,
    anomalyEndTime INTEGER,
    discountPercent INTEGER,
    price INTEGER
  );

  CREATE TABLE IF NOT EXISTS bundles (
    id TEXT PRIMARY KEY,
    name TEXT,
    price INTEGER,
    items JSON,
    image TEXT,
    supplierId TEXT
  );

  CREATE TABLE IF NOT EXISTS pay_for_me_requests (
    id TEXT PRIMARY KEY,
    userId TEXT,
    productId TEXT,
    status TEXT,
    timestamp TEXT,
    message TEXT,
    targetEmail TEXT
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id TEXT PRIMARY KEY,
    userId TEXT,
    userHandle TEXT,
    image TEXT,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    reports INTEGER DEFAULT 0,
    timestamp TEXT,
    weekId TEXT
  );

  CREATE TABLE IF NOT EXISTS social_comments (
    id TEXT PRIMARY KEY,
    postId TEXT,
    userId TEXT,
    userHandle TEXT,
    text TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS social_reports (
    id TEXT PRIMARY KEY,
    postId TEXT,
    userId TEXT,
    reason TEXT,
    timestamp TEXT
  );

  CREATE TABLE IF NOT EXISTS social_interactions (
    userId TEXT,
    postId TEXT,
    type TEXT, -- 'LIKE' or 'DISLIKE'
    PRIMARY KEY (userId, postId)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS user_preferences (
    userId TEXT PRIMARY KEY,
    preferences JSON
  );

  CREATE TABLE IF NOT EXISTS user_history (
    userId TEXT PRIMARY KEY,
    history JSON
  );

  CREATE TABLE IF NOT EXISTS jackpot_prizes (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    value INTEGER,
    rarity TEXT,
    image TEXT,
    isActive BOOLEAN
  );
`);

export default db;
