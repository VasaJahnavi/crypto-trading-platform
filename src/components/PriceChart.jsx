import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data, coinName }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400">No chart data available</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">{coinName} Price Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                        labelStyle={{ color: '#FBBF24' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#FBBF24" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;