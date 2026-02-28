import api from './api';
import { ApiResponse } from '@/types';

export const adminService = {
  getDashboard: (): Promise<ApiResponse> => {
    console.log('[Admin Service] Calling getDashboard...');
    return api.get('/analytics').then((r) => {
      console.log('[Admin Service] Dashboard response:', r.data);
      return r.data;
    }).catch((e) => {
      console.error('[Admin Service] Dashboard error:', e);
      throw e;
    });
  },
  getRecentActivities: (): Promise<ApiResponse> => {
    console.log('[Admin Service] Calling getRecentActivities...');
    return api.get('/activity').then((r) => {
      console.log('[Admin Service] Activities response:', r.data);
      return r.data;
    }).catch((e) => {
      console.error('[Admin Service] Activities error:', e);
      throw e;
    });
  },
  getUsers: (params?: any): Promise<ApiResponse> => {
    console.log('[Admin Service] Calling getUsers...');
    return api.get('/user', { params }).then((r) => {
      console.log('[Admin Service] Users response:', r.data);
      return r.data;
    }).catch((e) => {
      console.error('[Admin Service] Users error:', e);
      throw e;
    });
  },
  getUserById: (id: string): Promise<ApiResponse> => api.get(`/user/${id}`).then((r) => r.data),
  createUser: (data: any): Promise<ApiResponse> => api.post('/user/create', data).then((r) => r.data),
  updateUser: (id: string, data: any): Promise<ApiResponse> => api.put(`/user/${id}`, data).then((r) => r.data),
  deleteUser: (id: string): Promise<ApiResponse> => api.delete(`/user/${id}`).then((r) => r.data),
  updateUserRole: (userToUpdateId: string, newRoles: string): Promise<ApiResponse> => api.put(`/user/role/${userToUpdateId}`, { newRoles }).then((r) => r.data),
  getTrails: (params?: any): Promise<ApiResponse> => {
    console.log('[Admin Service] Calling getTrails...');
    return api.get('/trail', { params }).then((r) => {
      console.log('[Admin Service] Trails response:', r.data);
      return r.data;
    }).catch((e) => {
      console.error('[Admin Service] Trails error:', e);
      throw e;
    });
  },
  getGroups: (params?: any): Promise<ApiResponse> => {
    console.log('[Admin Service] Calling getGroups...');
    return api.get('/group', { params }).then((r) => {
      console.log('[Admin Service] Groups response:', r.data);
      return r.data;
    }).catch((e) => {
      console.error('[Admin Service] Groups error:', e);
      throw e;
    });
  },
  updateGroup: (id: string, data: any): Promise<ApiResponse> => api.put(`/group/${id}`, data).then((r) => r.data),
  deleteGroup: (id: string): Promise<ApiResponse> => api.delete(`/group/${id}`).then((r) => r.data),
  getRequests: (): Promise<ApiResponse> => api.get('/group/requests/pending').then((r) => r.data),
  handleRequest: (groupId: string, requestId: string, action: string): Promise<ApiResponse> => {
    const endpoint = action === 'approve' ? 'approve' : 'deny';
    return api.patch(`/group/${groupId}/requests/${requestId}/${endpoint}`).then((r) => r.data);
  },
  getPayments: (params?: any): Promise<ApiResponse> => api.get('/payment/all-history', { params }).then((r) => r.data),
};
