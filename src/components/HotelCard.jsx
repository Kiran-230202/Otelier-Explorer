const HotelCard = ({ hotel, isSelected, onToggle, lastHotelRef }) => {
    // Generates a cinematic image based on hotel ID
    const getHotelImage = (id) => `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&ixid=${id}`;

    return (
        <div ref={lastHotelRef} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2">
            <div className="h-60 overflow-hidden relative">
                <img src={getHotelImage(hotel.hotelId)} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                    {hotel.rating} ★
                </div>
                <div className="absolute bottom-4 right-4 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                    {hotel.paymentType}
                </div>
            </div>

            <div className="p-6">
                <h4 className="font-black text-lg text-slate-900 mb-1 line-clamp-1 tracking-tight">{hotel.name}</h4>
                <p className="text-[#0071C2] text-[10px] font-black uppercase tracking-[0.15em] mb-4">{hotel.roomCategory}</p>
                
                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 h-8 font-medium italic">
                    {hotel.roomDescription}
                </p>

                <div className="flex items-end justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Price Per Stay</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-slate-900">{hotel.currency}</span>
                            <span className="text-2xl font-black text-slate-900 leading-none">{hotel.displayPrice}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => onToggle(hotel)} 
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 border-2 ${
                        isSelected 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-[#0071C2] hover:border-[#0071C2] hover:text-white'
                    }`}
                >
                    {isSelected ? '✓ Selected' : 'Add to Compare'}
                </button>
            </div>
        </div>
    );
};

export default HotelCard;