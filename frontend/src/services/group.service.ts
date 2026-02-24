import api from './api';
import { ApiResponse } from '@/types';

export const groupService = {
  getAll: (params?: any): Promise<ApiResponse> => api.get('/group', { params }).then((r) => r.data),
  getById: (id: string): Promise<ApiResponse> => api.get(`/group/${id}`).then((r) => r.data),
  create: (data: FormData): Promise<ApiResponse> => api.post('/group/create', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id: string, data: any): Promise<ApiResponse> => api.put(`/group/${id}`, data, { headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {} }).then((r) => r.data),
  requestToJoin: (id: string, data?: { message?: string }): Promise<ApiResponse> => api.post(`/group/${id}/request-join`, data).then((r) => r.data),
  leaveGroup: (id: string): Promise<ApiResponse> => api.post(`/group/${id}/leave`).then((r) => r.data),
  delete: (id: string): Promise<ApiResponse> => api.delete(`/group/${id}`).then((r) => r.data),
  approveRequest: (groupId: string, requestId: string): Promise<ApiResponse> => api.patch(`/group/${groupId}/requests/${requestId}/approve`).then((r) => r.data),
  denyRequest: (groupId: string, requestId: string): Promise<ApiResponse> => api.patch(`/group/${groupId}/requests/${requestId}/deny`).then((r) => r.data),
  getPendingRequests: (): Promise<ApiResponse> => api.get('/group/requests/pending').then((r) => {
    console.log('getPendingRequests response:', r.data);
    return r.data;
  }),
  uploadPhotos: (groupId: string, formData: FormData): Promise<ApiResponse> =>
    api.post(`/group/${groupId}/photos`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
};
