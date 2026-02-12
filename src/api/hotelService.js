import axios from 'axios';

const AMADEUS_URL = 'https://test.api.amadeus.com/v1';

let accessToken = '';

// Function to get the bearer token (JWT) [cite: 6, 9]
const getAuthToken = async () => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', import.meta.env.VITE_AMADEUS_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_AMADEUS_CLIENT_SECRET);

    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', params);
    accessToken = response.data.access_token;
    return accessToken;
};

// Fetch hotels by city [cite: 10, 11]
export const getHotelsByCity = async (cityCode) => {
    if (!accessToken) await getAuthToken();

    const response = await axios.get(`${AMADEUS_URL}/reference-data/locations/hotels/by-city`, {
        params: { cityCode },
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.data;
};