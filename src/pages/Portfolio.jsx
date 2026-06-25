import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPortfolio, getTopCryptos } from '../services/api';
import TradeModal from '../components/TradeModal';
import toast from 'react-hot-toast';

const Portfolio = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentPrices, setCurrentPrices] = useState({});

    useEffect(() => {
        if (user) {
            fetchPortfolio();
            fetchCurrentPrices();
        }
    }, [user]);

    const fetchCurrentPrices = async () => {
        try {
            const response = await getTopCryptos();
            if (response.data.success) {
                const priceMap = {};
                response.data.data.forEach(coin => {
                    priceMap[coin.id] = coin.currentPrice;
                });
                setCurrentPrices(priceMap);
            }
        } catch (error) {
            console.error('Failed to fetch prices');
        }
    };

    const fetchPortfolio = async () => {
        try {
            const response = await getPortfolio(user.id);
            if (response.data.success) {
                const portfolioAssets = response.data.assets || [];
                setAssets(portfolioAssets);
                
                let totalVal = 0;
                let totalCst = 0;
                portfolioAssets.forEach(asset => {
                    const currentPrice = currentPrices[asset.coinId] || asset.avgBuyPrice;
                    totalVal += asset.quantity * currentPrice;
                    totalCst += asset.quantity * asset.avgBuyPrice;
                });
                setTotalValue(totalVal);
                setTotalCost(totalCst);
            }
        } catch (error) {
            toast.error('Failed to fetch portfolio');
        } finally {
            setLoading(false);
        }
    };

    const openTradeModal = (asset) => {
        // Create a crypto object with current price
        const cryptoObj = {
            id: asset.coinId,
            name: asset.coinName,
            symbol: asset.coinSymbol,
            currentPrice: currentPrices[asset.coinId] || asset.avgBuyPrice,
            price: currentPrices[asset.coinId] || asset.avgBuyPrice
        };
        setSelectedCrypto(cryptoObj);
        setModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading portfolio...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <div className="flex-1 ml-5 p-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Portfolio</h1>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-800 rounded-xl p-4">
                            <p className="text-gray-400 text-sm">Total Value</p>
                            <p className="text-white text-2xl font-bold">${totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-4">
                            <p className="text-gray-400 text-sm">Total Cost</p>
                            <p className="text-white text-2xl font-bold">${totalCost.toLocaleString()}</p>
                        </div>
                    </div>

                    {assets.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-12 text-center">
                            <p className="text-gray-400">No assets yet. Start trading!</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr className="text-gray-300">
                                        <th className="text-left p-3">ASSET</th>
                                        <th className="text-right p-3">PRICE</th>
                                        <th className="text-right p-3">UNIT</th>
                                        <th className="text-right p-3">CHANGE</th>
                                        <th className="text-right p-3">CHANGE(%)</th>
                                        <th className="text-right p-3">VALUE</th>
                                        <th className="text-right p-3">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((asset) => {
                                        const currentPrice = currentPrices[asset.coinId] || asset.avgBuyPrice;
                                        const currentValue = asset.quantity * currentPrice;
                                        const costValue = asset.quantity * asset.avgBuyPrice;
                                        const change = currentValue - costValue;
                                        const changePercent = (change / costValue) * 100;
                                        
                                        return (
                                            <tr 
                                                key={asset.id} 
                                                className="border-t border-gray-700 cursor-pointer hover:bg-gray-750 transition"
                                                onClick={() => openTradeModal(asset)}
                                            >
                                                <td className="p-3">
                                                    <div>
                                                        <p className="text-white font-semibold">{asset.coinName}</p>
                                                        <p className="text-gray-400 text-sm uppercase">{asset.coinSymbol}</p>
                                                    </div>
                                                </td>
                                                <td className="text-right p-3 text-white">${currentPrice.toLocaleString()}</td>
                                                <td className="text-right p-3 text-white">{asset.quantity}</td>
                                                <td className={`text-right p-3 font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    ${Math.abs(change).toFixed(2)}
                                                </td>
                                                <td className={`text-right p-3 font-semibold ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {changePercent.toFixed(2)}%
                                                </td>
                                                <td className="text-right p-3 text-white font-semibold">${currentValue.toFixed(2)}</td>
                                                <td className="text-right p-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openTradeModal(asset);
                                                        }}
                                                        className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition"
                                                    >
                                                        Trade
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Trade Modal */}
            {selectedCrypto && (
                <TradeModal
                    crypto={selectedCrypto}
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Portfolio;