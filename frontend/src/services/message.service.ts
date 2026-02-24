import api from './api';
import { ApiResponse } from '@/types';

export const messageService = {
  getByGroup: (groupId: string): Promise<ApiResponse> =>
    api.get(`/messages/${groupId}`).then((r) => r.data),
};
