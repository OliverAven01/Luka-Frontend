import { apiRequest, ApiResponse, PaginationParams } from './config';
import { Supplier, CreateSupplierRequest } from './types';

export const suppliersApi = {
  async getAll(params: PaginationParams = {}): Promise<ApiResponse<Supplier[]>> {
    const { page = 1, pageSize = 20 } = params;
    return apiRequest<Supplier[]>(`/api/SupplierManagement?page=${page}&pageSize=${pageSize}`);
  },

  async getById(id: string): Promise<ApiResponse<Supplier>> {
    return apiRequest<Supplier>(`/api/SupplierManagement/${id}`);
  },

  async create(supplier: CreateSupplierRequest): Promise<ApiResponse<Supplier>> {
    return apiRequest<Supplier>('/api/SupplierManagement', {
      method: 'POST',
      body: JSON.stringify(supplier),
    });
  },

  async update(id: string, supplier: CreateSupplierRequest): Promise<ApiResponse<Supplier>> {
    return apiRequest<Supplier>(`/api/SupplierManagement/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplier),
    });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/SupplierManagement/${id}`, {
      method: 'DELETE',
    });
  },
};
