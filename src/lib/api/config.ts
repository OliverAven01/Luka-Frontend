// API Configuration for Lukitas Backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5140';

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Función para hacer peticiones directas (respuesta sin envolver)
export async function apiRequestDirect<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || data.title || 'Error en la solicitud',
      response.status,
      data
    );
  }

  return data;
}

// Función para peticiones con respuesta envuelta en { success, data }
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || data.title || 'Error en la solicitud',
      response.status,
      data
    );
  }

  // Si la respuesta ya tiene el formato { success, data }, devolverla
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    return data;
  }

  // Si no, envolverla
  return {
    success: true,
    data: data as T,
  };
}
