import api from './api';
import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050/api';

export const authService = {
  register: (data: { name: string; email: string; password: string; phone?: string }): Promise<ApiResponse> =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (data: { email: string; password: string }): Promise<ApiResponse> =>
    api.post('/auth/login', data).then((r) => r.data),
  // Google OAuth - redirect to backend
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
};
