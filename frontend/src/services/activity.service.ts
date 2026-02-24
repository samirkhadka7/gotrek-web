import api from './api';
import { ApiResponse } from '@/types';

export const activityService = {
  getRecent: (): Promise<ApiResponse> => api.get('/activity').then((r) => r.data),
};
