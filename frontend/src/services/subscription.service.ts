import api from './api';
import { ApiResponse } from '@/types';

export const subscriptionService = {
  cancel: (): Promise<ApiResponse> =>
    api.put('/subscription/cancel').then((r) => r.data),
};
