import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiSend, FiMessageSquare, FiUser } from 'react-icons/fi';

const ChatBot = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'bot', content: `Hi ${user?.fullName?.split(' ')[0] || 'User'}! 👋 Ask me crypto prices, market cap, or trading info!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Crypto data
    const cryptoData = {
        bitcoin: { name: "Bitcoin", symbol: "BTC", price: 67163, change: -3.04, marketCap: "1.32T" },
        ethereum: { name: "Ethereum", symbol: "ETH", price: 3539.74, change: -3.41, marketCap: "425B" },
        tether: { name: "Tether", symbol: "USDT", price: 0.9989, change: 0.02, marketCap: "112B" },
        bnb: { name: "BNB", symbol: "BNB", price: 612.64, change: -4.73, marketCap: "94B" },
        solana: { name: "Solana", symbol: "SOL", price: 154.81, change: -2.82, marketCap: "71B" },
        dogecoin: { name: "Dogecoin", symbol: "DOGE", price: 0.142, change: -2.08, marketCap: "20B" },
        cardano: { name: "Cardano", symbol: "ADA", price: 0.431, change: -4.10, marketCap: "15B" },
        xrp: { name: "XRP", symbol: "XRP", price: 0.486, change: -1.76, marketCap: "27B" },
        shiba: { name: "Shiba Inu", symbol: "SHIB", price: 0.000022, change: -3.90, marketCap: "13B" },
        avalanche: { name: "Avalanche", symbol: "AVAX", price: 32.07, change: -1.95, marketCap: "12B" },
        polkadot: { name: "Polkadot", symbol: "DOT", price: 6.4, change: -1.36, marketCap: "8.8B" },
        uniswap: { name: "Uniswap", symbol: "UNI", price: 9.43, change: -4.96, marketCap: "7.1B" }
    };

    const getBotReply = (question) => {
        const q = question.toLowerCase();
        let reply = "";

        // Find which coin is being asked about
        let foundCoin = null;
        let foundKey = null;
        for (const [key, coin] of Object.entries(cryptoData)) {
            if (q.includes(key) || q.includes(coin.symbol.toLowerCase())) {
                foundCoin = coin;
                foundKey = key;
                break;
            }
        }

        // If a specific coin is found
        if (foundCoin) {
            if (q.includes('price') || q.includes('value') || q.includes('how much') || q.includes('cost')) {
                reply = `💰 ${foundCoin.name} (${foundCoin.symbol}) is currently $${foundCoin.price.toLocaleString()} USD. 24h change: ${foundCoin.change}%`;
            } else if (q.includes('market cap') || q.includes('market capitalization')) {
                reply = `📊 ${foundCoin.name} market cap is $${foundCoin.marketCap} USD.`;
            } else if (q.includes('change') || q.includes('today')) {
                reply = `📉 ${foundCoin.name} 24h change is ${foundCoin.change}%`;
            } else {
                reply = `💰 ${foundCoin.name} (${foundCoin.symbol}) is at $${foundCoin.price.toLocaleString()} USD. Market cap: $${foundCoin.marketCap}`;
            }
        }
        // Generic price question
        else if (q.includes('price') || q.includes('value') || q.includes('how much')) {
            reply = "📈 Current crypto prices:\n• Bitcoin (BTC): $67,163\n• Ethereum (ETH): $3,539\n• BNB: $612\n• Solana (SOL): $154\n• Dogecoin (DOGE): $0.142\n• Cardano (ADA): $0.431\n• XRP: $0.486\n\nWhich coin would you like to know more about?";
        }
        // Market cap question
        else if (q.includes('market cap') || q.includes('market capitalization')) {
            reply = "📊 Top market caps:\n• Bitcoin: $1.32T\n• Ethereum: $425B\n• BNB: $94B\n• Solana: $71B\n• XRP: $27B\n• Dogecoin: $20B\n• Cardano: $15B";
        }
        // Top coins
        else if (q.includes('top') || q.includes('popular') || q.includes('list')) {
            reply = "🏆 Top cryptocurrencies:\n1. Bitcoin (BTC) - $67,163\n2. Ethereum (ETH) - $3,539\n3. Tether (USDT) - $0.99\n4. BNB - $612\n5. Solana (SOL) - $154\n6. Dogecoin (DOGE) - $0.142\n7. Cardano (ADA) - $0.431";
        }
        // Greeting
        else if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
            reply = `Hello ${user?.fullName?.split(' ')[0] || 'User'}! 👋 I can help with:\n• Crypto prices (e.g., 'Bitcoin price')\n• Market cap (e.g., 'Ethereum market cap')\n• Top cryptocurrencies\n• Specific coins like BTC, ETH, DOGE, SOL, ADA, XRP\n\nWhat would you like to know?`;
        }
        // Default
        else {
            reply = "💡 I can help with crypto prices, market cap, and trading info!\n\nTry asking:\n• 'Bitcoin price'\n• 'Ethereum market cap'\n• 'Show me top cryptocurrencies'\n• 'How much is Dogecoin?'\n• 'Solana price'";
        }

        return reply;
    };

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setLoading(true);
        const userQuestion = input;
        setInput('');

        setTimeout(() => {
            const reply = getBotReply(userQuestion);
            setMessages(prev => [...prev, { role: 'bot', content: reply }]);
            setLoading(false);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    const suggestedQuestions = [
        "Bitcoin price",
        "Ethereum market cap",
        "How much is Dogecoin?",
        "Solana price",
        "Show me top cryptocurrencies",
        "BNB price"
    ];

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <div className="flex-1 ml-64 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gray-800 rounded-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4">
                                <h1 className="text-xl font-bold text-black">🤖 AI Crypto Assistant</h1>
                                <p className="text-black/80 text-sm">Ask me anything about cryptocurrencies!</p>
                            </div>

                            {/* Messages */}
                            <div className="h-96 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FiMessageSquare className="text-black text-sm" />
                                            </div>
                                        )}
                                        <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                                            msg.role === 'user' 
                                                ? 'bg-yellow-500 text-black' 
                                                : 'bg-gray-700 text-white'
                                        }`}>
                                            {msg.content.split('\n').map((line, i) => (
                                                <React.Fragment key={i}>
                                                    {line}
                                                    {i < msg.content.split('\n').length - 1 && <br />}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FiUser className="text-white text-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FiMessageSquare className="text-black text-sm" />
                                        </div>
                                        <div className="bg-gray-700 text-white p-3 rounded-lg text-sm">Typing...</div>
                                    </div>
                                )}
                            </div>

                            {/* Suggested Questions */}
                            <div className="px-4 py-2 border-t border-gray-700">
                                <p className="text-gray-400 text-xs mb-2">Suggested questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {suggestedQuestions.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setInput(q)}
                                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs hover:bg-gray-600 transition"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-gray-700 flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about crypto prices, market cap, etc..."
                                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white text-sm border border-gray-600 focus:outline-none focus:border-yellow-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={loading}
                                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;