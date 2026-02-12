import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const ComparisonChart = ({ data }) => {
    const chartData = data.map(hotel => ({
        name: hotel.name.substring(0, 10),
        rating: hotel.rating || 0,
        price: hotel.displayPrice || 0
    }));

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" domain={[0, 5]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="rating" fill="#4f46e5" name="Rating" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="price" fill="#10b981" name="Price (₹)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// CRITICAL FIX: Ensure this line exists at the bottom
export default ComparisonChart;