import React, { createContext, useState, useContext } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = async (email, password) => {
        try {
            const response = await loginApi({ email, password });
            if (response.data.success) {
                const userData = {
                    id: response.data.userId,
                    email: response.data.email,
                    fullName: response.data.fullName
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerApi(userData);
  
            if (response.data.success) {
                return { success: true, message: response.data.message };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return { success: false, message: 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};