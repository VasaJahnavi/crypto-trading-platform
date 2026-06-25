import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PaymentDetails = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        accountNumber: '',
        accountHolderName: '',
        ifsc: '',
        bankName: ''
    });
    const [hasSavedDetails, setHasSavedDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPaymentDetails();
        }
    }, [user]);

    const fetchPaymentDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/payment/details/${user.id}`);
            const data = await response.json();
            console.log("Fetched details:", data);
            
            if (data.success && data.details && data.details.accountNumber) {
                setFormData({
                    accountNumber: data.details.accountNumber || '',
                    accountHolderName: data.details.accountHolderName || '',
                    ifsc: data.details.ifsc || '',
                    bankName: data.details.bankName || ''
                });
                setHasSavedDetails(true);
            } else {
                setHasSavedDetails(false);
            }
        } catch (error) {
            console.error('Failed to fetch payment details', error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:8081/api/payment/details?userId=${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            console.log("Save response:", data);
            
            if (data.success) {
                toast.success('Payment details saved successfully!');
                setHasSavedDetails(true);
                fetchPaymentDetails();
            } else {
                toast.error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save payment details');
        }
        setLoading(false);
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <div className="flex-1 ml-64 p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Payment Details</h1>

                    <div className="bg-gray-800 rounded-xl p-6 max-w-2xl">
                        <p className="text-gray-400 mb-6">Add your bank account details for withdrawals</p>

                        {hasSavedDetails && (
                            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
                                <p className="text-green-400 text-sm">✓ Your bank details are saved. Edit below to update.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    placeholder="Enter account holder name"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="Enter account number"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifsc"
                                    value={formData.ifsc}
                                    onChange={handleChange}
                                    placeholder="Enter IFSC code"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    placeholder="Enter bank name"
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50 w-full"
                            >
                                {loading ? 'Saving...' : (hasSavedDetails ? 'Update Payment Details' : 'Save Payment Details')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;