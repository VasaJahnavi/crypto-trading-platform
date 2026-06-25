import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { transferMoney } from '../services/api';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

const TransferModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [walletId, setWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleTransfer = async () => {
        if (!walletId || !amount || !purpose) {
            toast.error('Please fill all fields');
            return;
        }

        if (parseFloat(amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        try {
            const response = await transferMoney(user.id, {
                toWalletId: walletId,
                amount: parseFloat(amount),
                purpose: purpose
            });

            if (response.data.success) {
                toast.success('Transfer successful!');
                setWalletId('');
                setAmount('');
                setPurpose('');
                onClose();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            toast.error('Transfer failed');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Transfer To Other Wallet</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={20} />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Enter Amount</label>
                    <input
                        type="number"
                        placeholder="$9999"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Enter Wallet Id</label>
                    <input
                        type="text"
                        placeholder="#ADFE34456"
                        value={walletId}
                        onChange={(e) => setWalletId(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                    />
                    <p className="text-gray-500 text-xs mt-1">Enter the recipient's Wallet ID (User ID)</p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-300 text-sm mb-2">Purpose</label>
                    <input
                        type="text"
                        placeholder="gift for your friend..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                <button
                    onClick={handleTransfer}
                    disabled={loading}
                    className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default TransferModal;