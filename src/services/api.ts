import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { 
  ApiResponse, 
  AuthResponse, 
  OtpRequestPayload, 
  OtpRequestResponse,
  OtpVerifyPayload,
  RegisterPayload,
  LoginPayload,
  RefreshTokenPayload,
  AdminCheckResponse,
  HealthResponse
} from '@/types/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: '/api', // استفاده از proxy
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const response = await this.refreshToken({ refreshToken })
              const { accessToken, refreshToken: newRefreshToken } = response.data
              
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('refreshToken', newRefreshToken)
              
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
              return this.api(originalRequest)
            } catch (refreshError) {
              // Refresh failed, redirect to login
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              window.location.href = '/auth/login'
            }
          }
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Helper method to extract data from API response
  private extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
    return response.data.data
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(url, config)
    return this.extractData(response)
  }

  async post<T, B = unknown>(url: string, payload?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, payload, config)
    return this.extractData(response)
  }

  async patch<T, B = unknown>(url: string, payload?: B, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, payload, config)
    return this.extractData(response)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(url, config)
    return this.extractData(response)
  }

  async postForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    })
    return this.extractData(response)
  }

  async patchForm<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
    })
    return this.extractData(response)
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.api.get<ApiResponse<HealthResponse>>('/health')
    return this.extractData(response)
  }

  // Auth endpoints
  async requestOtp(payload: OtpRequestPayload): Promise<OtpRequestResponse> {
    const response = await this.api.post<ApiResponse<OtpRequestResponse>>('/auth/otp/request', payload)
    return this.extractData(response)
  }

  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', payload)
    return this.extractData(response)
  }

  async registerWithPassword(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register/password', payload)
    return this.extractData(response)
  }

  async loginWithPassword(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login/password', payload)
    return this.extractData(response)
  }

  async refreshToken(payload: RefreshTokenPayload): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/refresh', payload)
    return this.extractData(response)
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.api.post<ApiResponse<{ message: string }>>('/auth/logout')
    return this.extractData(response)
  }

  async adminCheck(): Promise<AdminCheckResponse> {
    const response = await this.api.get<ApiResponse<AdminCheckResponse>>('/auth/me/admin-check')
    return this.extractData(response)
  }
}

export const apiService = new ApiService()
export default apiService
