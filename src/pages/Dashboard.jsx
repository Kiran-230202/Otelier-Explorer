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
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1);
    const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [toast, setToast] = useState(null);
    const observer = useRef();

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setIsGuestPickerOpen(false);
        try {
            const data = await getHotelsByCity(cityCode);
            setHotels(data.map(h => ({
                ...h,
                displayPrice: Math.floor(Math.random() * 5000) + 2000,
                displayDiscount: Math.floor(Math.random() * 20) + 10,
                rating: h.rating ? parseFloat(h.rating) : (3.5 + Math.random() * 1.5).toFixed(1)
            })));
            setVisibleCount(8);
            setToast({ message: "Success", subMessage: "List Updated", type: "success" });
        } catch (err) {
            setToast({ message: "Network Error", subMessage: err.message, type: "error" });
        } finally { setLoading(false); }
    };

    const lastHotelElementRef = useCallback(node => {
        if (loading || isScrolling) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hotels.length > visibleCount) {
                setIsScrolling(true);
                setTimeout(() => {
                    setVisibleCount(v => v + 4);
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
                    cityCode={cityCode} setCityCode={setCityCode}
                    startDate={startDate} endDate={endDate} onChangeDates={(d) => { setStartDate(d[0]); setEndDate(d[1]); }}
                    guests={guests} setGuests={setGuests} rooms={rooms} setRooms={setRooms}
                    isOpen={isGuestPickerOpen} setIsOpen={setIsGuestPickerOpen}
                    onSearch={handleSearch} loading={loading}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {hotels.slice(0, visibleCount).map((hotel, index) => (
                        <HotelCard
                            key={`${hotel.hotelId}-${index}`} // Unique key to fix blank screen
                            hotel={hotel}
                            isSelected={selectedHotels.some(h => h.hotelId === hotel.hotelId)}
                            onToggle={toggleHotelSelection}
                            lastHotelRef={hotels.slice(0, visibleCount).length === index + 1 ? lastHotelElementRef : null}
                        />
                    ))}
                    {isScrolling && <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}
                </div>
            </main>

            {selectedHotels.length > 0 && <SelectionBasket count={selectedHotels.length} />}
            {showBackToTop && <BackToTop onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />}
        </div>
    );
};

const AdminBanner = () => (
    <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse">
        <span className="bg-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Admin</span>
        <p className="text-indigo-900 text-sm font-semibold">Authorized: Advanced analytics unlocked.</p>
    </div>
);

const SelectionBasket = ({ count }) => (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md">
        <p className="text-sm font-bold">{count} Selected</p>
        <Link to="/compare" className="bg-[#0071C2] hover:bg-[#005E9E] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">Compare Now</Link>
    </div>
);

const BackToTop = ({ onClick }) => (
    <button onClick={onClick} className="fixed bottom-8 right-8 z-[70] flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-lg border border-slate-200 text-[#0071C2] rounded-2xl shadow-xl hover:-translate-y-2 transition-all active:scale-90 group">
        <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
    </button>
);

export default Dashboard;