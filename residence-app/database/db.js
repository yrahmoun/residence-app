import * as SQLite from 'expo-sqlite';

let db;

export async function initDB() {
  db = await SQLite.openDatabaseAsync('residents.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS residents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      phonePrimary TEXT NOT NULL,
      phoneSecondary TEXT,
      carPlate TEXT NOT NULL UNIQUE,
      section TEXT NOT NULL,
      building TEXT NOT NULL,
      door TEXT NOT NULL,
      numeroDeMacaron TEXT NOT NULL UNIQUE
    );
  `);
}

export function getDB() {
  return db;
}

/** Get all local residents */
export async function getAllResidents() {
  const db = getDB();
  return await db.getAllAsync(`SELECT * FROM residents`);
}

/** Insert residents, ignore duplicates */
export async function insertResidentsIgnoreDuplicates(residents) {
  const db = getDB();

  const query = `
    INSERT OR IGNORE INTO residents
    (fullName, phonePrimary, phoneSecondary, carPlate, section, building, door, numeroDeMacaron)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  for (const r of residents) {
    await db.runAsync(query, [
      r.fullName,
      r.phonePrimary,
      r.phoneSecondary || null,
      r.carPlate,
      r.section,
      r.building,
      r.door,
      r.numeroDeMacaron
    ]);
  }
}
