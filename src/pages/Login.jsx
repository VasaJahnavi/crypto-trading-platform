import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    // Step 1: Login with email + password
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log("Login response:", data);

            if (data.success) {
                if (data.requires2FA) {
                    // 2FA is required - show OTP input
                    setRequires2FA(true);
                    setUserId(data.userId);
                    toast.success('OTP sent to your email!');
                } else if (data.authenticated) {
                    // No 2FA - login directly
                    const userData = {
                        id: data.userId,
                        email: data.email,
                        fullName: data.fullName
                    };
                    localStorage.setItem('user', JSON.stringify(userData));
                    toast.success('Login successful!');
                    navigate('/dashboard');
                } else {
                    // Neither 2FA nor authenticated
                    toast.error('Login failed. Please try again.');
                }
            } else {
                toast.error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error('Login failed');
        }
        setLoading(false);
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            console.log("Verifying OTP for userId:", userId, "OTP:", otp);
            
            const response = await fetch(`http://localhost:8081/api/auth/verify-otp?userId=${userId}&otp=${otp}`, {
                method: 'POST'
            });
            const data = await response.json();
            console.log("OTP verification response:", data);

            if (data.success && data.authenticated) {
                toast.success('OTP verified! Login successful!');
                const userData = {
                    id: data.userId,
                    email: data.email,
                    fullName: data.fullName
                };
                localStorage.setItem('user', JSON.stringify(userData));
                // Use window.location for full page redirect
                window.location.href = '/dashboard';
            } else {
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            toast.error('OTP verification failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl w-96">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Online Trading</h2>
                
                {/* Normal Login Form */}
                {!requires2FA ? (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        <p className="text-center text-gray-400 mt-4">
                            No account? <Link to="/register" className="text-yellow-500">Register</Link>
                        </p>
	<p className="text-center text-gray-400 mt-2">
    <Link to="/forgot-password" className="text-yellow-500 text-sm hover:underline">Forgot Password?</Link>
</p>
                    </form>
                ) : (
                    // 2FA Verification Form
                    <div>
                        <h3 className="text-white text-xl font-semibold mb-2">2FA Verification</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Enter the OTP sent to your email
                        </p>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:border-yellow-500 mb-3"
                                maxLength="6"
                            />
                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setRequires2FA(false);
                                setOtp('');
                            }}
                            className="text-yellow-500 text-sm hover:underline mt-3"
                        >
                            ← Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;