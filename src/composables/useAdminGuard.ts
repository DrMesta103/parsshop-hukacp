import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

export function useAdminGuard() {
  const router = useRouter()
  const authStore = useAuthStore()
  const isVerifying = ref(false)

  // Check if user has admin access
  const hasAdminAccess = computed(() => authStore.hasAdminAccess)

  // Verify admin access with backend
  const verifyAdminAccess = async (): Promise<boolean> => {
    if (!authStore.isAuthenticated) {
      await redirectToLogin()
      return false
    }

    try {
      isVerifying.value = true
      const hasAccess = await authStore.verifyAdminAccess()
      
      if (!hasAccess) {
        await showAccessDeniedMessage()
        await redirectToAccessDenied()
        return false
      }

      return true
    } catch (error: any) {
      console.error('Admin verification failed:', error)
      
      if (error.response?.status === 401) {
        await showSessionExpiredMessage()
        await redirectToLogin()
      } else if (error.response?.status === 403) {
        await showAccessDeniedMessage()
        await redirectToAccessDenied()
      } else {
        await showErrorMessage('خطا در بررسی دسترسی. لطفا دوباره تلاش کنید.')
      }
      
      return false
    } finally {
      isVerifying.value = false
    }
  }

  // Redirect functions
  const redirectToLogin = async () => {
    await router.push('/auth/login')
  }

  const redirectToAccessDenied = async () => {
    await router.push('/access-denied')
  }

  const redirectToDashboard = async () => {
    await router.push('/dashboard')
  }

  // Message functions
  const showAccessDeniedMessage = async () => {
    await Swal.fire({
      title: 'عدم دسترسی',
      text: 'شما دسترسی لازم برای ورود به پنل مدیریت را ندارید.',
      icon: 'warning',
      confirmButtonText: 'متوجه شدم',
      confirmButtonColor: '#e2a03f'
    })
  }

  const showSessionExpiredMessage = async () => {
    await Swal.fire({
      title: 'جلسه منقضی شده',
      text: 'جلسه کاری شما منقضی شده است. لطفا دوباره وارد شوید.',
      icon: 'info',
      confirmButtonText: 'ورود مجدد',
      confirmButtonColor: '#4361ee'
    })
  }

  const showErrorMessage = async (message: string) => {
    await Swal.fire({
      title: 'خطا',
      text: message,
      icon: 'error',
      confirmButtonText: 'تلاش مجدد',
      confirmButtonColor: '#e7515a'
    })
  }

  // Guard function for components
  const requireAdminAccess = async (): Promise<boolean> => {
    return await verifyAdminAccess()
  }

  // Guard function for route navigation
  const guardAdminRoute = async (): Promise<boolean> => {
    const hasAccess = await verifyAdminAccess()
    if (!hasAccess) {
      // Redirect is handled in verifyAdminAccess
      return false
    }
    return true
  }

  return {
    // State
    isVerifying,
    
    // Computed
    hasAdminAccess,
    
    // Methods
    verifyAdminAccess,
    requireAdminAccess,
    guardAdminRoute,
    redirectToLogin,
    redirectToAccessDenied,
    redirectToDashboard,
    showAccessDeniedMessage,
    showSessionExpiredMessage,
    showErrorMessage
  }
}