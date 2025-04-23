import axios from 'axios';

export const fetchCatImage = async (): Promise<string | null> => {
  try {
    const res = await axios.get('https://api.thecatapi.com/v1/images/search');
    return res.data[0]?.url || null;
  } catch (err) {
    console.error('Error fetching cat image:', err);
    return null;
  }
};
