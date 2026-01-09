import { getDB } from './db';

/**
 * Insert resident
 */
export async function addResident(resident) {
  const db = getDB();

  return await db.runAsync(
    `INSERT INTO residents 
     (fullName, section, building, doorNumber, carPlate, phonePrimary, phoneSecondary)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      resident.fullName,
      resident.section,
      resident.building,
      resident.doorNumber,
      resident.carPlate,
      resident.phonePrimary,
      resident.phoneSecondary ?? null,
    ]
  );
}

/**
 * Fetch all residents
 */
export async function getResidents() {
  const db = getDB();
  return await db.getAllAsync(`SELECT * FROM residents ORDER BY id DESC`);
}

/**
 * Search residents
 */
export async function searchResidents(keyword) {
  const db = getDB();
  const q = `%${keyword}%`;

  return await db.getAllAsync(
    `SELECT * FROM residents
     WHERE fullName LIKE ? OR carPlate LIKE ?`,
    [q, q]
  );
}
