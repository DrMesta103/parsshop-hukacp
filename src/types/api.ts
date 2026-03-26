// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  path: string
  timestamp: string
  data: T
}

// User types
export type UserRole = 'Admin' | 'User' | 'Agent'
export type UserLevel = 'Bronze' | 'Silver' | 'Gold'

export interface User {
  id: string
  phone: string
  fullName: string
  role: UserRole
  level: UserLevel
}

// Auth types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface OtpRequestPayload {
  phone: string
  fullName?: string
}

export interface OtpRequestResponse {
  message: string
  expiresInSeconds: number
  phone: string
  smsSent: boolean
  otpPreview?: string
}

export interface OtpVerifyPayload {
  phone: string
  otp: string
}

export interface RegisterPayload {
  phone: string
  username: string
  password: string
  fullName?: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface RefreshTokenPayload {
  refreshToken: string
}

export interface AdminCheckResponse {
  user: {
    sub: string
    phone: string
    role: UserRole
    level: UserLevel
    permissions: string[]
    type: string
  }
  authorized: boolean
}

export interface HealthResponse {
  status: string
  service: string
  timestamp: string
}

// Admin Panel API Types
export interface UserProfile {
  id: string
  phone: string
  username?: string
  fullName?: string
  role: UserRole
  level: UserLevel
  permissions?: string[]
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalRevenue: number
  activeUsers: number
}

export interface AdminUser {
  id: string
  phone: string
  username?: string
  fullName?: string
  role: UserRole
  level: UserLevel
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiErrorResponse {
  success?: boolean
  statusCode?: number
  message?: string | string[]
  error?: string
}
