import api from './api';
import { ApiResponse } from '@/types';

export const stepService = {
  save: (data: { userId: string; trailId: string; steps: number }): Promise<ApiResponse> => 
    api.post('/step', data).then((r) => r.data),
  getTotalForUser: (userId: string): Promise<ApiResponse> => 
    api.get(`/step/total/${userId}`).then((r) => r.data),
};
