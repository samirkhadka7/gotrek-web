import api from './api';
import { ApiResponse } from '@/types';

export const checklistService = {
  getAll: (params?: any): Promise<ApiResponse> => api.get('/checklist', { params }).then((r) => r.data),
  generate: (data: { experience: string; duration: string; weather: string }): Promise<ApiResponse> => api.get('/checklist/generate', { params: data }).then((r) => r.data),
  create: (data: { name: string; category: string }): Promise<ApiResponse> => api.post('/checklist', data).then((r) => r.data),
  toggle: (id: string): Promise<ApiResponse> => api.put(`/checklist/${id}/toggle`).then((r) => r.data),
  delete: (id: string): Promise<ApiResponse> => api.delete(`/checklist/${id}`).then((r) => r.data),
  // New methods for saving/loading user checklist
  saveChecklist: (data: { items: any[]; config: any }): Promise<ApiResponse> => api.post('/checklist/save', data).then((r) => r.data),
  getMyChecklist: (): Promise<ApiResponse> => api.get('/checklist/my').then((r) => r.data),
  updateItem: (itemId: string, checked: boolean): Promise<ApiResponse> => api.put(`/checklist/item/${itemId}`, { checked }).then((r) => r.data),
};
