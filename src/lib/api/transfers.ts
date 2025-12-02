import { apiRequest, ApiResponse } from './config';
import { Transfer, CreateTransferRequest } from './types';

export const transfersApi = {
  async create(transfer: CreateTransferRequest): Promise<ApiResponse<Transfer>> {
    return apiRequest<Transfer>('/api/Transfer', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
  },

  async getByAccount(accountId: string): Promise<ApiResponse<Transfer[]>> {
    return apiRequest<Transfer[]>(`/api/Transfer/account/${accountId}`);
  },

  async getById(id: string): Promise<ApiResponse<Transfer>> {
    return apiRequest<Transfer>(`/api/Transfer/${id}`);
  },
};
