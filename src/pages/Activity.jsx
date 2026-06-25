import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactions } from '../services/api';
import toast from 'react-hot-toast';

const Activity = () => {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions(user.id);
            if (response.data.success) {
                setTransactions(response.data.transactions || []);
            }
        } catch (error) {
            toast.error('Failed to fetch transactions');
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        return type === 'BUY' ? 'text-green-500' : 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex-1 ml-5 p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Activity</h1>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-12 text-center">
                        <p className="text-gray-400">No transactions yet. Start trading!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="bg-gray-800 rounded-xl p-4 flex justify-between items-center">
                                <div>
                                    <p className={`font-semibold ${getTypeColor(tx.transactionType)}`}>
                                        {tx.transactionType} {tx.coinSymbol?.toUpperCase()}
                                    </p>
                                    <p className="text-gray-400 text-sm">{tx.transactionDate?.substring(0, 10)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white font-semibold">
                                        {tx.transactionType === 'BUY' ? '-' : '+'}${tx.total?.toLocaleString()}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {tx.quantity} @ ${tx.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activity;