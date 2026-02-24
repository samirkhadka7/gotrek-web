import api from './api';
import { ApiResponse } from '@/types';

export const trailService = {
  getAll: (params?: any): Promise<ApiResponse> => api.get('/trail', { params }).then((r) => r.data),
  getById: (id: string): Promise<ApiResponse> => api.get(`/trail/${id}`).then((r) => r.data),
  create: (data: FormData): Promise<ApiResponse> => api.post('/trail/create', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: FormData): Promise<ApiResponse> => api.put(`/trail/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  delete: (id: string): Promise<ApiResponse> => api.delete(`/trail/${id}`).then((r) => r.data),
  // Join trail with scheduled date
  joinWithDate: (id: string, data: { scheduledDate: string }): Promise<ApiResponse> => api.post(`/trail/${id}/join-with-date`, data).then((r) => r.data),
  // Complete a joined trail
  completeTrail: (joinedTrailId: string): Promise<ApiResponse> => api.post(`/trail/joined/${joinedTrailId}/complete`).then((r) => r.data),
  // Cancel a joined trail
  cancelJoinedTrail: (joinedTrailId: string): Promise<ApiResponse> => api.delete(`/trail/joined/${joinedTrailId}/cancel`).then((r) => r.data),
};
