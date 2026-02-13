import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHotelsByCity } from '../api/hotelService';
import { useAuth } from '../context/AuthContext';
import { useHotels } from '../context/HotelContext';

import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import SkeletonCard from '../components/SkeletonCard';
import Toaster from '../components/Toaster';

const Dashboard = () => {
    const { signOut, isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const { selectedHotels, toggleHotelSelection, hotels, setHotels, visibleCount, setVisibleCount, cityCode, setCityCode } = useHotels();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [toast, setToast] = useState(null);

    // Store observer in a ref to persist across renders
    const observer = useRef();

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        if (!startDate || !cityCode) {
            setToast({ message: "Required", subMessage: "Please select a city and check-in date", type: "error" });
            return;
        }

        setLoading(true);
        setIsGuestPickerOpen(false);

        const formatDate = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        try {
            const rawData = await getHotelsByCity({
                cityCode: cityCode,
                checkInDate: formatDate(startDate),
                checkOutDate: formatDate(endDate),
                adults: guests,
                roomQuantity: rooms,
                currency: 'INR',
                bestRateOnly: true
            });

            const processedHotels = rawData.map((item) => {
                const hotelInfo = item.hotel;
                const mainOffer = item.offers[0];

                return {
                    hotelId: hotelInfo.hotelId,
                    name: hotelInfo.name,
                    latitude: hotelInfo.latitude,
                    longitude: hotelInfo.longitude,
                    displayPrice: parseFloat(mainOffer.price.total),
                    currency: mainOffer.price.currency,
                    roomCategory: mainOffer.room.typeEstimated?.category?.replace(/_/g, ' ') || "Standard Room",
                    roomDescription: mainOffer.room.description.text,
                    paymentType: mainOffer.policies.paymentType,
                    rating: (3.5 + Math.random() * 1.5).toFixed(1)
                };
            });

            setHotels(processedHotels);
            setVisibleCount(8); // Reset visible count on new search
            setToast({ message: "Offers Found", subMessage: `Real-time prices loaded`, type: "success" });
        } catch (err) {
            setToast({ message: "Network Error", subMessage: err.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Corrected Infinite Scroll Ref Callback
    const lastHotelElementRef = useCallback(node => {
        if (loading || isScrolling) return;

        // Disconnect previous observer if it exists
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            // Trigger load more ONLY if we haven't reached the end of the fetched list
            if (entries[0].isIntersecting && visibleCount < hotels.length) {
                setIsScrolling(true);
                // Artificial delay for cinematic skeleton loading effect
                setTimeout(() => {
                    setVisibleCount(prev => prev + 4);
                    setIsScrolling(false);
                }, 800);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, isScrolling, hotels.length, visibleCount, setVisibleCount]);

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {toast && <Toaster {...toast} onClose={() => setToast(null)} />}
            <Navbar user={user} onSignOut={async () => { await signOut(); navigate('/auth'); }} />

            <main className="max-w-7xl mx-auto px-6 py-12">
                {isAdmin && <AdminBanner />}
                <SearchBar
                    cityCode={cityCode}
                    setCityCode={setCityCode}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    guests={guests}
                    setGuests={setGuests}
                    rooms={rooms}
                    setRooms={setRooms}
                    isOpen={isGuestPickerOpen}
                    setIsOpen={setIsGuestPickerOpen}
                    onSearch={handleSearch}
                    loading={loading}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {/* 1. Show 8 Skeletons during INITIAL loading */}
                    {loading ? (
                        <>
                            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                        </>
                    ) : (
                        <>
                            {/* 2. Show the real Hotel Cards after loading is done */}
                            {hotels.slice(0, visibleCount).map((hotel, index) => {
                                const isLastItem = hotels.slice(0, visibleCount).length === index + 1;
                                return (
                                    <HotelCard
                                        key={`${hotel.hotelId}-${index}`}
                                        hotel={hotel}
                                        isSelected={selectedHotels.some(h => h.hotelId === hotel.hotelId)}
                                        onToggle={toggleHotelSelection}
                                        lastHotelRef={isLastItem ? lastHotelElementRef : null}
                                    />
                                );
                            })}

                            {/* 3. Show Skeletons while SCROLLING for more */}
                            {isScrolling && (
                                <>
                                    <SkeletonCard /><SkeletonCard />
                                    <SkeletonCard /><SkeletonCard />
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>

            {selectedHotels.length > 0 && <SelectionBasket count={selectedHotels.length} />}

            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 z-[70] flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-lg border border-slate-200 text-[#0071C2] rounded-2xl shadow-xl hover:-translate-y-2 transition-all active:scale-90"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

const SelectionBasket = ({ count }) => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in slide-in-from-bottom-4">
        <p className="text-sm font-black uppercase tracking-widest">{count} Selected</p>
        <Link to="/compare" className="bg-[#0071C2] hover:bg-[#005E9E] text-white px-8 py-2.5 rounded-xl text-sm font-black shadow-lg transition-all active:scale-95 uppercase tracking-tighter">Compare Now</Link>
    </div>
);

const AdminBanner = () => (
    <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse">
        <span className="bg-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Admin</span>
        <p className="text-indigo-900 text-sm font-semibold">Authorized: Advanced analytics unlocked.</p>
    </div>
);
export default Dashboard;