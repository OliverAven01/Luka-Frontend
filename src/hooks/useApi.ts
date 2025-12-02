import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  campaignsApi,
  studentsApi,
  transfersApi,
  missionsApi,
  adminApi,
  LoginRequest,
  CreateCampaignRequest,
  EnrollCampaignRequest,
  CreateTransferRequest,
  PaginationParams,
} from '@/lib/api';

// ============ AUTH HOOKS ============
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// ============ CAMPAIGN HOOKS ============
export const useActiveCampaigns = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['campaigns', 'active', params],
    queryFn: () => campaignsApi.getActive(params),
  });
};

export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignsApi.getById(id),
    enabled: !!id,
  });
};

export const useCompanyCampaigns = (companyUserId: string) => {
  return useQuery({
    queryKey: ['campaigns', 'company', companyUserId],
    queryFn: () => campaignsApi.getByCompany(companyUserId),
    enabled: !!companyUserId,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};


export const useEnrollCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: EnrollCampaignRequest) => campaignsApi.enroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};

// ============ STUDENT HOOKS ============
export const useStudentBalance = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'balance'],
    queryFn: () => studentsApi.getBalance(studentId),
    enabled: !!studentId,
  });
};

export const useStudentCampaigns = (studentId: string) => {
  return useQuery({
    queryKey: ['student', studentId, 'campaigns'],
    queryFn: () => studentsApi.getCampaigns(studentId),
    enabled: !!studentId,
  });
};

// ============ TRANSFER HOOKS ============
export const useAccountTransfers = (accountId: string) => {
  return useQuery({
    queryKey: ['transfers', accountId],
    queryFn: () => transfersApi.getByAccount(accountId),
    enabled: !!accountId,
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTransferRequest) => transfersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};

// ============ MISSION HOOKS ============
export const useUserMissions = (userId: string) => {
  return useQuery({
    queryKey: ['missions', userId],
    queryFn: () => missionsApi.getByUser(userId),
    enabled: !!userId,
  });
};

export const usePendingMissions = (userId: string) => {
  return useQuery({
    queryKey: ['missions', userId, 'pending'],
    queryFn: () => missionsApi.getPending(userId),
    enabled: !!userId,
  });
};

// ============ ADMIN HOOKS ============
export const useAdminStatistics = () => {
  return useQuery({
    queryKey: ['admin', 'statistics'],
    queryFn: () => adminApi.getStatistics(),
  });
};

export const usePendingCompanies = () => {
  return useQuery({
    queryKey: ['admin', 'companies', 'pending'],
    queryFn: () => adminApi.getPendingCompanies(),
  });
};

export const useApproveCompany = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: adminApi.approveCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'companies'] });
    },
  });
};
