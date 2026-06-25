import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWalletBalance, addMoney, getPaymentHistory } from '../services/api';
import toast from 'react-hot-toast';
import TransferModal from '../components/TransferModal';

const Wallet = () => {
    const { user } = useAuth();
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    const fetchWalletData = async () => {
        try {
            const balanceRes = await getWalletBalance(user.id);
            if (balanceRes.data.success) {
                setBalance(balanceRes.data.balance);
            }
            const historyRes = await getPaymentHistory(user.id);
            if (historyRes.data.success) {
                setHistory(historyRes.data.payments);
            }
        } catch (error) {
            toast.error('Failed to fetch wallet data');
        }
    };

    useEffect(() => {
        if (user) {
            fetchWalletData();
        }
    }, [user]);

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }
        setLoading(true);
        try {
            const response = await addMoney(user.id, { amount: parseFloat(amount) });
            if (response.data.success) {
                toast.success(`$${amount} added to wallet!`);
                setAmount('');
                fetchWalletData();
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error('Failed to add money');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Wallet Card */}
                   <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 mb-8">
    <p className="text-white/80 text-sm mb-2">My Wallet</p>
    <p className="text-white text-4xl font-bold">${balance.toLocaleString()}</p>
    <p className="text-white/60 text-xs mt-1">Wallet ID: #{user?.id}</p>
    <p className="text-white/60 text-xs">Available Balance</p>
</div>


                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <button 
                            onClick={() => document.getElementById('addMoneySection').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition"
                        >
                            Add Money
                        </button>
                        <button 
                            onClick={() => window.location.href = '/withdrawal'}
                            className="bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition"
                        >
                            Withdraw
                        </button>
                        <button 
                            onClick={() => setIsTransferOpen(true)}
                            className="bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition"
                        >
                            Transfer
                        </button>
                    </div>

                    {/* Add Money Section */}
                    <div id="addMoneySection" className="bg-gray-800 rounded-2xl p-6 mb-8">
                        <h3 className="text-white text-xl font-semibold mb-4">Top Up Your Wallet</h3>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter Amount"
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                            />
                            <button
                                onClick={handleAddMoney}
                                disabled={loading}
                                className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Add Money'}
                            </button>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-gray-800 rounded-2xl p-6">
                        <h3 className="text-white text-xl font-semibold mb-4">Transaction History</h3>
                        {history.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No transactions yet</p>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                                        <div>
                                            <p className="text-white font-medium">{item.paymentMethod}</p>
                                            <p className="text-gray-400 text-sm">{item.createdAt?.substring(0, 10)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-500 font-bold">+${item.amount}</p>
                                            <p className={`text-xs ${item.status === 'SUCCESS' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transfer Modal */}
            <TransferModal
                isOpen={isTransferOpen}
                onClose={() => setIsTransferOpen(false)}
            />
        </div>
    );
};

export default Wallet;