import { apiRequest, ApiResponse, PaginationParams } from './config';
import { Product, CreateProductRequest, UpdateProductRequest } from './types';

export const productsApi = {
  async getAll(params: PaginationParams = {}): Promise<ApiResponse<Product[]>> {
    const { page = 1, pageSize = 20 } = params;
    return apiRequest<Product[]>(`/api/Product?page=${page}&pageSize=${pageSize}`);
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    return apiRequest<Product>(`/api/Product/${id}`);
  },

  async create(product: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiRequest<Product>('/api/Product', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async update(id: string, product: UpdateProductRequest): Promise<ApiResponse<Product>> {
    return apiRequest<Product>(`/api/Product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/Product/${id}`, {
      method: 'DELETE',
    });
  },

  async getBySupplier(supplierId: string): Promise<ApiResponse<Product[]>> {
    return apiRequest<Product[]>(`/api/Product/supplier/${supplierId}`);
  },

  async updateStock(id: string, stock: number): Promise<ApiResponse<Product>> {
    return apiRequest<Product>(`/api/Product/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },
};
