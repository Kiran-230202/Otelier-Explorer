import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = ({
    cityCode, setCityCode, startDate, endDate, setStartDate, setEndDate,
    guests, setGuests, rooms, setRooms, isOpen, setIsOpen, onSearch, loading
}) => (
    <form onSubmit={onSearch} className="max-w-7xl mx-auto mb-16 relative">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col lg:flex-row items-stretch overflow-visible">

            {/* 1. Landmark Section */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors rounded-t-3xl lg:rounded-l-3xl group">
                <span className="text-2xl group-hover:scale-110 transition-transform">📍</span>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Destination</span>
                    <input
                        type="text"
                        className="bg-transparent font-black text-slate-900 focus:outline-none uppercase text-lg placeholder:text-slate-300 w-full"
                        value={cityCode}
                        onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                        placeholder="WHERE TO?"
                    />
                </div>
            </div>

            {/* 2. Check-in Calendar */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🛫</span>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Check-in</span>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="ADD DATE"
                        className="bg-transparent font-black text-slate-900 text-sm focus:outline-none w-full cursor-pointer uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* 3. Check-out Calendar */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform">🛬</span>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Check-out</span>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        placeholderText="ADD DATE"
                        className="bg-transparent font-black text-slate-900 text-sm focus:outline-none w-full cursor-pointer uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* 4. Travelers Section */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 hover:bg-slate-50 transition-colors group relative cursor-pointer lg:border-r border-slate-100">
                <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                <div className="flex flex-col flex-1" onClick={() => setIsOpen(!isOpen)}>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Travelers</span>
                    <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm uppercase">
                            {guests} G, {rooms} R
                        </span>
                        <svg className={`w-4 h-4 text-[#0071C2] transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {isOpen && (
                    <div className="absolute top-[105%] left-0 w-full min-w-[280px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 z-[100] animate-in fade-in slide-in-from-top-2">
                        <PickerRow label="Adults" value={guests} setter={setGuests} min={1} max={9} />
                        <div className="h-px bg-slate-100 my-4" />
                        <PickerRow label="Rooms" value={rooms} setter={setRooms} min={1} max={9} />
                        <button type="button" onClick={() => setIsOpen(false)} className="w-full mt-6 py-4 bg-slate-900 text-white text-[11px] font-black uppercase rounded-2xl">Confirm</button>
                    </div>
                )}
            </div>

            {/* 5. Search Button */}
            <div className="p-4 flex items-center bg-white rounded-r-3xl">
                <button type="submit" disabled={loading} className="w-full lg:w-auto bg-[#0071C2] hover:bg-[#005E9E] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase transition-all shadow-lg active:scale-95">
                    {loading ? "..." : "Search"}
                </button>
            </div>
        </div>
    </form>
);

const PickerRow = ({ label, value, setter, min, max }) => (
    <div className="flex items-center justify-between">
        <p className="font-black text-slate-900 text-sm uppercase">{label}</p>
        <div className="flex items-center gap-4">
            <button type="button" onClick={() => setter(Math.max(min, value - 1))} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-black">-</button>
            <span className="font-black w-4 text-center">{value}</span>
            <button type="button" onClick={() => setter(Math.min(max, value + 1))} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-black">+</button>
        </div>
    </div>
);

export default SearchBar;