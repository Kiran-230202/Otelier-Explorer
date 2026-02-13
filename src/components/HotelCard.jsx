const HotelCard = ({ hotel, isSelected, onToggle, lastHotelRef }) => {
    // Dynamic placeholder using hotel ID for variety
    const getHotelImage = (id) => `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&ixid=${id}`;

    return (
        <div
            ref={lastHotelRef}
            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2"
        >
            {/* Image Section with Overlay */}
            <div className="h-64 overflow-hidden relative">
                <img
                    src={getHotelImage(hotel.hotelId)}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Subtle dark gradient at top to make white text pop */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 bg-[#0071C2] text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    {hotel.rating} ★ RATING
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title: Darker and bolder */}
                <h4 className="font-black text-xl text-slate-900 mb-3 line-clamp-2 min-h-[3.5rem] leading-[1.2] tracking-tight">
                    {hotel.name}
                </h4>

                {/* Location context (Optional but adds value) */}
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
                    Primary Location • {hotel.hotelId}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Starting from</span>
                        <p className="text-2xl font-black text-slate-900 leading-none">₹{hotel.displayPrice}</p>
                    </div>

                    <div className="bg-rose-100 text-rose-700 text-[11px] font-black px-3 py-1.5 rounded-xl border border-rose-200 shadow-sm">
                        {hotel.displayDiscount}% OFF
                    </div>
                </div>

                {/* Selection Button */}
                <button
                    onClick={() => onToggle(hotel)}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 border-2 ${isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-[#0071C2] hover:border-[#0071C2] hover:text-white hover:shadow-lg'
                        } active:scale-95`}
                >
                    {isSelected ? '✓ Selected' : 'Add to Compare'}
                </button>
            </div>
        </div>
    );
};

export default HotelCard;