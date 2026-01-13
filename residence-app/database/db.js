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

  // --- lightweight sync metadata (added later, so we migrate safely) ---
  // 1 = needs to be pushed to backend (new or edited locally)
  const cols = await db.getAllAsync(`PRAGMA table_info(residents);`);
  const colNames = cols.map(c => c.name);
  if (!colNames.includes('needsSync')) {
    await db.execAsync(`ALTER TABLE residents ADD COLUMN needsSync INTEGER NOT NULL DEFAULT 1;`);
  }

  // Track deletions made offline so Sync can delete them from backend later.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pending_deletes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      carPlate TEXT,
      numeroDeMacaron TEXT
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

/** Get residents that need to be pushed to backend */
export async function getResidentsNeedingSync() {
  const db = getDB();
  return await db.getAllAsync(`SELECT * FROM residents WHERE needsSync = 1`);
}

/** Mark a resident as synced */
export async function markResidentSyncedByLocalId(localId) {
  const db = getDB();
  await db.runAsync(`UPDATE residents SET needsSync = 0 WHERE id = ?`, [localId]);
}

/** Mark a resident as synced using its unique keys (carPlate + numeroDeMacaron) */
export async function markResidentSyncedByKeys({ carPlate, numeroDeMacaron }) {
  const db = getDB();
  await db.runAsync(
    `UPDATE residents SET needsSync = 0 WHERE carPlate = ? OR numeroDeMacaron = ?`,
    [carPlate, numeroDeMacaron]
  );
}

/** Add a pending deletion (so sync can delete it from backend later) */
export async function addPendingDelete({ carPlate, numeroDeMacaron }) {
  const db = getDB();
  await db.runAsync(
    `INSERT INTO pending_deletes (carPlate, numeroDeMacaron) VALUES (?, ?)`
    ,
    [carPlate || null, numeroDeMacaron || null]
  );
}

/** Get all pending deletions */
export async function getPendingDeletes() {
  const db = getDB();
  return await db.getAllAsync(`SELECT * FROM pending_deletes`);
}

/** Remove a pending deletion row */
export async function removePendingDelete(id) {
  const db = getDB();
  await db.runAsync(`DELETE FROM pending_deletes WHERE id = ?`, [id]);
}

/** Insert residents, ignore duplicates */
export async function insertResidentsIgnoreDuplicates(residents) {
  const db = getDB();

  const query = `
    INSERT OR IGNORE INTO residents
    (fullName, phonePrimary, phoneSecondary, carPlate, section, building, door, numeroDeMacaron, needsSync)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      r.numeroDeMacaron,
      0 // pulled from backend => already synced
    ]);
  }
}
