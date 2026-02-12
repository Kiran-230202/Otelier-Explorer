import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getHotelsByCity } from '../api/hotelService';
import { useAuth } from '../context/AuthContext';
import { useHotels } from '../context/HotelContext';

const Dashboard = () => {
    const { signOut, isAdmin, user } = useAuth();
    const { 
        selectedHotels, toggleHotelSelection,
        hotels, setHotels,
        visibleCount, setVisibleCount,
        cityCode, setCityCode
    } = useHotels();

    // Local filter states
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(2);
    const [rooms, setRooms] = useState(1); // Added Rooms state
    const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const observer = useRef();

    // UI Listeners
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Infinite Scroll Logic
    const lastHotelElementRef = useCallback(node => {
        if (loading || isScrolling) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hotels.length > visibleCount) {
                setIsScrolling(true);
                setTimeout(() => {
                    setVisibleCount(prev => prev + 4);
                    setIsScrolling(false);
                }, 800);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, isScrolling, hotels.length, visibleCount, setVisibleCount]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getHotelsByCity(cityCode);
            const stabilizedHotels = data.map((hotel) => ({
                ...hotel,
                displayPrice: Math.floor(Math.random() * 5000) + 2000,
                displayDiscount: Math.floor(Math.random() * 20) + 10,
                rating: hotel.rating ? parseFloat(hotel.rating) : (3.5 + Math.random() * 1.5).toFixed(1)
            }));
            setHotels(stabilizedHotels);
            setVisibleCount(8);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setLoading(false);
        }
    };

    const getHotelImage = (id) => `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&ixid=${id}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-32">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-[#0071C2] h-10 w-10 flex items-center justify-center rounded-lg shadow-md">
                        <span className="text-white font-black text-xl">O</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Otelier Explorer</h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-slate-700 hidden sm:block">
                        Welcome, <span className="text-[#0071C2]">{user?.email?.split('@')[0]}</span>
                    </span>
                    <button onClick={signOut} className="text-sm font-semibold text-rose-600">Sign Out</button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {isAdmin && (
                    <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse">
                        <span className="bg-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Admin</span>
                        <p className="text-indigo-900 text-sm font-semibold">Authorized: Advanced analytics unlocked.</p>
                    </div>
                )}

                {/* Premium Search Bar */}
                <form onSubmit={handleSearch} className="max-w-6xl mx-auto mb-16 relative">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col md:flex-row items-stretch">
                        
                        {/* Landmark */}
                        <div className="flex-[1.5] flex items-center gap-4 px-6 py-5 border-b md:border-b-0 md:border-r border-slate-100">
                            <span className="text-xl">📍</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-[11px] font-bold uppercase text-slate-400">Landmark</span>
                                <input type="text" className="bg-transparent font-bold focus:outline-none uppercase" value={cityCode} onChange={(e) => setCityCode(e.target.value.toUpperCase())} placeholder="Where to?" />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex-1 flex items-center gap-4 px-6 py-5 border-b md:border-b-0 md:border-r border-slate-100">
                            <span className="text-xl">📅</span>
                            <div className="flex flex-col flex-1">
                                <span className="text-[11px] font-bold uppercase text-slate-400">Dates</span>
                                <DatePicker selected={startDate} onChange={(dates) => { const [s, e] = dates; setStartDate(s); setEndDate(e); }} startDate={startDate} endDate={endDate} selectsRange monthsShown={2} placeholderText="Select dates" className="bg-transparent font-bold text-sm focus:outline-none w-full cursor-pointer" />
                            </div>
                        </div>

                        {/* CUSTOM DUAL PICKER (GUESTS & ROOMS) */}
                        <div className="flex-1 flex items-center gap-4 px-6 py-5 hover:bg-slate-50 transition-colors group relative cursor-pointer">
                            <span className="text-xl">👥</span>
                            <div className="flex flex-col flex-1" onClick={() => setIsGuestPickerOpen(!isGuestPickerOpen)}>
                                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Guests & Rooms</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-800 text-sm">{guests} Guests, {rooms} Room{rooms > 1 ? 's' : ''}</span>
                                    <svg className={`w-4 h-4 text-slate-400 transition-transform ${isGuestPickerOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>

                            {isGuestPickerOpen && (
                                <div className="absolute top-full left-0 mt-2 w-full min-w-[260px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-[80] animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* Adults Row */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <p className="font-black text-slate-800 text-sm leading-tight">Guests</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total travelers</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={(e) => {e.stopPropagation(); setGuests(Math.max(1, guests - 1))}} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] transition-colors">-</button>
                                            <span className="font-bold text-slate-800 w-4 text-center">{guests}</span>
                                            <button type="button" onClick={(e) => {e.stopPropagation(); setGuests(Math.min(10, guests + 1))}} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] transition-colors">+</button>
                                        </div>
                                    </div>
                                    {/* Rooms Row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-black text-slate-800 text-sm leading-tight">Rooms</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Max 5 rooms</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button type="button" onClick={(e) => {e.stopPropagation(); setRooms(Math.max(1, rooms - 1))}} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] transition-colors">-</button>
                                            <span className="font-bold text-slate-800 w-4 text-center">{rooms}</span>
                                            <button type="button" onClick={(e) => {e.stopPropagation(); setRooms(Math.min(5, rooms + 1))}} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] transition-colors">+</button>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setIsGuestPickerOpen(false)} className="w-full mt-2 py-2.5 bg-[#0071C2] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#005E9E] transition-all">Apply</button>
                                </div>
                            )}
                        </div>

                        <div className="p-3">
                            <button type="submit" disabled={loading} className="bg-[#0071C2] hover:bg-[#005E9E] text-white px-10 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95">Search</button>
                        </div>
                    </div>
                </form>

                {/* Hotel Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {hotels.slice(0, visibleCount).map((hotel, index) => {
                        const isLastItem = hotels.slice(0, visibleCount).length === index + 1;
                        const isSelected = selectedHotels.some(h => h.hotelId === hotel.hotelId);
                        return (
                            <div key={hotel.hotelId} ref={isLastItem ? lastHotelElementRef : null} className="group bg-white rounded-3xl border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                <div className="h-60 overflow-hidden relative">
                                    <img src={getHotelImage(hotel.hotelId)} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-[#0071C2] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase">{hotel.rating} RATING</div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-lg mb-4 line-clamp-2 min-h-[3.5rem]">{hotel.name}</h4>
                                    <div className="flex items-end justify-between mb-6">
                                        <p className="text-2xl font-black text-slate-900">₹{hotel.displayPrice}</p>
                                        <div className="bg-rose-50 text-rose-600 text-[10px] font-black px-2.5 py-1 rounded-lg">-{hotel.displayDiscount}%</div>
                                    </div>
                                    <button onClick={() => toggleHotelSelection(hotel)} className={`w-full py-4 rounded-xl font-bold text-sm border transition-all ${isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#0071C2] hover:text-white'}`}>
                                        {isSelected ? '✓ Selected' : 'Compare'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isScrolling && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl border border-slate-100 h-[400px]">
                                <div className="bg-slate-200 h-60 rounded-t-3xl" />
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-3/4" /><div className="h-10 bg-slate-200 rounded-xl w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {selectedHotels.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl border border-slate-700 backdrop-blur-md">
                    <p className="text-sm font-bold">{selectedHotels.length} Selected</p>
                    <Link to="/compare" className="bg-[#0071C2] hover:bg-[#005E9E] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95">Compare Now</Link>
                </div>
            )}

            {showBackToTop && (
                <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-[70] flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-lg border border-slate-200 text-[#0071C2] rounded-2xl shadow-xl hover:-translate-y-2 transition-all active:scale-90 group">
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                </button>
            )}
        </div>
    );
};

export default Dashboard;