<template>
  <div class="min-h-screen bg-[#fafafa] dark:bg-[#060818] p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-black dark:text-white">پروفایل کاربری</h1>
            <p class="text-white-dark mt-1">مشاهده و ویرایش اطلاعات شخصی</p>
          </div>
          <div class="flex items-center gap-4">
            <router-link to="/dashboard" class="btn btn-outline-primary">
              بازگشت به داشبورد
            </router-link>
          </div>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="panel mb-6">
        <div class="flex items-center gap-6 mb-6">
          <div class="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary">
              <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/>
              <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-black dark:text-white">
              {{ authStore.user?.fullName || 'کاربر سیستم' }}
            </h2>
            <p class="text-white-dark">{{ authStore.user?.phone }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="badge" :class="{
                'bg-success': authStore.user?.role === 'Admin',
                'bg-primary': authStore.user?.role === 'Agent',
                'bg-secondary': authStore.user?.role === 'User'
              }">
                {{ getRoleText(authStore.user?.role) }}
              </span>
              <span class="badge" :class="{
                'bg-warning': authStore.user?.level === 'Gold',
                'bg-info': authStore.user?.level === 'Silver',
                'bg-dark': authStore.user?.level === 'Bronze'
              }">
                {{ getLevelText(authStore.user?.level) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="panel">
          <h3 class="text-xl font-semibold text-black dark:text-white mb-6">اطلاعات شخصی</h3>
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-white-dark">شناسه کاربری</label>
              <div class="form-input bg-white-light/20 dark:bg-[#1a2941]/40 cursor-not-allowed">
                {{ authStore.user?.id }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white-dark">شماره موبایل</label>
              <div class="form-input bg-white-light/20 dark:bg-[#1a2941]/40 cursor-not-allowed">
                {{ authStore.user?.phone }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white-dark">نام کامل</label>
              <div class="form-input bg-white-light/20 dark:bg-[#1a2941]/40 cursor-not-allowed">
                {{ authStore.user?.fullName || 'تعریف نشده' }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white-dark">نقش کاربری</label>
              <div class="form-input bg-white-light/20 dark:bg-[#1a2941]/40 cursor-not-allowed">
                {{ getRoleText(authStore.user?.role) }}
              </div>
            </div>
            
            <div class="flex flex-col gap-2">
              <label class="text-white-dark">سطح کاربری</label>
              <div class="form-input bg-white-light/20 dark:bg-[#1a2941]/40 cursor-not-allowed">
                {{ getLevelText(authStore.user?.level) }}
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h3 class="text-xl font-semibold text-black dark:text-white mb-6">عملیات حساب کاربری</h3>
          <div class="space-y-4">
            <div class="p-4 bg-info/10 border border-info rounded-md">
              <h4 class="font-semibold text-info mb-2">تست اتصال API</h4>
              <p class="text-sm text-white-dark mb-3">بررسی وضعیت اتصال به سرور</p>
              <button 
                @click="testApiConnection" 
                class="btn btn-outline-info btn-sm"
                :disabled="isTestingApi"
              >
                <span v-if="isTestingApi">در حال بررسی...</span>
                <span v-else>تست اتصال</span>
              </button>
            </div>

            <div v-if="authStore.isAdmin" class="p-4 bg-warning/10 border border-warning rounded-md">
              <h4 class="font-semibold text-warning mb-2">دسترسی مدیریت</h4>
              <p class="text-sm text-white-dark mb-3">تست دسترسی‌های مدیریتی</p>
              <router-link to="/admin-test" class="btn btn-outline-warning btn-sm">
                تست دسترسی ادمین
              </router-link>
            </div>

            <div class="p-4 bg-danger/10 border border-danger rounded-md">
              <h4 class="font-semibold text-danger mb-2">خروج از حساب</h4>
              <p class="text-sm text-white-dark mb-3">خروج از حساب کاربری فعلی</p>
              <button 
                @click="handleLogout" 
                class="btn btn-outline-danger btn-sm"
              >
                خروج از حساب
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div v-if="apiStatus" class="panel mt-6">
        <h3 class="text-xl font-semibold text-black dark:text-white mb-4">وضعیت API</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center justify-between p-3 bg-white-light/20 dark:bg-[#1a2941]/40 rounded-md">
            <span class="text-white-dark">وضعیت سرویس:</span>
            <span class="font-semibold text-success">{{ apiStatus.status }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white-light/20 dark:bg-[#1a2941]/40 rounded-md">
            <span class="text-white-dark">نام سرویس:</span>
            <span class="font-semibold text-black dark:text-white">{{ apiStatus.service }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-white-light/20 dark:bg-[#1a2941]/40 rounded-md">
            <span class="text-white-dark">زمان آخرین بررسی:</span>
            <span class="font-semibold text-black dark:text-white text-sm">{{ formatDate(apiStatus.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService from '@/services/api'
import type { UserRole, UserLevel, HealthResponse } from '@/types/api'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const isTestingApi = ref(false)
const apiStatus = ref<HealthResponse | null>(null)

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

const testApiConnection = async () => {
  try {
    isTestingApi.value = true
    const response = await apiService.healthCheck()
    apiStatus.value = response
    
    Swal.fire({
      title: 'موفق!',
      text: 'اتصال به API برقرار است',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  } catch (error) {
    console.error('API test failed:', error)
    Swal.fire({
      title: 'خطا!',
      text: 'خطا در اتصال به API',
      icon: 'error'
    })
  } finally {
    isTestingApi.value = false
  }
}

const handleLogout = async () => {
  const result = await Swal.fire({
    title: 'خروج از حساب کاربری',
    text: 'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'بله، خروج',
    cancelButtonText: 'انصراف',
    confirmButtonColor: '#e7515a',
    cancelButtonColor: '#6c757d'
  })

  if (result.isConfirmed) {
    await authStore.logout()
    router.push('/auth/login')
  }
}
</script>