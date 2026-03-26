<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#060818] p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-black dark:text-white">تست دسترسی مدیریت</h1>
            <p class="text-white-dark mt-1">بررسی دسترسی‌های مدیریتی و مجوزها</p>
          </div>
          <div class="flex items-center gap-4">
            <router-link to="/dashboard" class="btn btn-outline-primary">
              بازگشت به داشبورد
            </router-link>
          </div>
        </div>
      </div>

      <!-- Admin Check Result -->
      <div v-if="adminCheckResult" class="panel mb-6">
        <h3 class="text-xl font-semibold text-black dark:text-white mb-4">نتیجه بررسی دسترسی</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-black dark:text-white mb-3">اطلاعات کاربری</h4>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded">
                <span class="text-white-dark">شناسه:</span>
                <span class="font-semibold text-black dark:text-white">{{ adminCheckResult.user.sub }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded">
                <span class="text-white-dark">شماره موبایل:</span>
                <span class="font-semibold text-black dark:text-white">{{ adminCheckResult.user.phone }}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded">
                <span class="text-white-dark">نقش:</span>
                <span class="badge" :class="{
                  'bg-success': adminCheckResult.user.role === 'Admin',
                  'bg-primary': adminCheckResult.user.role === 'Agent',
                  'bg-secondary': adminCheckResult.user.role === 'User'
                }">
                  {{ getRoleText(adminCheckResult.user.role) }}
                </span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded">
                <span class="text-white-dark">سطح:</span>
                <span class="badge" :class="{
                  'bg-warning': adminCheckResult.user.level === 'Gold',
                  'bg-info': adminCheckResult.user.level === 'Silver',
                  'bg-dark': adminCheckResult.user.level === 'Bronze'
                }">
                  {{ getLevelText(adminCheckResult.user.level) }}
                </span>
              </div>
              <div class="flex items-center justify-between p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded">
                <span class="text-white-dark">نوع توکن:</span>
                <span class="font-semibold text-black dark:text-white">{{ adminCheckResult.user.type }}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-semibold text-black dark:text-white mb-3">وضعیت دسترسی</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 rounded" :class="{
                'bg-success/10 border border-success': adminCheckResult.authorized,
                'bg-danger/10 border border-danger': !adminCheckResult.authorized
              }">
                <span class="font-semibold">دسترسی مجاز:</span>
                <div class="flex items-center gap-2">
                  <span :class="{
                    'text-success': adminCheckResult.authorized,
                    'text-danger': !adminCheckResult.authorized
                  }">
                    {{ adminCheckResult.authorized ? 'بله' : 'خیر' }}
                  </span>
                  <svg v-if="adminCheckResult.authorized" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-success">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-danger">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>

              <div>
                <h5 class="font-semibold text-black dark:text-white mb-2">مجوزها:</h5>
                <div v-if="adminCheckResult.user.permissions.length > 0" class="space-y-1">
                  <div 
                    v-for="permission in adminCheckResult.user.permissions" 
                    :key="permission"
                    class="flex items-center gap-2 p-2 bg-primary/10 border border-primary rounded text-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span class="text-primary font-medium">{{ permission }}</span>
                  </div>
                </div>
                <div v-else class="p-2 bg-white-light/20 dark:bg-[#1a2941]/40 rounded text-sm text-white-dark">
                  هیچ مجوز خاصی تعریف نشده
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Test Actions -->
      <div class="panel">
        <h3 class="text-xl font-semibold text-black dark:text-white mb-6">عملیات تست</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            @click="runAdminCheck" 
            class="btn btn-primary"
            :disabled="isLoading"
          >
            <span v-if="isLoading">در حال بررسی...</span>
            <span v-else>بررسی دسترسی مدیریت</span>
          </button>

          <button 
            @click="testHealthCheck" 
            class="btn btn-outline-info"
            :disabled="isTestingHealth"
          >
            <span v-if="isTestingHealth">در حال تست...</span>
            <span v-else>تست سلامت API</span>
          </button>
        </div>

        <!-- Error Display -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-danger/10 border border-danger rounded-md">
          <h4 class="font-semibold text-danger mb-2">خطا در دسترسی</h4>
          <p class="text-danger text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Health Status -->
        <div v-if="healthStatus" class="mt-4 p-4 bg-success/10 border border-success rounded-md">
          <h4 class="font-semibold text-success mb-2">وضعیت سلامت API</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
            <div>
              <span class="text-white-dark">وضعیت:</span>
              <span class="font-semibold text-success ml-2">{{ healthStatus.status }}</span>
            </div>
            <div>
              <span class="text-white-dark">سرویس:</span>
              <span class="font-semibold text-black dark:text-white ml-2">{{ healthStatus.service }}</span>
            </div>
            <div>
              <span class="text-white-dark">زمان:</span>
              <span class="font-semibold text-black dark:text-white ml-2">{{ formatDate(healthStatus.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService from '@/services/api'
import type { UserRole, UserLevel, AdminCheckResponse, HealthResponse } from '@/types/api'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const isTestingHealth = ref(false)
const adminCheckResult = ref<AdminCheckResponse | null>(null)
const healthStatus = ref<HealthResponse | null>(null)
const errorMessage = ref('')

const getRoleText = (role?: UserRole) => {
  switch (role) {
    case 'Admin': return 'مدیر'
    case 'Agent': return 'نماینده'
    case 'User': return 'کاربر'
    default: return 'نامشخص'
  }
}

const getLevelText = (level?: UserLevel) => {
  switch (level) {
    case 'Gold': return 'طلایی'
    case 'Silver': return 'نقره‌ای'
    case 'Bronze': return 'برنزی'
    default: return 'نامشخص'
  }
}

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('fa-IR')
}

const runAdminCheck = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const result = await apiService.adminCheck()
    adminCheckResult.value = result
    
    if (result.authorized) {
      Swal.fire({
        title: 'موفق!',
        text: 'دسترسی مدیریت تایید شد',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      Swal.fire({
        title: 'عدم دسترسی',
        text: 'شما دسترسی مدیریت ندارید',
        icon: 'warning'
      })
    }
  } catch (error: any) {
    console.error('Admin check failed:', error)
    
    if (error.response?.status === 403) {
      errorMessage.value = 'عدم دسترسی: شما مجوز دسترسی به این بخش را ندارید'
    } else if (error.response?.status === 401) {
      errorMessage.value = 'خطای احراز هویت: لطفا دوباره وارد شوید'
    } else {
      errorMessage.value = 'خطا در بررسی دسترسی مدیریت'
    }
    
    Swal.fire({
      title: 'خطا!',
      text: errorMessage.value,
      icon: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const testHealthCheck = async () => {
  try {
    isTestingHealth.value = true
    const result = await apiService.healthCheck()
    healthStatus.value = result
    
    Swal.fire({
      title: 'موفق!',
      text: 'API سالم است و در دسترس می‌باشد',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('Health check failed:', error)
    Swal.fire({
      title: 'خطا!',
      text: 'خطا در تست سلامت API',
      icon: 'error'
    })
  } finally {
    isTestingHealth.value = false
  }
}

// Auto-run admin check on mount
onMounted(() => {
  runAdminCheck()
})
</script>