import axios from 'axios';
import { BACKEND_URL } from '@env';

/** Fetch all residents from backend */
export const fetchResidents = async () => {
  const res = await axios.get(`${BACKEND_URL}/api/residents`);
  return res.data;
};

/** Register a single resident */
export const registerResident = async (resident) => {
  const res = await axios.post(`${BACKEND_URL}/api/residents`, resident);
  return res.data;
};

/**
 * Sync local residents with backend
 * Throws error if sync fails
 */
export const syncResidents = async (localResidents) => {
  try {
    // 1️⃣ Fetch backend data
    const backendResidents = await fetchResidents();

    const backendCarPlates = backendResidents.map(r =>
      r.carPlate.toLowerCase()
    );
    const backendMacarons = backendResidents.map(r =>
      r.numeroDeMacaron.toLowerCase()
    );

    // 2️⃣ Filter non-duplicates
    const newResidents = localResidents.filter(r =>
      !backendCarPlates.includes(r.carPlate.toLowerCase()) &&
      !backendMacarons.includes(r.numeroDeMacaron.toLowerCase())
    );

    if (newResidents.length === 0) {
      return { syncedCount: 0 }; // nothing to sync, not an error
    }

    let syncedCount = 0;

    // 3️⃣ Push to backend
    for (const resident of newResidents) {
      await registerResident(resident);
      syncedCount++;
    }

    return { syncedCount };

  } catch (err) {
    console.log('Sync failed:', err.message);
    throw new Error('SYNC_FAILED');
  }
};
