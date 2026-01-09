import axios from 'axios';
import { BACKEND_URL } from '@env';

export const fetchResidents = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/residents`);
    return res.data;
  } catch (err) {
    console.log('Fetch error:', err.message);
    return [];
  }
};

export const registerResident = async (resident) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/residents`, resident);
    return res.data;
  } catch (err) {
    console.log('Register error:', err.message);
    throw err;
  }
};
