import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserProfile } from '@/types/api'
import apiService from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const userProfile = ref<UserProfile | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')
  const hasAdminAccess = computed(() => isAuthenticated.value && isAdmin.value)

  const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const clearAuth = () => {
    user.value = null
    userProfile.value = null
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  // After login, fetch user info from admin-check endpoint
  const fetchCurrentUser = async (): Promise<User | null> => {
    if (!accessToken.value) return null
    try {
      const res = await apiService.adminCheck()
      const u: User = {
        id: res.user.sub,
        phone: res.user.phone,
        fullName: '',
        role: res.user.role,
        level: res.user.level
      }
      setUser(u)
      return u
    } catch (err: any) {
      if (err.response?.status === 401) clearAuth()
      return null
    }
  }

  // Verify admin access with backend - returns true/false
  const verifyAdminAccess = async (): Promise<boolean> => {
    if (!accessToken.value) return false
    try {
      const res = await apiService.adminCheck()
      return res.authorized === true && res.user?.role === 'Admin'
    } catch (err: any) {
      if (err.response?.status === 401) clearAuth()
      return false
    }
  }

  const loginWithOtp = async (phone: string, otp: string) => {
    isLoading.value = true
    try {
      const res = await apiService.verifyOtp({ phone, otp })
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
      setUser(res.user)
      return res
    } catch (err) {
      clearAuth()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithPassword = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const res = await apiService.loginWithPassword({ username, password })
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
      setUser(res.user)
      return res
    } catch (err) {
      clearAuth()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: { phone: string; username: string; password: string; fullName?: string }) => {
    isLoading.value = true
    try {
      const res = await apiService.registerWithPassword(payload)
      setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken })
      setUser(res.user)
      return res
    } catch (err) {
      clearAuth()
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      if (accessToken.value) await apiService.logout()
    } catch {
      // ignore
    } finally {
      clearAuth()
    }
  }

  // Called on app start if token exists in localStorage
  const initializeAuth = async () => {
    if (!accessToken.value || user.value) return
    try {
      await fetchCurrentUser()
    } catch {
      // Silently fail - don't clear auth on network errors
    }
  }

  return {
    user, userProfile, accessToken, refreshToken, isLoading,
    isAuthenticated, isAdmin, hasAdminAccess,
    setTokens, setUser, clearAuth,
    fetchCurrentUser, verifyAdminAccess,
    loginWithOtp, loginWithPassword, register, logout, initializeAuth
  }
})