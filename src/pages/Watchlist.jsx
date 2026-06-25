import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getWatchlist, removeFromWatchlist, addToWatchlist, getTopCryptos } from '../services/api';
import TradeModal from '../components/TradeModal';
import toast from 'react-hot-toast';
import { FiStar, FiTrash2 } from 'react-icons/fi';

const Watchlist = () => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [allCoins, setAllCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchWatchlist();
            fetchAllCoins();
        }
    }, [user]);

    const fetchWatchlist = async () => {
        try {
            const response = await getWatchlist(user.id);
            if (response.data.success) {
                setWatchlist(response.data.watchlist || []);
            }
        } catch (error) {
            toast.error('Failed to fetch watchlist');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllCoins = async () => {
        try {
            const response = await getTopCryptos();
            if (response.data.success) {
                setAllCoins(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch coins');
        }
    };

    const handleRemove = async (coinId) => {
        try {
            const response = await removeFromWatchlist(user.id, coinId);
            if (response.data.success) {
                toast.success('Removed from watchlist');
                fetchWatchlist();
            }
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const handleAdd = async (coinId) => {
        try {
            const response = await addToWatchlist(user.id, coinId);
            if (response.data.success) {
                toast.success('Added to watchlist');
                fetchWatchlist();
            }
        } catch (error) {
            toast.error('Failed to add');
        }
    };

    const openTradeModal = (crypto) => {
        setSelectedCrypto(crypto);
        setModalOpen(true);
    };

    const filteredCoins = allCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isInWatchlist = (coinId) => {
        return watchlist.some(item => item.id === coinId);
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <div className="flex-1 ml-5 p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Watchlist</h1>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search coins to add to watchlist..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    {/* Search Results */}
                    {searchTerm && filteredCoins.length > 0 && (
                        <div className="bg-gray-800 rounded-xl mb-6 overflow-hidden">
                            <h3 className="text-gray-300 p-3 border-b border-gray-700">Search Results</h3>
                            {filteredCoins.slice(0, 5).map((coin) => (
                                <div key={coin.id} className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-gray-750">
                                    <div className="flex items-center gap-3">
                                        <img src={coin.image} className="w-6 h-6" alt="" />
                                        <div>
                                            <p className="text-white font-medium">{coin.name}</p>
                                            <p className="text-gray-400 text-sm uppercase">{coin.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openTradeModal(coin)}
                                            className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
                                        >
                                            Trade
                                        </button>
                                        <button
                                            onClick={() => handleAdd(coin.id)}
                                            disabled={isInWatchlist(coin.id)}
                                            className={`px-3 py-1 rounded-lg text-sm ${
                                                isInWatchlist(coin.id)
                                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                        >
                                            {isInWatchlist(coin.id) ? 'Added' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Watchlist Table */}
                    {loading ? (
                        <div className="text-center text-gray-400 py-12">Loading...</div>
                    ) : watchlist.length === 0 ? (
                        <div className="bg-gray-800 rounded-xl p-12 text-center">
                            <FiStar className="text-gray-600 text-4xl mx-auto mb-3" />
                            <p className="text-gray-400">No coins in watchlist</p>
                            <p className="text-gray-500 text-sm mt-1">Search and add coins to track them</p>
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr className="text-gray-300">
                                        <th className="text-left p-3">COIN</th>
                                        <th className="text-left p-3">SYMBOL</th>
                                        <th className="text-right p-3">PRICE</th>
                                        <th className="text-right p-3">24H</th>
                                        <th className="text-right p-3">ACTION</th>
                                        <th className="text-right p-3">REMOVE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {watchlist.map((coin) => (
                                        <tr key={coin.id} className="border-t border-gray-700">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <img src={coin.image} className="w-5 h-5" alt="" />
                                                    <span className="text-white">{coin.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-300 uppercase">{coin.symbol}</td>
                                            <td className="text-right p-3 text-white">${coin.currentPrice?.toLocaleString()}</td>
                                            <td className={`text-right p-3 ${coin.priceChangePercentage24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {coin.priceChangePercentage24h?.toFixed(2)}%
                                            </td>
                                            <td className="text-right p-3">
                                                <button
                                                    onClick={() => openTradeModal(coin)}
                                                    className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
                                                >
                                                    Trade
                                                </button>
                                            </td>
                                            <td className="text-right p-3">
                                                <button
                                                    onClick={() => handleRemove(coin.id)}
                                                    className="text-red-500 hover:text-red-400"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

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

export default Watchlist;