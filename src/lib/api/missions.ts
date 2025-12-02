import { apiRequest, ApiResponse } from './config';
import { UserMission, AssignMissionRequest, CompleteMissionRequest } from './types';

export const missionsApi = {
  async assign(data: AssignMissionRequest): Promise<ApiResponse<UserMission>> {
    return apiRequest<UserMission>('/api/Mission/assign', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async complete(data: CompleteMissionRequest): Promise<ApiResponse<UserMission>> {
    return apiRequest<UserMission>('/api/Mission/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getByUser(userId: string): Promise<ApiResponse<UserMission[]>> {
    return apiRequest<UserMission[]>(`/api/Mission/user/${userId}`);
  },

  async getPending(userId: string): Promise<ApiResponse<UserMission[]>> {
    return apiRequest<UserMission[]>(`/api/Mission/user/${userId}/pending`);
  },

  async getCompleted(userId: string): Promise<ApiResponse<UserMission[]>> {
    return apiRequest<UserMission[]>(`/api/Mission/user/${userId}/completed`);
  },
};
