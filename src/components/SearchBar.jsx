import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SearchBar = ({
    cityCode, setCityCode, startDate, endDate, onChangeDates,
    guests, setGuests, rooms, setRooms, isOpen, setIsOpen, onSearch, loading
}) => (
    <form onSubmit={onSearch} className="max-w-6xl mx-auto mb-16 relative">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col md:flex-row items-stretch overflow-visible">

            {/* Landmark Section */}
            <div className="flex-[1.5] flex items-center gap-4 px-8 py-6 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-colors rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl group">
                <span className="text-2xl group-hover:scale-110 transition-transform">📍</span>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Landmark</span>
                    <input
                        type="text"
                        className="bg-transparent font-black text-slate-900 focus:outline-none uppercase text-lg placeholder:text-slate-300 w-full"
                        value={cityCode}
                        onChange={(e) => setCityCode(e.target.value.toUpperCase())}
                        placeholder="WHERE TO?"
                    />
                </div>
            </div>

            {/* Dates Section */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-colors group">
                <span className="text-2xl group-hover:scale-110 transition-transform">📅</span>
                <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Check-in / Out</span>
                    <DatePicker
                        selected={startDate}
                        onChange={onChangeDates}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        monthsShown={2}
                        placeholderText="SELECT DATES"
                        className="bg-transparent font-black text-slate-900 text-sm focus:outline-none w-full cursor-pointer uppercase tracking-tight"
                    />
                </div>
            </div>

            {/* Custom Dual Picker Section */}
            <div className="flex-1 flex items-center gap-4 px-8 py-6 hover:bg-slate-50 transition-colors group relative cursor-pointer">
                <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                <div className="flex flex-col flex-1" onClick={() => setIsOpen(!isOpen)}>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] mb-1">Travelers</span>
                    <div className="flex items-center justify-between">
                        <span className="font-black text-slate-900 text-sm uppercase tracking-tight">
                            {guests} Guests, {rooms} Room{rooms > 1 ? 's' : ''}
                        </span>
                        <svg className={`w-5 h-5 text-[#0071C2] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* DROPDOWN POPUP */}
                {isOpen && (
                    <div className="absolute top-[105%] left-0 w-full min-w-[280px] bg-white rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-slate-100 p-8 z-[100] animate-in fade-in slide-in-from-top-2">
                        <PickerRow label="Guests" sub="Total travelers" value={guests} setter={setGuests} min={1} max={10} />
                        <div className="h-px bg-slate-100 my-4" />
                        <PickerRow label="Rooms" sub="Total accommodation" value={rooms} setter={setRooms} min={1} max={5} />
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-6 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#0071C2] shadow-xl transition-all active:scale-95"
                        >
                            Confirm Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Search Button Section */}
            <div className="p-4 flex items-center bg-white rounded-r-3xl">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-[#0071C2] hover:bg-[#005E9E] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.1em] shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "Search Hotels"
                    )}
                </button>
            </div>
        </div>
    </form>
);

const PickerRow = ({ label, sub, value, setter, min, max }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-black text-slate-900 text-sm leading-tight uppercase tracking-tight">{label}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p>
        </div>
        <div className="flex items-center gap-5">
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setter(Math.max(min, value - 1)) }}
                className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] hover:bg-blue-50 transition-all font-black text-xl"
            >
                −
            </button>
            <span className="font-black text-slate-900 w-6 text-center text-lg">{value}</span>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setter(Math.min(max, value + 1)) }}
                className="w-10 h-10 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-[#0071C2] hover:text-[#0071C2] hover:bg-blue-50 transition-all font-black text-xl"
            >
                +
            </button>
        </div>
    </div>
);

export default SearchBar;