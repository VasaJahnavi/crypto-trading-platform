import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: { 'Content-Type': 'application/json' }
});

// Auth APIs
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);

// Crypto APIs
export const getTopCryptos = () => API.get('/crypto/top');
export const getCoinById = (coinId) => API.get(`/crypto/coin/${coinId}`);
export const searchCrypto = (query) => API.get(`/crypto/search?q=${query}`);

// Trading APIs
export const buyCrypto = (userId, data) => API.post(`/trading/buy?userId=${userId}`, data);
export const sellCrypto = (userId, data) => API.post(`/trading/sell?userId=${userId}`, data);
export const getPortfolio = (userId) => API.get(`/trading/portfolio/${userId}`);
export const getTransactions = (userId) => API.get(`/trading/transactions/${userId}`);
export const transferMoney = (userId, data) => API.post(`/transfer/send?userId=${userId}`, data);

// Wallet APIs
export const getWalletBalance = (userId) => API.get(`/payment/wallet/${userId}`);
export const addMoney = (userId, data) => API.post(`/payment/add-money?userId=${userId}`, data);
export const getPaymentHistory = (userId) => API.get(`/payment/history/${userId}`);

// Watchlist APIs
export const getWatchlist = (userId) => API.get(`/watchlist/${userId}`);
export const addToWatchlist = (userId, coinId) => API.post(`/watchlist/add?userId=${userId}&coinId=${coinId}`);
export const removeFromWatchlist = (userId, coinId) => API.delete(`/watchlist/remove?userId=${userId}&coinId=${coinId}`);

// Payment Details APIs
export const getPaymentDetails = (userId) => API.get(`/payment/details/${userId}`);
export const savePaymentDetails = (userId, data) => API.post(`/payment/details?userId=${userId}`, data);

// Withdrawal API
export const requestWithdrawal = (userId, data) => API.post(`/payment/withdraw?userId=${userId}`, data);

// Profile APIs
export const getUserProfile = (userId) => API.get(`/user/profile/${userId}`);
export const updatePassword = (userId, data) => API.post(`/user/change-password?userId=${userId}`, data);
export const toggle2FA = (userId) => API.post(`/user/toggle-2fa?userId=${userId}`);

export default API;