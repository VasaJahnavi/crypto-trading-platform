import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWalletBalance, requestWithdrawal } from '../services/api';
import toast from 'react-hot-toast';

const Withdrawal = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchBalance();
        }
    }, [user]);

    const fetchBalance = async () => {
        try {
            const response = await getWalletBalance(user.id);
            if (response.data.success) {
                setBalance(response.data.balance);
            }
        } catch (error) {
            toast.error('Failed to fetch balance');
        }
    };

    const handleWithdraw = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        if (amount > balance) {
            toast.error('Insufficient balance');
            return;
        }
        
        setLoading(true);
        try {
            const response = await requestWithdrawal(user.id, { amount: parseFloat(amount) });
            if (response.data.success) {
                toast.success('Withdrawal request submitted!');
                setAmount('');
                fetchBalance();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error('Failed to process withdrawal');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex-1 ml-64 p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Request Withdrawal</h1>

                <div className="bg-gray-800 rounded-xl p-6 max-w-2xl">
                    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">Available balance</p>
                        <p className="text-white text-2xl font-bold">${balance.toLocaleString()}</p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2">Enter withdrawal amount</label>
                        <input
                            type="number"
                            placeholder="$9999"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 mb-2">Transfer to</label>
                        <div className="p-3 bg-gray-700 rounded-lg">
                            <p className="text-white">Yes Bank</p>
                            <p className="text-gray-400 text-sm">**********1652</p>
                        </div>
                    </div>

                    <button
                        onClick={handleWithdraw}
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Withdraw'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Withdrawal;