import { useNavigate } from 'react-router-dom';
import { useHotels } from '../context/HotelContext';
import ComparisonChart from '../components/ComparisonChart';

const Compare = () => {
    const { selectedHotels, toggleHotelSelection } = useHotels();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900 pb-20">
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="text-sm font-bold text-[#0071C2] flex items-center gap-2">
                    ← Back to Search
                </button>
                <h1 className="text-xl font-bold tracking-tight">Market Comparison</h1>
                <div className="w-20"></div> {/* Spacer */}
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {selectedHotels.length > 0 ? (
                    <>
                        <div className="mb-12">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Price & Rating Analysis</h2>
                            <p className="text-slate-500 font-medium">Visualizing data trends for your {selectedHotels.length} selected properties.</p>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 mb-12">
                            <ComparisonChart data={selectedHotels} />
                        </div>

                        {/* Selected Hotels List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedHotels.map(hotel => (
                                <div key={hotel.hotelId} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-[#0071C2]">
                                            {hotel.rating}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 truncate w-40">{hotel.name}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">₹{hotel.displayPrice}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleHotelSelection(hotel)}
                                        className="text-rose-600 font-bold text-sm px-4 py-2 hover:bg-rose-50 rounded-xl transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">📊</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No hotels selected</h2>
                        <p className="text-slate-500 mb-8">Go back to the explorer and select hotels to compare them.</p>
                        <button onClick={() => navigate('/')} className="bg-[#0071C2] text-white px-8 py-3 rounded-xl font-bold shadow-lg">
                            Go Exploring
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Compare;