import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
    FiHome, 
    FiPieChart, 
    FiStar,
    FiActivity, 
    FiDollarSign,
    FiCreditCard,
    FiLogOut,
    FiUser,
    FiMessageSquare
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', name: 'Home', icon: <FiHome /> },
        { path: '/portfolio', name: 'Portfolio', icon: <FiPieChart /> },
        { path: '/watchlist', name: 'Watchlist', icon: <FiStar /> },
        { path: '/activity', name: 'Activity', icon: <FiActivity /> },
        { path: '/wallet', name: 'Wallet', icon: <FiDollarSign /> },
        { path: '/payment-details', name: 'Payment Details', icon: <FiCreditCard /> },
        { path: '/withdrawal', name: 'Withdrawal', icon: <FiLogOut /> },
        { path: '/profile', name: 'Profile', icon: <FiUser /> },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50">
            <div className="p-6">
                <h1 className="text-xl font-bold text-yellow-500">Trading</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome, {user?.fullName?.split(' ')[0]}</p>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-yellow-500 transition ${
                            location.pathname === item.path ? 'bg-gray-800 text-yellow-500 border-r-2 border-yellow-500' : ''
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="absolute bottom-0 w-full p-6 border-t border-gray-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-gray-300 hover:text-red-500 transition w-full"
                >
                    <FiLogOut />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;