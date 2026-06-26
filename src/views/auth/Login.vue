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
              <img src="/assets/images/auth/admin-login-cover.png" alt="Cover Image" class="w-full rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>

        <!-- Right side with form -->
        <div class="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
          <div class="w-full max-w-[440px] lg:mt-16">
            <div class="mb-10">
              <h1 class="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">ورود</h1>
              <p class="text-base font-bold leading-normal text-white-dark">نام کاربری و رمز عبور خود را وارد کنید</p>
            </div>

            <!-- Error message -->
            <div v-if="errorMessage" class="mb-4 p-3 bg-danger/10 border border-danger rounded-md">
              <p class="text-danger text-sm">{{ errorMessage }}</p>
            </div>

            <form class="space-y-5 dark:text-white" @submit.prevent="handleLogin">
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

              <button 
                type="submit" 
                class="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
                :disabled="authStore.isLoading"
              >
                <span v-if="authStore.isLoading">در حال ورود...</span>
                <span v-else>ورود</span>
              </button>
            </form>

            <div class="relative my-7 text-center md:mb-9">
              <span class="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
              <span class="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">یا</span>
            </div>

            <div class="text-center dark:text-white mb-6">
              <router-link to="/auth/login-otp" class="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                ورود با کد یکبار مصرف
              </router-link>
            </div>

          </div>
          
          <p class="absolute bottom-6 w-full text-center dark:text-white">طراحی و توسعه اختصاصی این پنل با افتخار توسط <a href="https://hukaio.com" target="_blank" class="font-semibold text-primary hover:underline">گروه طراحی هوکا</a> انجام شده است.</p>
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
  username: '',
  password: ''
})

const errors = reactive({
  username: '',
  password: ''
})

const errorMessage = ref('')

const validateForm = () => {
  errors.username = ''
  errors.password = ''
  
  if (!form.username.trim()) {
    errors.username = 'نام کاربری الزامی است'
  }
  
  if (!form.password.trim()) {
    errors.password = 'رمز عبور الزامی است'
  }
  
  return !errors.username && !errors.password
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }

  try {
    await authStore.loginWithPassword(form.username, form.password)
    
    Swal.fire({
      title: 'موفق!',
      text: 'با موفقیت وارد شدید',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.response?.status === 401) {
      errorMessage.value = 'نام کاربری یا رمز عبور اشتباه است'
    } else if (error.response?.status === 400) {
      errorMessage.value = 'اطلاعات وارد شده نامعتبر است'
    } else {
      errorMessage.value = 'خطا در ورود. لطفا دوباره تلاش کنید'
    }
  }
}
</script>