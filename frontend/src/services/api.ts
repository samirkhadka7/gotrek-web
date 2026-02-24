import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthRoute = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/register') || window.location.pathname.startsWith('/forgot-password') || window.location.pathname.startsWith('/reset-password');
      if (!isAuthRoute) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Handle absolute file paths - extract just the /uploads/filename part
  if (path.includes('/uploads/')) {
    const uploadsIndex = path.indexOf('/uploads/');
    const relativePath = path.substring(uploadsIndex);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5050';
    return `${baseUrl}${relativePath}`;
  }
  
  // Handle relative paths
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5050';
  return `${baseUrl}/${path}`;
}

export default api;
