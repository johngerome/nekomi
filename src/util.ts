import axios from 'axios';
import consola from 'consola';

export const fetchCatImage = async (): Promise<string | null> => {
  try {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    return res.data[0]?.url || null;
  } catch (err) {
    consola.error('Error fetching cat image:', err);
    return null;
  }
};
