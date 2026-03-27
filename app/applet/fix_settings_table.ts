import Database from 'better-sqlite3';
const db = new Database('./database.sqlite');
try {
  db.exec("DROP TABLE IF EXISTS settings");
  db.exec(`
    CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
  console.log("Settings table recreated successfully with key/value schema.");
} catch (e) {
  console.error(e);
}
