import React, { useState, useEffect } from 'react';
import { getTopCryptos } from '../services/api';
import TradeModal from '../components/TradeModal';
import { useAuth } from '../contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiSend, FiMessageSquare, FiUser, FiX, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [cryptos, setCryptos] = useState([]);
    const [filteredCryptos, setFilteredCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('TOP_50');
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [chartDays, setChartDays] = useState('1D');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { role: 'bot', content: `hi, ${user?.fullName?.split(' ')[0] || 'User'} you can ask crypto related any question like, price, market cap extra...` }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // YOUR CRYPTO DATA
    const cryptoData = [
        { id: "bitcoin", name: "Bitcoin", symbol: "BTC", volume: 26640606963, marketCap: 1325080209740, change24h: -3.03802, price: 67163, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
        { id: "ethereum", name: "Ethereum", symbol: "ETH", volume: 15028519489, marketCap: 425881534065, change24h: -3.40887, price: 3539.74, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
        { id: "tether", name: "Tether", symbol: "USDT", volume: 45670914886, marketCap: 112461838288, change24h: 0.02398, price: 0.998928, image: "https://assets.coingecko.com/coins/images/325/small/Tether.png" },
        { id: "bnb", name: "BNB", symbol: "BNB", volume: 2357559203, marketCap: 94457088904, change24h: -4.73089, price: 612.64, image: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2.png" },
        { id: "solana", name: "Solana", symbol: "SOL", volume: 2263412348, marketCap: 71502805492, change24h: -2.82132, price: 154.81, image: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
        { id: "steth", name: "Lido Staked Ether", symbol: "STETH", volume: 91695017, marketCap: 33646696864, change24h: -3.66483, price: 3536.46, image: "" },
        { id: "usdc", name: "USDC", symbol: "USDC", volume: 6723900805, marketCap: 32082750100, change24h: -0.18707, price: 0.999691, image: "https://assets.coingecko.com/coins/images/6319/small/usdc.png" },
        { id: "xrp", name: "XRP", symbol: "XRP", volume: 1165297063, marketCap: 27028932404, change24h: -1.76187, price: 0.486478, image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png" },
        { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", volume: 958778655, marketCap: 20566494030, change24h: -2.08377, price: 0.141966, image: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png" },
        { id: "cardano", name: "Cardano", symbol: "ADA", volume: 508926290, marketCap: 15260756237, change24h: -4.10261, price: 0.431205, image: "https://assets.coingecko.com/coins/images/975/small/cardano.png" },
        { id: "shiba-inu", name: "Shiba Inu", symbol: "SHIB", volume: 583897119, marketCap: 13135445238, change24h: -3.90343, price: 0.00002229, image: "https://assets.coingecko.com/coins/images/11939/small/shiba.png" },
        { id: "avalanche", name: "Avalanche", symbol: "AVAX", volume: 416024621, marketCap: 12616067887, change24h: -1.95468, price: 32.07, image: "https://assets.coingecko.com/coins/images/12559/small/avalanche.png" },
        { id: "wrapped-bitcoin", name: "Wrapped Bitcoin", symbol: "WBTC", volume: 220961303, marketCap: 10267461776, change24h: -3.24673, price: 67158, image: "https://assets.coingecko.com/coins/images/7598/small/wrapped-bitcoin.png" },
        { id: "tron", name: "TRON", symbol: "TRX", volume: 439985917, marketCap: 10237458328, change24h: 0.76326, price: 0.117191, image: "https://assets.coingecko.com/coins/images/1094/small/tron.png" },
        { id: "chainlink", name: "Chainlink", symbol: "LINK", volume: 463371181, marketCap: 9081136108, change24h: -3.4177, price: 15.46, image: "https://assets.coingecko.com/coins/images/877/small/chainlink.png" },
        { id: "bitcoin-cash", name: "Bitcoin Cash", symbol: "BCH", volume: 291701647, marketCap: 8936432954, change24h: -2.74666, price: 452.67, image: "https://assets.coingecko.com/coins/images/780/small/bitcoin-cash.png" },
        { id: "polkadot", name: "Polkadot", symbol: "DOT", volume: 243852886, marketCap: 8800798279, change24h: -1.36358, price: 6.4, image: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png" },
        { id: "uniswap", name: "Uniswap", symbol: "UNI", volume: 408353665, marketCap: 7113979504, change24h: -4.96689, price: 9.43, image: "https://assets.coingecko.com/coins/images/12504/small/uniswap.png" }
    ];

    useEffect(() => {
        // DIRECTLY USE cryptoData - NO API CALL
        setCryptos(cryptoData);
        setFilteredCryptos(cryptoData);
        setLoading(false);
        generateChartData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = cryptos.filter(crypto =>
                crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crypto.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCryptos(filtered);
        } else {
            setFilteredCryptos(cryptos);
        }
        setCurrentPage(1);
    }, [searchTerm, cryptos]);

    const generateChartData = () => {
        const data = [];
        for (let i = 30; i >= 0; i--) {
            data.push({
                date: `${i}D`,
                price: 71000 + (Math.random() - 0.5) * 2000
            });
        }
        setChartData(data);
    };

    const getTopGainers = () => {
        return [...cryptos]
            .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
            .slice(0, 10);
    };

    const getTopLosers = () => {
        return [...cryptos]
            .sort((a, b) => (a.change24h || 0) - (b.change24h || 0))
            .slice(0, 10);
    };

    const getDisplayedCryptos = () => {
        let data = [];
        if (activeTab === 'TOP_50') data = filteredCryptos;
        else if (activeTab === 'TOP_GAINERS') data = getTopGainers();
        else data = getTopLosers();
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil((activeTab === 'TOP_50' ? filteredCryptos.length : 10) / itemsPerPage);

    const openTradeModal = (crypto) => {
        setSelectedCrypto(crypto);
        setModalOpen(true);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;
        
        const userMessage = { role: 'user', content: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setChatLoading(true);
        
        setTimeout(() => {
            let reply = "";
            const q = chatInput.toLowerCase();
            if (q.includes('bitcoin') || q.includes('btc')) {
                reply = "💰 Bitcoin (BTC) is currently $67,163 USD. 24h change: -3.04%";
            } else if (q.includes('ethereum') || q.includes('eth')) {
                reply = "💰 Ethereum (ETH) is currently $3,539.74 USD. 24h change: -3.41%";
            } else if (q.includes('dogecoin') || q.includes('doge')) {
                reply = "💰 Dogecoin (DOGE) is currently $0.142 USD. 24h change: -2.08%";
            } else if (q.includes('solana') || q.includes('sol')) {
                reply = "💰 Solana (SOL) is currently $154.81 USD. 24h change: -2.82%";
            } else if (q.includes('price') || q.includes('value')) {
                reply = "📈 Current crypto prices:\n• Bitcoin: $67,163\n• Ethereum: $3,539\n• BNB: $612\n• Solana: $154\n• Dogecoin: $0.142";
            } else {
                reply = "💡 I can help with crypto prices, market cap, and trading! Try asking:\n• Bitcoin price\n• Ethereum value\n• Dogecoin price\n• Show me top cryptocurrencies";
            }
            setChatMessages(prev => [...prev, { role: 'bot', content: reply }]);
            setChatLoading(false);
        }, 1000);
    };

    const displayedCryptos = getDisplayedCryptos();

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 ml-5 p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white">Online Trading</h1>
                        <p className="text-gray-400 text-sm mt-1">Welcome, {user?.fullName?.split(' ')[0] || 'User'}!</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-500"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-700">
                        <button
                            onClick={() => { setActiveTab('TOP_50'); setCurrentPage(1); }}
                            className={`pb-2 px-4 font-semibold transition ${activeTab === 'TOP_50' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Top 50
                        </button>
                        <button
                            onClick={() => { setActiveTab('TOP_GAINERS'); setCurrentPage(1); }}
                            className={`pb-2 px-4 font-semibold transition ${activeTab === 'TOP_GAINERS' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Top Gainers
                        </button>
                        <button
                            onClick={() => { setActiveTab('TOP_LOSERS'); setCurrentPage(1); }}
                            className={`pb-2 px-4 font-semibold transition ${activeTab === 'TOP_LOSERS' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Top Losers
                        </button>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-gray-800 rounded-xl p-4 mb-8">
                        <div className="flex gap-4 mb-4">
                            <button onClick={() => setChartDays('1D')} className={`px-4 py-1 rounded-lg transition ${chartDays === '1D' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>1 Day</button>
                            <button onClick={() => setChartDays('1W')} className={`px-4 py-1 rounded-lg transition ${chartDays === '1W' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>1 Week</button>
                            <button onClick={() => setChartDays('1M')} className={`px-4 py-1 rounded-lg transition ${chartDays === '1M' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}>1 Month</button>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} labelStyle={{ color: '#FBBF24' }} />
                                <Line type="monotone" dataKey="price" stroke="#FBBF24" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Crypto Table */}
                    {loading ? (
                        <div className="text-center text-gray-400 py-12">Loading...</div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="text-left p-3 text-gray-300">COIN</th>
                                        <th className="text-left p-3 text-gray-300">SYMBOL</th>
                                        <th className="text-right p-3 text-gray-300">VOLUME</th>
                                        <th className="text-right p-3 text-gray-300">MARKET CAP</th>
                                        <th className="text-right p-3 text-gray-300">24H</th>
                                        <th className="text-right p-3 text-gray-300">PRICE</th>
                                        <th className="text-right p-3 text-gray-300">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedCryptos.map((crypto) => (
                                        <tr key={crypto.id} className="border-t border-gray-700">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <img src={crypto.image} className="w-5 h-5" alt="" onError={(e) => e.target.style.display = 'none'} />
                                                    <span className="text-white font-medium">{crypto.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-300 uppercase font-semibold">{crypto.symbol}</td>
                                            <td className="text-right p-3 text-white">{crypto.volume?.toLocaleString()}</td>
                                            <td className="text-right p-3 text-white">{crypto.marketCap?.toLocaleString()}</td>
                                            <td className={`text-right p-3 font-semibold ${(crypto.change24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {(crypto.change24h || 0).toFixed(2)}%
                                            </td>
                                            <td className="text-right p-3 text-white font-semibold">${crypto.price?.toLocaleString()}</td>
                                            <td className="text-right p-3">
                                                <button onClick={() => openTradeModal(crypto)} className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-600 transition">Trade</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {/* Pagination */}
                            <div className="flex justify-center gap-2 p-4 border-t border-gray-700">
                                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black transition disabled:opacity-50">Previous</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 rounded transition ${currentPage === i + 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black'}`}>{i + 1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-yellow-500 hover:text-black transition disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Chat Icon */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-600 transition z-50"
            >
                <FiMessageCircle size={28} />
            </button>

            {/* Chat Popup Window */}
            {isChatOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col z-50 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-black">🤖 Crypto Assistant</h3>
                            <p className="text-black/80 text-xs">Ask me about crypto!</p>
                        </div>
                        <button onClick={toggleChat} className="text-black hover:text-gray-800">
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && (
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMessageSquare className="text-black text-xs" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                                    msg.role === 'user' 
                                        ? 'bg-yellow-500 text-black' 
                                        : 'bg-gray-700 text-white'
                                }`}>
                                    {msg.content}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiUser className="text-white text-xs" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex gap-2">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <FiMessageSquare className="text-black text-xs" />
                                </div>
                                <div className="bg-gray-700 text-white p-2 rounded-lg text-sm">Typing...</div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                placeholder="write prompt"
                                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600 focus:outline-none focus:border-yellow-500"
                            />
                            <button
                                onClick={sendChatMessage}
                                className="bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-600 transition"
                            >
                                <FiSend />
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default Dashboard;