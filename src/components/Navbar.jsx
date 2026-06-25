import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-xl font-bold text-yellow-500">
                        Online Trading 🚀
                    </Link>
                    
                    {user ? (
                        <div className="flex items-center space-x-6">
                            <Link to="/dashboard" className="hover:text-yellow-500 transition">Dashboard</Link>
                            <Link to="/wallet" className="hover:text-yellow-500 transition">Wallet</Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-yellow-500 transition">Login</Link>
                            <Link to="/register" className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-black">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;