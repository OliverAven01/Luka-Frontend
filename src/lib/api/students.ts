import { apiRequest, ApiResponse } from './config';
import { Campaign, StudentBalance, PurchaseRequest } from './types';

export const studentsApi = {
  async getCampaigns(studentId: string): Promise<ApiResponse<Campaign[]>> {
    return apiRequest<Campaign[]>(`/api/Student/${studentId}/campaigns`);
  },

  async getBalance(studentId: string): Promise<ApiResponse<StudentBalance>> {
    return apiRequest<StudentBalance>(`/api/Student/${studentId}/balance`);
  },

  async purchase(data: PurchaseRequest): Promise<ApiResponse<void>> {
    return apiRequest<void>('/api/Student/purchase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
