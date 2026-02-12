// src/context/HotelContext.jsx
import { createContext, useContext, useState } from 'react';

const HotelContext = createContext();

export const HotelProvider = ({ children }) => {
    const [selectedHotels, setSelectedHotels] = useState([]);

    // Persistent search results states
    const [hotels, setHotels] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [cityCode, setCityCode] = useState('PAR'); // Persist the search term too

    const toggleHotelSelection = (hotel) => {
        setSelectedHotels(prev =>
            prev.find(h => h.hotelId === hotel.hotelId)
                ? prev.filter(h => h.hotelId !== hotel.hotelId)
                : [...prev, hotel]
        );
    };

    return (
        <HotelContext.Provider value={{
            selectedHotels,
            toggleHotelSelection,
            hotels,
            setHotels,
            visibleCount,
            setVisibleCount,
            cityCode,
            setCityCode
        }}>
            {children}
        </HotelContext.Provider>
    );
};

export const useHotels = () => useContext(HotelContext);