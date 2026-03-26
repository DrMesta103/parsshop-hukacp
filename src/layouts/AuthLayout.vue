<template>
  <div class="text-black dark:text-white-dark min-h-screen">
    <!-- Loading spinner -->
    <div
      v-show="isLoading"
      class="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center"
    >
      <svg width="64" height="64" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#4361ee">
        <path
          d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 67 67" 
            to="-360 67 67" 
            dur="2.5s" 
            repeatCount="indefinite" 
          />
        </path>
      </svg>
    </div>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoading = ref(true)

onMounted(() => {
  // Hide loading after a short delay
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>