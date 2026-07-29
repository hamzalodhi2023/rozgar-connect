import axios from 'axios';

const LOCATIONIQ_API_KEY = 'pk.4ddd236222dde152e4a31790284cb007';

export const searchLocationIQ = async (query: string) => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const response = await axios.get(`https://api.locationiq.com/v1/autocomplete.php`, {
      params: {
        key: LOCATIONIQ_API_KEY,
        q: query,
        limit: 5,
        countrycodes: 'pk'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('LocationIQ API Error:', error);
    return [];
  }
};
