import { apiRequest, ApiResponse } from './config';
import { Coupon, CreateCouponRequest } from './types';

export const couponsApi = {
  async create(coupon: CreateCouponRequest): Promise<ApiResponse<Coupon>> {
    return apiRequest<Coupon>('/api/Coupon', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  async getByCode(code: string): Promise<ApiResponse<Coupon>> {
    return apiRequest<Coupon>(`/api/Coupon/code/${code}`);
  },

  async getByCampaign(campaignId: string): Promise<ApiResponse<Coupon[]>> {
    return apiRequest<Coupon[]>(`/api/Coupon/campaign/${campaignId}`);
  },

  async getBySupplier(supplierId: string): Promise<ApiResponse<Coupon[]>> {
    return apiRequest<Coupon[]>(`/api/Coupon/supplier/${supplierId}`);
  },

  async validate(code: string): Promise<ApiResponse<Coupon>> {
    return apiRequest<Coupon>(`/api/Coupon/validate/${code}`);
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/Coupon/${id}`, {
      method: 'DELETE',
    });
  },
};
