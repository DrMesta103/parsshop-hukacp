<template>
  <header class="z-40">
    <div class="shadow-sm">
      <div class="relative flex w-full items-center gap-3 bg-white px-4 py-3 dark:bg-[#0e1726] sm:px-5">
        <button
          type="button"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white-light/60 hover:bg-white-light dark:bg-dark/40 dark:hover:bg-dark/60"
          @click="appStore.toggleSidebar()"
        >
          <IconMenu class="h-5 w-5" />
        </button>

        <div class="min-w-0 flex-1 text-right">
          <p class="truncate text-sm text-white-dark">پنل مدیریت</p>
          <h1 class="truncate text-base font-semibold text-black dark:text-white sm:text-lg">پنل مدیریت هوکا</h1>
        </div>

        <button
          type="button"
          class="rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 dark:bg-dark/40 dark:hover:bg-dark/60"
          @click="toggleTheme"
        >
          <IconSun v-if="appStore.theme === 'light'" class="h-5 w-5" />
          <IconMoon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import IconMenu from '@/components/icon/icon-menu.vue'
import IconSun from '@/components/icon/icon-sun.vue'
import IconMoon from '@/components/icon/icon-moon.vue'

const appStore = useAppStore()

const toggleTheme = () => {
  appStore.toggleTheme(appStore.theme === 'light' ? 'dark' : 'light')
}
</script>
