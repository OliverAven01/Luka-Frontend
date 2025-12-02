import { apiRequest, ApiResponse } from './config';
import {
  PendingCompany,
  ApproveCompanyRequest,
  AdminStatistics,
  EmitLukasRequest,
  LukasValue,
} from './types';

export const adminApi = {
  async getPendingCompanies(): Promise<ApiResponse<PendingCompany[]>> {
    return apiRequest<PendingCompany[]>('/api/Admin/companies/pending');
  },

  async approveCompany(data: ApproveCompanyRequest): Promise<ApiResponse<void>> {
    return apiRequest<void>('/api/Admin/companies/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getStatistics(): Promise<ApiResponse<AdminStatistics>> {
    return apiRequest<AdminStatistics>('/api/Admin/statistics');
  },

  async emitLukas(data: EmitLukasRequest): Promise<ApiResponse<void>> {
    return apiRequest<void>('/api/Admin/lukas/emit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getLukasValue(): Promise<ApiResponse<LukasValue>> {
    return apiRequest<LukasValue>('/api/Admin/lukas/value');
  },

  async updateLukasValue(lukasToUsdRate: number): Promise<ApiResponse<LukasValue>> {
    return apiRequest<LukasValue>('/api/Admin/lukas/value', {
      method: 'PUT',
      body: JSON.stringify({ lukasToUsdRate }),
    });
  },
};
