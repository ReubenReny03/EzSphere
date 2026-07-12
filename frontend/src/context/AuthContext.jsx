import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { connectSocket, disconnectSocket } from '@/lib/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem('socketToken'));
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (user && token) {
      connectSocket(token);
      return () => disconnectSocket();
    }
    return undefined;
  }, [user, token]);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    setUser(res.data.user);
    setToken(res.data.token);
    sessionStorage.setItem('socketToken', res.data.token);
    return res.data.user;
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('socketToken');
    disconnectSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
