import { apiRequestDirect } from './config';
import { LoginRequest, User } from './types';

interface LoginResponseFromAPI {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  company?: string;
  university?: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<User> {
    const userData = await apiRequestDirect<LoginResponseFromAPI>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    localStorage.setItem('token', userData.token);
    
    // Map role from backend to frontend format
    const roleMap: Record<string, User['role']> = {
      student: 'estudiante',
      coordinator: 'empresa',
      admin: 'admin',
    };

    const user: User = {
      id: String(userData.userId),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`,
      role: roleMap[userData.role] || userData.role as User['role'],
      token: userData.token,
      company: userData.company,
      university: userData.university,
    };

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));

    return user;
  },

  async validateToken(token: string): Promise<boolean> {
    try {
      await apiRequestDirect<boolean>('/api/Auth/validate', {
        method: 'POST',
        body: JSON.stringify(token),
      });
      return true;
    } catch {
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
