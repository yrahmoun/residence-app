import * as SQLite from 'expo-sqlite';

let db;

export async function initDB() {
  db = await SQLite.openDatabaseAsync('residence.db');

  // Create table if not exists
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS residents (
      id INTEGER PRIMARY KEY NOT NULL,
      fullName TEXT,
      section TEXT,
      building TEXT,
      doorNumber TEXT,
      carPlate TEXT,
      phonePrimary TEXT,
      phoneSecondary TEXT
    );
  `);
}

export default function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}
