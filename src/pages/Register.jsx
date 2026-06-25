import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register({ fullName, email, mobile, password });
        if (result.success) {
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-2xl w-96">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mb-4"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mb-4"
                        required
                    />
                    <input
                        type="tel"
                        placeholder="Mobile"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mb-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white mb-6"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 text-black py-2 rounded-lg font-semibold"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Have account? <Link to="/login" className="text-yellow-500">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;