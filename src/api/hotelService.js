import axios from 'axios';

const AMADEUS_BASE = 'https://test.api.amadeus.com';
let accessToken = '';
let tokenExpiry = 0;

const getAuthToken = async () => {
    const currentTime = Date.now();
    if (accessToken && currentTime < tokenExpiry) return accessToken;

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', import.meta.env.VITE_AMADEUS_CLIENT_ID);
    params.append('client_secret', import.meta.env.VITE_AMADEUS_CLIENT_SECRET);

    const response = await axios.post(`${AMADEUS_BASE}/v1/security/oauth2/token`, params);
    
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 10000;
    return accessToken;
};

export const getHotelsByCity = async (params) => {
    const token = await getAuthToken();

    try {
        // --- STEP 1: GET HOTEL IDS BY CITY CODE (v1) ---
        // We use the cityCode (e.g., 'BOM') to get a list of hotel properties.
        const cityListResponse = await axios.get(`${AMADEUS_BASE}/v1/reference-data/locations/hotels/by-city`, {
            params: { cityCode: params.cityCode },
            headers: { Authorization: `Bearer ${token}` }
        });

        const hotelList = cityListResponse.data.data;

        if (!hotelList || hotelList.length === 0) {
            throw new Error("No hotels found for this city code.");
        }

        // We take the first 10 IDs and join them with commas for the v3 API
        const hotelIds = hotelList.slice(0, 10).map(hotel => hotel.hotelId).join(',');

        // --- STEP 2: GET SHOPPING OFFERS (v3) ---
        // Now we pass those specific IDs into the Shopping API.
        const response = await axios.get(`${AMADEUS_BASE}/v3/shopping/hotel-offers`, {
            params: {
                hotelIds: hotelIds,
                adults: params.adults || 1,
                checkInDate: params.checkInDate,   
                checkOutDate: params.checkOutDate, 
                roomQuantity: params.roomQuantity || 1,
                paymentPolicy: 'NONE',
                bestRateOnly: true
            },
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.data.data) {
            throw new Error("No available offers found for these hotels on the selected dates.");
        }

        return response.data.data;

    } catch (error) {
        console.error("Amadeus API Error:", error.response?.data || error.message);
        const amadeusError = error.response?.data?.errors?.[0]?.detail;
        throw new Error(amadeusError || error.message || "Failed to fetch offers.");
    }
};