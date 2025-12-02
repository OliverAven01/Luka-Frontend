import { apiRequest, ApiResponse, PaginationParams } from './config';
import { Campaign, CreateCampaignRequest, EnrollCampaignRequest } from './types';

export const campaignsApi = {
  async getActive(params: PaginationParams = {}): Promise<ApiResponse<Campaign[]>> {
    const { page = 1, pageSize = 20 } = params;
    return apiRequest<Campaign[]>(`/api/Campaign/active?page=${page}&pageSize=${pageSize}`);
  },

  async getById(id: string): Promise<ApiResponse<Campaign>> {
    return apiRequest<Campaign>(`/api/Campaign/${id}`);
  },

  async create(campaign: CreateCampaignRequest): Promise<ApiResponse<Campaign>> {
    return apiRequest<Campaign>('/api/Campaign/create', {
      method: 'POST',
      body: JSON.stringify(campaign),
    });
  },

  async enroll(data: EnrollCampaignRequest): Promise<ApiResponse<void>> {
    return apiRequest<void>('/api/Campaign/enroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getByCompany(companyUserId: string): Promise<ApiResponse<Campaign[]>> {
    return apiRequest<Campaign[]>(`/api/Campaign/company/${companyUserId}`);
  },
};
