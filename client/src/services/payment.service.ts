import api from './api';
import { ApiResponse } from '@/types';

export const paymentService = {
  initiatePayment: (data: { plan: string; amount: number }): Promise<ApiResponse> => 
    api.post('/payment/initiate', data).then((r) => r.data),
  verifyPayment: (queryParams: string): Promise<ApiResponse> => api.get(`/payment/verify${queryParams}`).then((r) => r.data),
  getHistory: (): Promise<ApiResponse> => api.get('/payment/history').then((r) => r.data),
  getAllHistory: (): Promise<ApiResponse> => api.get('/payment/all-history').then((r) => r.data),
};
