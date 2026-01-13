import axios from 'axios';
import { BACKEND_URL } from '@env';

// ✅ remove trailing slash if present to avoid //api
const BASE = (BACKEND_URL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${BASE}/api`,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' }
});

/** Fetch all residents from backend */
export const fetchResidents = async () => {
  const res = await api.get('/residents');
  return res.data;
};

/** Register a single resident */
export const registerResident = async (resident) => {
  const res = await api.post('/residents', resident);
  return res.data;
};

/** Update a resident (MongoDB id) */
export const updateResident = async (id, resident) => {
  const res = await api.put(`/residents/${id}`, resident);
  return res.data;
};

/** Delete a resident (MongoDB id) */
export const deleteResident = async (id) => {
  const res = await api.delete(`/residents/${id}`);
  return res.data;
};

/**
 * Sync local residents with backend
 * Throws error if sync fails
 */
export const syncResidents = async (localResidents, pendingDeletes = []) => {
  try {
    // 1️⃣ Fetch backend data
    const backendResidents = await fetchResidents();

    const backendByCarPlate = new Map(
      backendResidents.map(r => [String(r.carPlate || '').toLowerCase(), r])
    );
    const backendByMacaron = new Map(
      backendResidents.map(r => [String(r.numeroDeMacaron || '').toLowerCase(), r])
    );

    let createdCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;

    // 2️⃣ Push creates / updates
    for (const r of localResidents) {
      const carKey = String(r.carPlate || '').toLowerCase();
      const macKey = String(r.numeroDeMacaron || '').toLowerCase();

      const backendMatch =
        (carKey && backendByCarPlate.get(carKey)) ||
        (macKey && backendByMacaron.get(macKey));

      if (!backendMatch) {
        await registerResident(r);
        createdCount++;
        continue;
      }

      // only update if something changed
      const fields = [
        'fullName',
        'section',
        'building',
        'door',
        'carPlate',
        'phonePrimary',
        'phoneSecondary',
        'numeroDeMacaron'
      ];

      let changed = false;
      for (const f of fields) {
        const a = String(backendMatch[f] ?? '');
        const b = String(r[f] ?? '');
        if (a !== b) {
          changed = true;
          break;
        }
      }

      if (changed) {
        await updateResident(backendMatch._id, r);
        updatedCount++;
      }
    }

    // 3️⃣ Process pending deletes
    for (const d of pendingDeletes) {
      const carKey = String(d.carPlate || '').toLowerCase();
      const macKey = String(d.numeroDeMacaron || '').toLowerCase();

      const backendMatch =
        (carKey && backendByCarPlate.get(carKey)) ||
        (macKey && backendByMacaron.get(macKey));

      if (backendMatch) {
        await deleteResident(backendMatch._id);
        deletedCount++;
      }
    }

    return {
      syncedCount: createdCount, // backwards-compatible
      createdCount,
      updatedCount,
      deletedCount
    };
  } catch (err) {
    console.log('Sync failed:', err?.response?.status, err?.message);
    throw new Error('SYNC_FAILED');
  }
};
