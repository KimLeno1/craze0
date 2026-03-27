import Database from 'better-sqlite3';
const db = new Database('./database.sqlite');
try {
  const info = db.prepare("PRAGMA table_info(settings)").all();
  console.log(JSON.stringify(info, null, 2));
} catch (e) {
  console.error(e);
}
