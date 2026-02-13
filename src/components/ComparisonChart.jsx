import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const ComparisonChart = ({ data }) => {
    // Format the real v3 data for the chart
    const chartData = data.map(hotel => ({
        name: hotel.name.substring(0, 12) + (hotel.name.length > 12 ? "..." : ""),
        rating: parseFloat(hotel.rating) || 0,
        price: hotel.displayPrice || 0,
        currency: hotel.currency
    }));

    return (
        <div className="h-96 w-full p-4 bg-white rounded-3xl border border-slate-100 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                    />
                    {/* Left Axis for Rating (0-5) */}
                    <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#4f46e5"
                        domain={[0, 5]}
                        axisLine={false}
                        tick={{ fontWeight: 700 }}
                    />
                    {/* Right Axis for Total Price */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#10b981"
                        axisLine={false}
                        tick={{ fontWeight: 700 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 800 }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 900, fontSize: '12px' }} />

                    <Bar yAxisId="left" dataKey="rating" fill="#4f46e5" name="User Rating" radius={[6, 6, 0, 0]} barSize={40} />
                    <Bar yAxisId="right" dataKey="price" fill="#10b981" name="Total Price" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComparisonChart;