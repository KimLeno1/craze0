const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

const tables = {
  users: [
    { name: 'id', type: 'TEXT PRIMARY KEY' },
    { name: 'handle', type: 'TEXT' },
    { name: 'email', type: 'TEXT UNIQUE' },
    { name: 'archetype', type: 'TEXT' },
    { name: 'rep', type: 'INTEGER DEFAULT 0' },
    { name: 'level', type: 'INTEGER DEFAULT 1' },
    { name: 'coins', type: 'INTEGER DEFAULT 0' },
    { name: 'gems', type: 'INTEGER DEFAULT 0' },
    { name: 'status', type: 'TEXT DEFAULT "ACTIVE"' },
    { name: 'lastLogin', type: 'TEXT' },
    { name: 'totalSpent', type: 'REAL DEFAULT 0' }
  ],
  products: [
    { name: 'id', type: 'TEXT PRIMARY KEY' },
    { name: 'name', type: 'TEXT' },
    { name: 'price', type: 'INTEGER' },
    { name: 'originalPrice', type: 'INTEGER' },
    { name: 'image', type: 'TEXT' },
    { name: 'category', type: 'TEXT' },
    { name: 'gender', type: 'TEXT' },
    { name: 'description', type: 'TEXT' },
    { name: 'isNew', type: 'BOOLEAN DEFAULT 1' },
    { name: 'velocityScore', type: 'INTEGER DEFAULT 0' },
    { name: 'hypeScore', type: 'INTEGER DEFAULT 0' },
    { name: 'isHallOfFame', type: 'BOOLEAN DEFAULT 0' },
    { name: 'supplierId', type: 'TEXT' },
    { name: 'shippingFee', type: 'INTEGER DEFAULT 0' },
    { name: 'tags', type: 'JSON' },
    { name: 'appeal', type: 'TEXT' },
    { name: 'viewers', type: 'INTEGER DEFAULT 0' },
    { name: 'stockCount', type: 'INTEGER DEFAULT 0' },
    { name: 'inStock', type: 'BOOLEAN DEFAULT 1' }
  ],
  settings: [
    { name: 'key', type: 'TEXT PRIMARY KEY' },
    { name: 'value', type: 'TEXT' }
  ]
};

for (const [tableName, columns] of Object.entries(tables)) {
  try {
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(tableName);
    if (!tableExists) {
      const colDefs = columns.map(c => `${c.name} ${c.type}`).join(', ');
      db.exec(`CREATE TABLE ${tableName} (${colDefs})`);
      console.log(`Created table ${tableName}`);
    } else {
      const existingCols = db.prepare(`PRAGMA table_info(${tableName})`).all();
      const existingColNames = existingCols.map(c => c.name);
      for (const col of columns) {
        if (!existingColNames.includes(col.name)) {
          db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}`);
          console.log(`Added column ${col.name} to table ${tableName}`);
        }
      }
    }
  } catch (e) {
    console.error(`Error processing table ${tableName}:`, e);
  }
}

console.log("Database schema synchronization complete.");
