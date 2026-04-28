import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (using localStorage for session persistence)
        const savedUser = localStorage.getItem('admin_user');
        const token = localStorage.getItem('token');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/admin/login', {
                email: email.trim(),
                password: password.trim(),
            });
            
            if (response.data && response.data.token) {
                const userData = response.data.user;
                const token = response.data.token;
                
                setUser(userData);
                localStorage.setItem('admin_user', JSON.stringify(userData));
                localStorage.setItem('token', token);
                
                return userData;
            } else {
                throw new Error(response.data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || error.message || 'Login failed');
        }
    };

    const logout = async () => {
        try {
            // Optional: call backend logout if available
            await api.post('/auth/logout').catch(() => {});
        } finally {
            setUser(null);
            localStorage.removeItem('admin_user');
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
