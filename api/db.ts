import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    handle TEXT,
    email TEXT,
    password TEXT,
    archetype TEXT,
    rep INTEGER,
    level INTEGER,
    coins INTEGER,
    gems INTEGER,
    status TEXT,
    lastLogin TEXT,
    totalSpent INTEGER,
    loyaltyPoints INTEGER DEFAULT 0,
    joinedAt INTEGER
  );

  CREATE TABLE IF NOT EXISTS quiz_results (
    userId TEXT PRIMARY KEY,
    results JSON,
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    type TEXT, -- 'EARN' or 'REDEEM'
    amount INTEGER,
    reason TEXT,
    timestamp INTEGER
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
    inStock BOOLEAN DEFAULT 1,
    details JSON,
    sizes JSON,
    isCustom BOOLEAN DEFAULT 0,
    priceRange JSON,
    customizationFields JSON
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
    activeProducts INTEGER DEFAULT 0,
    commissionRate REAL DEFAULT 0.10
  );

  CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY, -- User ID or Supplier ID
    balance INTEGER DEFAULT 0,
    updatedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS wallet_transactions (
    id TEXT PRIMARY KEY,
    walletId TEXT,
    amount INTEGER,
    type TEXT, -- 'EARNING', 'PAYOUT', 'COMMISSION'
    description TEXT,
    timestamp TEXT,
    orderId TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    userId TEXT,
    totalPrice INTEGER,
    status TEXT,
    timestamp TEXT,
    items JSON,
    tracking TEXT,
    paystackReference TEXT
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
    items JSON,
    total INTEGER,
    status TEXT,
    timestamp TEXT,
    message TEXT,
    targetEmail TEXT,
    payerName TEXT,
    payerContact TEXT
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

  CREATE TABLE IF NOT EXISTS security_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    details TEXT NOT NULL,
    ip TEXT NOT NULL
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

  CREATE TABLE IF NOT EXISTS drops (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    startTime INTEGER,
    endTime INTEGER,
    productIds JSON,
    isActive BOOLEAN DEFAULT 1,
    rarity TEXT
  );

  -- --- USER FEATURES ---
  CREATE TABLE IF NOT EXISTS wishlist_items (
    userId TEXT,
    productId TEXT,
    addedAt INTEGER,
    PRIMARY KEY (userId, productId)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    userId TEXT,
    productId TEXT,
    quantity INTEGER DEFAULT 1,
    selectedSize TEXT,
    selectedColor TEXT,
    addedAt INTEGER,
    PRIMARY KEY (userId, productId, selectedSize, selectedColor)
  );

  CREATE TABLE IF NOT EXISTS mystery_box_logs (
    id TEXT PRIMARY KEY,
    userId TEXT,
    boxType TEXT,
    cost INTEGER,
    rewardProductId TEXT,
    rewardType TEXT,
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS game_scores (
    id TEXT PRIMARY KEY,
    userId TEXT,
    gameId TEXT,
    score INTEGER,
    rank TEXT,
    rewardRep INTEGER,
    details JSON,
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS stylist_sessions (
    id TEXT PRIMARY KEY,
    userId TEXT,
    messages TEXT, -- JSON array
    recommendations TEXT, -- JSON array of product IDs
    timestamp INTEGER
  );

  CREATE TABLE IF NOT EXISTS try_on_history (
    id TEXT PRIMARY KEY,
    userId TEXT,
    productId TEXT,
    userImage TEXT, -- Base64 or URL
    resultImage TEXT, -- Base64 or URL
    timestamp INTEGER
  );
  
  CREATE TABLE IF NOT EXISTS user_anomaly_sessions (
    userId TEXT PRIMARY KEY,
    eventId TEXT,
    startTime INTEGER,
    endTime INTEGER
  );

  CREATE TABLE IF NOT EXISTS withdrawals (
    id TEXT PRIMARY KEY,
    userId TEXT,
    amount INTEGER,
    bankCode TEXT,
    bankName TEXT,
    accountNumber TEXT,
    accountName TEXT,
    recipientCode TEXT,
    transferCode TEXT,
    reference TEXT,
    status TEXT,
    timestamp TEXT
  );
`);

export default db;
