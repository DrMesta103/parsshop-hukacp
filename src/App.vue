<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  // Only initialize if token exists - don't block rendering
  if (authStore.accessToken) {
    try {
      await authStore.initializeAuth()
    } catch {
      // Silently fail - router guards will handle redirects
    }
  }
})
</script>