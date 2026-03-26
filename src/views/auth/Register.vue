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
              <img src="/demo/public/assets/images/auth/register.svg" alt="Cover Image" class="w-full" />
            </div>
          </div>
        </div>

        <!-- Right side with form -->
        <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-10">
              <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">ثبت نام</h1>
              <p class="text-base font-bold leading-normal text-white-dark">حساب کاربری جدید ایجاد کنید</p>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-danger/10 border border-danger rounded-md">
              <p class="text-danger text-sm">{{ errorMessage }}</p>
            </div>

            <form class="space-y-5 dark:text-white" @submit.prevent="handleRegister">
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
                <label for="username">نام کاربری</label>
                <div class="relative text-white-dark">
                  <input 
                    id="username" 
                    v-model="form.username"
                    type="text" 
                    placeholder="نام کاربری را وارد کنید" 
                    class="form-input ps-10 placeholder:text-white-dark"
                    :class="{ 'has-error': errors.username }"
                    required
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="6" r="4" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                  </span>
                </div>
                <span v-if="errors.username" class="text-danger text-xs">{{ errors.username }}</span>
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
                      <path d="M20 7L9 18L4 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div>
                <label for="password">رمز عبور</label>
                <div class="relative text-white-dark">
                  <input 
                    id="password" 
                    v-model="form.password"
                    type="password" 
                    placeholder="رمز عبور را وارد کنید" 
                    class="form-input ps-10 placeholder:text-white-dark"
                    :class="{ 'has-error': errors.password }"
                    required
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z" stroke="currentColor" stroke-width="1.5"/>
                      <circle cx="12" cy="16" r="2" stroke="currentColor" stroke-width="1.5"/>
                      <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </span>
                </div>
                <span v-if="errors.password" class="text-danger text-xs">{{ errors.password }}</span>
              </div>

              <div>
                <label for="confirmPassword">تکرار رمز عبور</label>
                <div class="relative text-white-dark">
                  <input 
                    id="confirmPassword" 
                    v-model="form.confirmPassword"
                    type="password" 
                    placeholder="رمز عبور را دوباره وارد کنید" 
                    class="form-input ps-10 placeholder:text-white-dark"
                    :class="{ 'has-error': errors.confirmPassword }"
                    required
                  />
                  <span class="absolute start-4 top-1/2 -translate-y-1/2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </span>
                </div>
                <span v-if="errors.confirmPassword" class="text-danger text-xs">{{ errors.confirmPassword }}</span>
              </div>

              <button 
                type="submit" 
                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading">در حال ثبت نام...</span>
                <span v-else>ثبت نام</span>
              </button>
            </form>

            <div class="text-center dark:text-white mt-6">
              قبلا ثبت نام کرده‌اید؟
              <router-link to="/auth/login" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                ورود
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
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  phone: '',
  username: '',
  fullName: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  phone: '',
  username: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')

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
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  // Phone validation
  if (!form.phone.trim()) {
    errors.phone = 'شماره موبایل الزامی است'
    isValid = false
  } else {
    const phoneRegex = /^\+?[1-9]\d{7,14}$/
    if (!phoneRegex.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = 'فرمت شماره موبایل صحیح نیست'
      isValid = false
    }
  }
  
  // Username validation
  if (!form.username.trim()) {
    errors.username = 'نام کاربری الزامی است'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'نام کاربری باید حداقل 3 کاراکتر باشد'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و _ باشد'
    isValid = false
  }
  
  // Password validation
  if (!form.password.trim()) {
    errors.password = 'رمز عبور الزامی است'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'رمز عبور باید حداقل 6 کاراکتر باشد'
    isValid = false
  }
  
  // Confirm password validation
  if (!form.confirmPassword.trim()) {
    errors.confirmPassword = 'تکرار رمز عبور الزامی است'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  try {
    const cleanPhone = form.phone.replace(/\s/g, '')
    
    await authStore.register({
      phone: cleanPhone,
      username: form.username.trim(),
      password: form.password,
      fullName: form.fullName.trim() || undefined
    })
    
    Swal.fire({
      title: 'موفق!',
      text: 'ثبت نام با موفقیت انجام شد',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.response?.status === 400) {
      const errorData = error.response.data
      if (errorData.message?.includes('username')) {
        errorMessage.value = 'این نام کاربری قبلا استفاده شده است'
      } else if (errorData.message?.includes('phone')) {
        errorMessage.value = 'این شماره موبایل قبلا ثبت شده است'
      } else {
        errorMessage.value = 'اطلاعات وارد شده نامعتبر است'
      }
    } else if (error.response?.status === 409) {
      errorMessage.value = 'کاربری با این مشخصات قبلا ثبت شده است'
    } else {
      errorMessage.value = 'خطا در ثبت نام. لطفا دوباره تلاش کنید'
    }
  }
}
</script>