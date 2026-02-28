'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setIsLoading(false); return; }
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const { data } = await api.get('/user/me');
      console.log('[AuthContext] User data:', data);
      const userData = data.data || data.user || data;
      console.log('[AuthContext] Extracted user:', userData);
      setUser(userData);
    } catch (err) {
      console.error('[AuthContext] Fetch user error:', err);
      localStorage.removeItem('token');
    }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUser(); }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      console.log('[AuthContext] Login response:', data);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      const userData = data.user || data.data;
      console.log('[AuthContext] Setting user:', userData);
      setUser(userData);
      toast.success('Welcome back!');
      return true;
    } catch (err: any) { toast.error(err.response?.data?.message || 'Login failed'); return false; }
  };

  const register = async (regData: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/register', regData);
      localStorage.setItem('token', data.token);
      if (data.token) {
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      }
      setUser(data.user || data.data);
      toast.success('Account created!');
      return true;
    } catch (err: any) { toast.error(err.response?.data?.message || 'Registration failed'); return false; }
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); window.location.href = '/'; };
  const refreshUser = async () => { await fetchUser(); };

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>{children}</AuthContext.Provider>;
}
