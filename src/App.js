import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Activity from './pages/Activity';
import Wallet from './pages/Wallet';
import PaymentDetails from './pages/PaymentDetails';
import Withdrawal from './pages/Withdrawal';
import Profile from './pages/Profile';
import ChatBot from './pages/ChatBot';
import ForgotPassword from './pages/ForgotPassword';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function AppLayout() {
    const { user } = useAuth();
    
    if (!user) return null;
    
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/watchlist" element={<Watchlist />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/payment-details" element={<PaymentDetails />} />
                    <Route path="/withdrawal" element={<Withdrawal />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;