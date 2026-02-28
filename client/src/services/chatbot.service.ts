import api from './api';
import { ApiResponse } from '@/types';

export const chatbotService = {
  query: (query: string): Promise<ApiResponse> =>
    api.post('/v1/chatbot/query', { query }).then((r) => r.data),
};
