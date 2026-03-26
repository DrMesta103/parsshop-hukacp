<template>
  <div class="relative main-section antialiased text-sm font-normal" :class="[appStore.sidebar ? 'toggle-sidebar' : '', appStore.menu, appStore.layout, appStore.rtlClass]">
    <!-- sidebar menu overlay -->
    <div 
      class="fixed inset-0 bg-[black]/60 z-50 lg:hidden" 
      :class="{ hidden: !appStore.sidebar }" 
      @click="appStore.toggleSidebar()"
    ></div>

    <!-- screen loader -->
    <div
      v-show="appStore.isShowMainLoader"
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

    <!-- scroll to top button -->
    <div class="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
      <button
        v-if="showTopButton"
        type="button"
        class="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary"
        @click="goToTop"
      >
        <svg width="24" height="24" class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.5"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 20.75C12.4142 20.75 12.75 20.4142 12.75 20L12.75 10.75L11.25 10.75L11.25 20C11.25 20.4142 11.5858 20.75 12 20.75Z"
            fill="currentColor"
          />
          <path
            d="M6.00002 10.75C5.69667 10.75 5.4232 10.5673 5.30711 10.287C5.19103 10.0068 5.25519 9.68417 5.46969 9.46967L11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25C12.1989 3.25 12.3897 3.32902 12.5304 3.46967L18.5304 9.46967C18.7449 9.68417 18.809 10.0068 18.6929 10.287C18.5768 10.5673 18.3034 10.75 18 10.75L6.00002 10.75Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>

    <div class="main-container min-h-screen text-black dark:text-white-dark" :class="[appStore.navbar]">
      <!-- BEGIN SIDEBAR -->
      <Sidebar />
      <!-- END SIDEBAR -->

      <div class="main-content flex min-h-screen flex-col">
        <!-- BEGIN TOP NAVBAR -->
        <Header />
        <!-- END TOP NAVBAR -->

        <!-- BEGIN CONTENT AREA -->
        <div class="p-6 animation">
          <router-view />
        </div>
        <!-- END CONTENT AREA -->

        <!-- BEGIN FOOTER -->
        <Footer />
        <!-- END FOOTER -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const appStore = useAppStore()
const showTopButton = ref(false)

const handleScroll = () => {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    showTopButton.value = true
  } else {
    showTopButton.value = false
  }
}

const goToTop = () => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  const eleAnimation = document.querySelector('.animation')
  if (eleAnimation) {
    eleAnimation.addEventListener('animationend', () => {
      eleAnimation.classList.remove('animate__animated', appStore.animation)
    })
  }
  
  appStore.toggleMainLoader()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
