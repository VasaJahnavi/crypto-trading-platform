import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const sendOTP = async () => {
        console.log('sendOTP called');
        if (!email) {
            toast.error('Please enter your email');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/auth/forgot-password/send-otp?email=${email}`);
            const data = await response.json();
            console.log('Send OTP response:', data);
            if (data.success) {
                setStep(2);
                toast.success('OTP sent!');
            } else {
                toast.error(data.error || 'Email not found');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            toast.error('Failed to send OTP');
        }
        setLoading(false);
    };

    const resetPassword = async () => {
        console.log('resetPassword called');
        if (!otp || otp.length !== 6) {
            toast.error('Enter valid 6-digit OTP');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/api/auth/forgot-password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await response.json();
            console.log('Reset response:', data);
            if (data.success) {
                toast.success('Password reset successfully!');
                setTimeout(() => window.location.href = '/login', 1500);
            } else {
                toast.error(data.error || 'Failed to reset');
            }
        } catch (error) {
            console.error('Reset error:', error);
            toast.error('Failed to reset password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl w-96">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Forgot Password</h2>
                
                {step === 1 && (
                    <div>
                        <p className="text-gray-400 text-sm mb-4">Enter your email to receive OTP.</p>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <button
                            onClick={sendOTP}
                            disabled={loading}
                            className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                        <p className="text-center text-gray-400 mt-4">
                            <Link to="/login" className="text-yellow-500 hover:underline">Back to Login</Link>
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <p className="text-gray-400 text-sm mb-4">Enter OTP and set new password.</p>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">OTP</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                maxLength="6"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <button
                            onClick={resetPassword}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button
                            onClick={() => { setStep(1); setOtp(''); }}
                            className="text-gray-400 text-sm hover:text-white mt-3 w-full text-center"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;