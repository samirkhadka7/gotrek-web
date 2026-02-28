import api from './api';
import { ApiResponse } from '@/types';

export const userService = {
  getMe: (): Promise<ApiResponse> => api.get('/user/me').then((r) => r.data),
  updateProfile: (data: { 
    name?: string; 
    phone?: string; 
    hikerType?: string; 
    ageGroup?: string; 
    emergencyContact?: { name?: string; phone?: string };
    bio?: string;
  }): Promise<ApiResponse> =>
    api.put('/user/me', data).then((r) => r.data),
  updateProfilePicture: (formData: FormData): Promise<ApiResponse> =>
    api.put('/user/me/picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  deactivateAccount: (): Promise<ApiResponse> => api.delete('/user/me').then((r) => r.data),
};
