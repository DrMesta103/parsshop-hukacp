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
              <img src="/demo/public/assets/images/auth/login.svg" alt="Cover Image" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Right side with form -->
        <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-10">
              <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">ورود با پیامک</h1>
              <p class="text-base font-bold leading-normal text-white-dark">شماره موبایل خود را وارد کنید</p>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-danger/10 border border-danger rounded-md">
              <p class="text-danger text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Success message -->
            <div v-if="successMessage" class="mb-4 p-3 bg-success/10 border border-success rounded-md">
              <p class="text-success text-sm">{{ successMessage }}</p>
            </div>

            <form class="space-y-5 dark:text-white" @submit.prevent="handleRequestOtp">
              <div>
                <label for="phone">شماره موبایل</label>
                <div class="relative text-white-dark">
                  <input 
                    id="phone" 
                    v-model="form.phone"
                    @input="formatPhoneInput"
                    type="tel" 
                    placeholder="+989123456789" 
                    class="form-input ps-10 placeholder:text-white-dark"
                    :class="{ 'has-error': errors.phone }"
                    required
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 4H9L10.5 9L8.5 10.5C9.57096 12.6715 11.3285 14.429 13.5 15.5L15 13.5L20 15V19C20 19.5523 19.5523 20 19 20C10.1634 20 3 12.8366 3 4C3 3.44772 3.44772 3 4 3H5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
                <span v-if="errors.phone" class="text-danger text-xs">{{ errors.phone }}</span>
              </div>

              <div>
                <label for="fullName">نام و نام خانوادگی (اختیاری)</label>
                <div class="relative text-white-dark">
                  <input 
                    id="fullName" 
                    v-model="form.fullName"
                    type="text" 
                    placeholder="نام و نام خانوادگی" 
                    class="form-input ps-10 placeholder:text-white-dark"
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                :disabled="isLoading"
              >
                <span v-if="isLoading">در حال ارسال...</span>
                <span v-else>ارسال کد تایید</span>
              </button>
            </form>

            <div class="relative my-7 text-center md:mb-9">
              <span class="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
              <span class="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">یا</span>
            </div>

            <div class="text-center dark:text-white mb-6">
              <router-link to="/auth/login" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                ورود با نام کاربری و رمز عبور
              </router-link>
            </div>

            <div class="text-center dark:text-white">
              حساب کاربری ندارید؟
              <router-link to="/auth/register" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                ثبت نام
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api'
import Swal from 'sweetalert2'

const router = useRouter()

const form = reactive({
  phone: '',
  fullName: ''
})

const errors = reactive({
  phone: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// Phone input formatting
const formatPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value.replace(/\D/g, '') // Remove non-digits
  
  if (value.startsWith('98')) {
    value = '+' + value
  } else if (value.startsWith('0')) {
    value = '+98' + value.substring(1)
  } else if (!value.startsWith('+98') && value.length > 0) {
    value = '+98' + value
  }
  
  // Limit to 13 characters (+98xxxxxxxxxx)
  if (value.length > 13) {
    value = value.substring(0, 13)
  }
  
  form.phone = value
  target.value = value
}

const validateForm = () => {
  errors.phone = ''
  
  if (!form.phone.trim()) {
    errors.phone = 'شماره موبایل الزامی است'
    return false
  }
  
  // Check phone format
  const phoneRegex = /^\+?[1-9]\d{7,14}$/
  if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'فرمت شماره موبایل صحیح نیست'
    return false
  }
  
  return true
}

const handleRequestOtp = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true
    
    const cleanPhone = form.phone.replace(/\s/g, '')
    const response = await apiService.requestOtp({
      phone: cleanPhone,
      fullName: form.fullName.trim() || undefined
    })
    
    successMessage.value = response.message
    
    // Store phone for verification page
    sessionStorage.setItem('otpPhone', cleanPhone)
    if (form.fullName.trim()) {
      sessionStorage.setItem('otpFullName', form.fullName.trim())
    }
    
    Swal.fire({
      title: 'موفق!',
      text: `کد تایید به شماره ${cleanPhone} ارسال شد`,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    })
    
    // Redirect to verification page after 2 seconds
    setTimeout(() => {
      router.push('/auth/verify-otp')
    }, 2000)
    
  } catch (error: any) {
    console.error('OTP request error:', error)
    
    if (error.response?.status === 400) {
      errorMessage.value = 'شماره موبایل نامعتبر است'
    } else if (error.response?.status === 429) {
      errorMessage.value = 'تعداد درخواست‌ها زیاد است. لطفا کمی صبر کنید'
    } else {
      errorMessage.value = 'خطا در ارسال کد. لطفا دوباره تلاش کنید'
    }
  } finally {
    isLoading.value = false
  }
}
</script>