import React, { useState, useEffect } from 'react';
import { buyCrypto, sellCrypto, getWalletBalance, getPortfolio } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const TradeModal = ({ crypto, isOpen, onClose }) => {
    const { user } = useAuth();
    const [quantity, setQuantity] = useState('');
    const [amount, setAmount] = useState('');
    const [tradeType, setTradeType] = useState('BUY');
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [cryptoBalance, setCryptoBalance] = useState(0);

    // Fetch wallet balance (for BUY)
    const fetchWalletBalance = async () => {
        try {
            const response = await getWalletBalance(user.id);
            if (response.data.success) {
                setWalletBalance(response.data.balance);
            }
        } catch (error) {
            console.error('Failed to fetch balance');
        }
    };

    // Fetch crypto holdings (for SELL)
    const fetchCryptoBalance = async () => {
        try {
            const response = await getPortfolio(user.id);
            if (response.data.success) {
                const assets = response.data.assets || [];
                const asset = assets.find(a => a.coinId === crypto?.id);
                if (asset) {
                    setCryptoBalance(asset.quantity);
                } else {
                    setCryptoBalance(0);
                }
            }
        } catch (error) {
            console.error('Failed to fetch crypto balance');
        }
    };

    useEffect(() => {
        if (user && isOpen) {
            fetchWalletBalance();
            if (tradeType === 'SELL') {
                fetchCryptoBalance();
            }
        }
    }, [user, isOpen, tradeType, crypto]);

    const coinPrice = crypto?.currentPrice || crypto?.price || 0;

    // When quantity changes, calculate amount automatically
    const handleQuantityChange = (e) => {
        const qty = e.target.value;
        setQuantity(qty);
        if (qty && coinPrice > 0) {
            const calculatedAmount = (parseFloat(qty) * coinPrice).toFixed(2);
            setAmount(calculatedAmount);
        } else {
            setAmount('');
        }
    };

    // When amount changes, calculate quantity automatically
    const handleAmountChange = (e) => {
        const amt = e.target.value;
        setAmount(amt);
        if (amt && coinPrice > 0) {
            const calculatedQty = (parseFloat(amt) / coinPrice).toFixed(8);
            setQuantity(calculatedQty);
        } else {
            setQuantity('');
        }
    };

    // Check if both fields are filled and valid
    const isFormValid = () => {
        if (!quantity || !amount) {
            toast.error('Please enter both Quantity and Amount');
            return false;
        }
        if (parseFloat(quantity) <= 0) {
            toast.error('Quantity must be greater than 0');
            return false;
        }
        if (parseFloat(amount) <= 0) {
            toast.error('Amount must be greater than 0');
            return false;
        }
        
        // Verify that quantity * price matches amount (within 1 cent tolerance)
        const calculatedAmount = parseFloat(quantity) * coinPrice;
        const enteredAmount = parseFloat(amount);
        const difference = Math.abs(calculatedAmount - enteredAmount);
        
        if (difference > 0.01) {
            toast.error('Quantity and Amount do not match!');
            return false;
        }
        
        return true;
    };

    if (!isOpen || !crypto) return null;

    const priceChange = crypto.change24h || crypto.priceChangePercentage24h || 0;
    const isPriceNegative = priceChange < 0;

    const handleBuy = async () => {
        if (!isFormValid()) return;

        const totalCost = parseFloat(quantity) * coinPrice;
        
        if (totalCost > walletBalance) {
            toast.error('Insufficient balance!');
            return;
        }

        setLoading(true);
        try {
            const formattedQuantity = parseFloat(quantity);
            const formattedPrice = coinPrice;
            
            const requestData = {
                coinId: crypto.id,
                coinSymbol: crypto.symbol,
                coinName: crypto.name,
                quantity: formattedQuantity,
                price: formattedPrice
            };
            
            const response = await buyCrypto(user.id, requestData);
            
            if (response.data.success) {
                toast.success(`Bought ${formattedQuantity} ${crypto.symbol?.toUpperCase()}!`);
                onClose();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error("Buy error:", error);
            toast.error('Transaction failed');
        }
        setLoading(false);
    };

    const handleSell = async () => {
        if (!isFormValid()) return;

        // Check if user has enough crypto
        if (parseFloat(quantity) > cryptoBalance) {
            toast.error(`Insufficient ${crypto.symbol?.toUpperCase()} balance! You only have ${cryptoBalance} ${crypto.symbol?.toUpperCase()}`);
            return;
        }

        setLoading(true);
        try {
            const formattedQuantity = parseFloat(quantity);
            const formattedPrice = coinPrice;
            
            const requestData = {
                coinId: crypto.id,
                quantity: formattedQuantity,
                price: formattedPrice
            };
            
            const response = await sellCrypto(user.id, requestData);
            
            if (response.data.success) {
                toast.success(`Sold ${formattedQuantity} ${crypto.symbol?.toUpperCase()}!`);
                onClose();
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error("Sell error:", error);
            toast.error('Transaction failed');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-96">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {tradeType === 'BUY' ? 'Buy' : 'Sell'} {crypto.name}
                        </h2>
                        <p className="text-gray-400 text-sm">{crypto.symbol?.toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>

                {/* Price Info */}
                <div className="bg-gray-700 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Current Price</span>
                        <span className="text-white font-bold">${coinPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-400 text-sm">24h Change</span>
                        <span className={`font-semibold ${isPriceNegative ? 'text-red-500' : 'text-green-500'}`}>
                            {priceChange.toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">
                        Quantity ({crypto.symbol?.toUpperCase()})
                    </label>
                    <input
                        type="number"
                        step="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        placeholder="Enter quantity..."
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                    />
                </div>

                {/* Amount Input */}
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">
                        Amount (USD)
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                        <input
                            type="number"
                            step="1"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Enter amount..."
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                        />
                    </div>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                    <label className="block text-gray-300 text-sm mb-2">Order Type</label>
                    <div className="bg-gray-700 rounded-lg p-2">
                        <span className="text-white">Market Order</span>
                    </div>
                </div>

                {/* Balance based on trade type */}
                {tradeType === 'BUY' ? (
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Available Cash</span>
                            <span className="text-white font-bold">${walletBalance.toLocaleString()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Your {crypto.symbol?.toUpperCase()} Balance</span>
                            <span className="text-white font-bold">{cryptoBalance} {crypto.symbol?.toUpperCase()}</span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
<div className="flex gap-3">
    <button
        onClick={tradeType === 'BUY' ? handleBuy : handleSell}
        disabled={loading}
        className={`flex-1 py-2 rounded-lg font-semibold transition disabled:opacity-50 ${
            tradeType === 'BUY' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
    >
        {loading ? 'Processing...' : tradeType === 'BUY' ? 'BUY' : 'SELL'}
    </button>
    <button
        onClick={() => setTradeType(tradeType === 'BUY' ? 'SELL' : 'BUY')}
        className="text-yellow-500 text-center hover:underline"
    >
        {tradeType === 'BUY' ? 'Or Sell' : 'Or Buy'}
    </button>
</div>
            </div>
        </div>
    );
};

export default TradeModal;