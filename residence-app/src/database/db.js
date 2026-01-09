import * as SQLite from 'expo-sqlite';

let db;

export async function initDB() {
  db = await SQLite.openDatabaseAsync('residents.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS residents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      section TEXT NOT NULL,
      building TEXT NOT NULL,
      door TEXT NOT NULL,
      carPlate TEXT NOT NULL,
      phone1 TEXT NOT NULL,
      phone2 TEXT
    );
  `);
}

export function getDB() {
  return db;
}
