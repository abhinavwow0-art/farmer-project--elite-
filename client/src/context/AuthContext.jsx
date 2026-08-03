import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('farmiq_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        const userData = res.data;
        localStorage.setItem('farmiq_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, role) => {
        const res = await API.post('/auth/register', { name, email, password, role });
        const userData = res.data;
        localStorage.setItem('farmiq_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('farmiq_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
