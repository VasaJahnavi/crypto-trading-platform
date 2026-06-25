import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        mobile: '',
        dateOfBirth: '',
        nationality: '',
        address: '',
        city: '',
        postcode: '',
        country: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProfile();
        } else {
            setFetching(false);
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            if (user) {
                setProfile({
                    fullName: user.fullName || '',
                    email: user.email || '',
                    mobile: user.mobile || '',
                    dateOfBirth: '',
                    nationality: '',
                    address: '',
                    city: '',
                    postcode: '',
                    country: ''
                });
                
                // Fetch 2FA status
                const response = await fetch(`http://localhost:8081/api/auth/profile/${user.id}`);
                const data = await response.json();
                if (data.success) {
                    setTwoFAEnabled(data.twoFactorAuthEnabled || false);
                }
            }
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setFetching(false);
        }
    };

    const handleToggle2FA = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/auth/toggle-2fa?userId=${user.id}`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                const newStatus = !twoFAEnabled;
                setTwoFAEnabled(newStatus);
                toast.success(`2FA ${newStatus ? 'enabled' : 'disabled'} successfully!`);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error(data.error || 'Failed to toggle 2FA');
            }
        } catch (error) {
            toast.error('Failed to toggle 2FA');
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/user/change-password?userId=${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Password changed successfully!');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.error || 'Failed to change password');
            }
        } catch (error) {
            toast.error('Failed to change password');
        }
        setLoading(false);
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <div className="flex">
                <div className="flex-1 ml-5 p-6">
                    <h1 className="text-2xl font-bold text-white mb-6">Online Trading</h1>

                    {/* Your Information */}
                    <div className="bg-gray-800 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Your Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Email</p>
                                <p className="text-white">{profile.email || user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Full Name</p>
                                <p className="text-white">{profile.fullName || user?.fullName}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Date Of Birth</p>
                                <p className="text-white">{profile.dateOfBirth || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Nationality</p>
                                <p className="text-white">{profile.nationality || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Address</p>
                                <p className="text-white">{profile.address || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">City</p>
                                <p className="text-white">{profile.city || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Postcode</p>
                                <p className="text-white">{profile.postcode || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Country</p>
                                <p className="text-white">{profile.country || 'Not set'}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2 Step Verification */}
                    <div className="bg-gray-800 rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-white">2 Step Verification</h2>
                                <p className="text-gray-400 text-sm">
                                    {twoFAEnabled ? '✅ Enabled' : '❌ Disabled'}
                                </p>
                            </div>
                            <button
                                onClick={handleToggle2FA}
                                disabled={loading}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
                                    twoFAEnabled 
                                        ? 'bg-red-600 hover:bg-red-700' 
                                        : 'bg-green-600 hover:bg-green-700'
                                } text-white disabled:opacity-50`}
                            >
                                {loading ? 'Processing...' : (twoFAEnabled ? 'Disable' : 'Enable')}
                            </button>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-gray-800 rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <p className="text-gray-400 mb-2">{profile.email || user?.email}</p>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500 mb-3"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500 mb-3"
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-yellow-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gray-800 rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Account Status</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Email</span>
                                <span className="text-white">{profile.email || user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mobile</span>
                                <span className="text-white">{profile.mobile || 'Not set'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;