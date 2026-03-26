<template>
  <div>
    <div class="absolute inset-0">
      <img src="/demo/public/assets/images/auth/bg-gradient.png" alt="image" class="h-full w-full object-cover" />
    </div>
    <div class="relative flex min-h-screen items-center justify-center bg-[url(/demo/public/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
      <img src="/demo/public/assets/images/auth/coming-soon-object1.png" alt="image" class="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
      <img src="/demo/public/assets/images/auth/coming-soon-object2.png" alt="image" class="absolute left-24 top-0 h-40 md:left-[30%]" />
      <img src="/demo/public/assets/images/auth/coming-soon-object3.png" alt="image" class="absolute right-0 top-0 h-[300px]" />
      <img src="/demo/public/assets/images/auth/polygon-object.svg" alt="image" class="absolute bottom-0 end-[28%]" />
      
      <div class="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
        <!-- Left side with logo and image -->
        <div class="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
          <div class="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
          <div class="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
            <router-link to="/" class="w-48 block lg:w-72 ms-10">
              <img src="/demo/public/assets/images/auth/logo-white.svg" alt="Logo" class="w-full" />
            </router-link>
            <div class="mt-24 hidden w-full max-w-[430px] lg:block">
              <img src="/demo/public/assets/images/auth/unlock.svg" alt="Cover Image" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Right side with form -->
        <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-10">
              <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">تایید کد</h1>
              <p class="text-base font-bold leading-normal text-white-dark">
                کد تایید ارسال شده به شماره {{ maskedPhone }} را وارد کنید
              </p>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-danger/10 border border-danger rounded-md">
              <p class="text-danger text-sm">{{ errorMessage }}</p>
            </div>

            <form class="space-y-5 dark:text-white" @submit.prevent="handleVerifyOtp">
              <div>
                <label for="otp">کد تایید</label>
                <div class="relative text-white-dark">
                  <input 
                    id="otp" 
                    v-model="form.otp"
                    type="text" 
                    placeholder="کد 6 رقمی را وارد کنید" 
                    class="form-input ps-10 placeholder:text-white-dark text-center text-2xl tracking-widest"
                    :class="{ 'has-error': errors.otp }"
                    maxlength="6"
                    pattern="[0-9]{6}"
                    required
                    @input="handleOtpInput"
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </span>
                </div>
                <span v-if="errors.otp" class="text-danger text-xs">{{ errors.otp }}</span>
              </div>

              <!-- Countdown timer -->
              <div v-if="countdown > 0" class="text-center text-white-dark">
                <p>ارسال مجدد کد تا {{ countdown }} ثانیه دیگر</p>
              </div>

              <!-- Resend button -->
              <div v-else class="text-center">
                <button 
                  type="button" 
                  @click="handleResendOtp"
                  class="text-primary underline hover:text-primary-dark"
                  :disabled="isResending"
                >
                  <span v-if="isResending">در حال ارسال مجدد...</span>
                  <span v-else>ارسال مجدد کد</span>
                </button>
              </div>

              <button 
                type="submit" 
                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                :disabled="authStore.isLoading || form.otp.length !== 6"
              >
                <span v-if="authStore.isLoading">در حال تایید...</span>
                <span v-else>تایید و ورود</span>
              </button>
            </form>

            <div class="text-center dark:text-white mt-6">
              <router-link to="/auth/login-otp" class="text-primary underline transition hover:text-black dark:hover:text-white">
                بازگشت به صفحه ورود
              </router-link>
            </div>
          </div>
          
          <p class="absolute bottom-6 w-full text-center dark:text-white">© {{ new Date().getFullYear() }} ParsShop. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService from '@/services/api'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  otp: ''
})

const errors = reactive({
  otp: ''
})

const errorMessage = ref('')
const countdown = ref(120) // 2 minutes
const isResending = ref(false)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const phone = ref(sessionStorage.getItem('otpPhone') || '')
const fullName = ref(sessionStorage.getItem('otpFullName') || '')

// Mask phone number for display
const maskedPhone = computed(() => {
  if (!phone.value) return ''
  const cleanPhone = phone.value.replace(/\D/g, '')
  if (cleanPhone.length >= 10) {
    return cleanPhone.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, '$1***$3$4')
  }
  return phone.value
})

const startCountdown = () => {
  countdown.value = 120
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
    }
  }, 1000)
}

const validateForm = () => {
  errors.otp = ''
  
  if (!form.otp.trim()) {
    errors.otp = 'کد تایید الزامی است'
    return false
  }
  
  if (form.otp.length !== 6) {
    errors.otp = 'کد تایید باید 6 رقم باشد'
    return false
  }
  
  if (!/^\d{6}$/.test(form.otp)) {
    errors.otp = 'کد تایید باید فقط شامل اعداد باشد'
    return false
  }
  
  return true
}

const handleOtpInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  // Only allow numbers
  target.value = target.value.replace(/\D/g, '')
  form.otp = target.value
}

const handleVerifyOtp = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  if (!phone.value) {
    errorMessage.value = 'شماره موبایل یافت نشد. لطفا دوباره درخواست کد دهید'
    router.push('/auth/login-otp')
    return
  }

  try {
    await authStore.loginWithOtp(phone.value, form.otp)
    
    // Clear session storage
    sessionStorage.removeItem('otpPhone')
    sessionStorage.removeItem('otpFullName')
    
    Swal.fire({
      title: 'موفق!',
      text: 'با موفقیت وارد شدید',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('OTP verification error:', error)
    
    if (error.response?.status === 400) {
      errorMessage.value = 'کد تایید نامعتبر یا منقضی شده است'
    } else if (error.response?.status === 404) {
      errorMessage.value = 'کد تایید یافت نشد. لطفا دوباره درخواست دهید'
    } else {
      errorMessage.value = 'خطا در تایید کد. لطفا دوباره تلاش کنید'
    }
  }
}

const handleResendOtp = async () => {
  if (!phone.value) {
    router.push('/auth/login-otp')
    return
  }

  try {
    isResending.value = true
    
    await apiService.requestOtp({
      phone: phone.value,
      fullName: fullName.value || undefined
    })
    
    startCountdown()
    
    Swal.fire({
      title: 'موفق!',
      text: 'کد تایید مجدد ارسال شد',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    errorMessage.value = 'خطا در ارسال مجدد کد. لطفا دوباره تلاش کنید'
  } finally {
    isResending.value = false
  }
}

onMounted(() => {
  // Redirect if no phone number
  if (!phone.value) {
    router.push('/auth/login-otp')
    return
  }
  
  // Start countdown
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
