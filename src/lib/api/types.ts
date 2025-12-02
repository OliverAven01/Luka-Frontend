// ============ AUTH TYPES ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'coordinator' | 'admin' | 'empresa';
  token: string;
  company?: string;
  university?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: 'student' | 'coordinator' | 'admin' | 'empresa' | 'estudiante';
  token?: string;
  company?: string;
  university?: string;
  lukaPoints?: number;
}

// ============ CAMPAIGN TYPES ============
export interface Campaign {
  id: string;
  name: string;
  description: string;
  campaignType: string;
  budget: number;
  startDate: string;
  endDate: string;
  schedule?: string;
  location?: string;
  contactNumber?: string;
  imageUrls?: string[];
  participants?: number;
  status?: string;
  companyName?: string;
}

export interface CreateCampaignRequest {
  name: string;
  description: string;
  campaignType: string;
  budget: number;
  startDate: string;
  endDate: string;
  schedule?: string;
  location?: string;
  contactNumber?: string;
  imageUrls?: string[];
}

export interface EnrollCampaignRequest {
  campaignId: string;
  studentId: string;
}

// ============ PRODUCT TYPES ============
export interface Product {
  id: string;
  supplierId: string;
  productTypeId: string;
  code: string;
  name: string;
  price: number;
  stock: number;
  status?: string;
}

export interface CreateProductRequest {
  supplierId: string;
  productTypeId: string;
  code: string;
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name: string;
  price: number;
  stock: number;
  status: string;
}

// ============ SUPPLIER TYPES ============
export interface Supplier {
  id: string;
  supplierTypeId: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateSupplierRequest {
  supplierTypeId: string;
  name: string;
  email: string;
  phone: string;
}


// ============ STUDENT TYPES ============
export interface StudentBalance {
  balance: number;
  accountNumber?: string;
}

export interface PurchaseItem {
  productId: string;
  quantity: number;
}

export interface PurchaseRequest {
  studentId: string;
  supplierId: string;
  items: PurchaseItem[];
}

// ============ TRANSFER TYPES ============
export interface Transfer {
  id: number;
  sourceAccountId: number;
  destinationAccountId: number;
  amount: number;
  transferDate?: string;
  createdAt?: string;
  status?: string;
}

export interface CreateTransferRequest {
  sourceAccountId: number;
  destinationAccountId: number;
  amount: number;
}

// ============ MISSION TYPES ============
export interface Mission {
  id: string;
  name: string;
  description: string;
  reward: number;
  status?: string;
}

export interface UserMission {
  id: string;
  missionId: string;
  userId: string;
  status: 'pending' | 'completed';
  completedAt?: string;
  mission?: Mission;
}

export interface AssignMissionRequest {
  userId: string;
  missionId: string;
}

export interface CompleteMissionRequest {
  userMissionId: string;
  saleId?: string;
}

// ============ COUPON TYPES ============
export interface Coupon {
  id: string;
  campaignId: string;
  supplierId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: string;
  isValid?: boolean;
}

export interface CreateCouponRequest {
  campaignId: string;
  supplierId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: string;
}

// ============ ADMIN TYPES ============
export interface PendingCompany {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

export interface ApproveCompanyRequest {
  companyId: string;
  approved: boolean;
  reason?: string;
}

export interface AdminStatistics {
  totalUsers: number;
  totalStudents: number;
  totalCompanies: number;
  totalSuppliers: number;
  activeCampaigns: number;
  totalLukasInCirculation: number;
  totalLukasSpent: number;
  totalTransactions: number;
  recentActivity?: unknown[];
  // Legacy fields for compatibility
  totalCampaigns?: number;
  totalLukasDistributed?: number;
  activeCompanies?: number;
}

export interface EmitLukasRequest {
  companyId: string;
  amount: number;
  reason: string;
}

export interface LukasValue {
  lukasToUsdRate: number;
}

// ============ TRANSACTION TYPES ============
export interface Transaction {
  id: string;
  fromEmail?: string;
  toEmail?: string;
  amount: number;
  status: string;
  transactionType: string;
  createdAt: string;
}
