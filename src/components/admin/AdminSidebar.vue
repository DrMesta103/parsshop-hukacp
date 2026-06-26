<template>
  <div :class="{ 'dark text-white-dark': appStore.semidark }">
    <nav class="sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300">
      <div class="h-full">

        <!-- Logo -->
        <div class="flex justify-between items-center px-4 py-3">
          <router-link to="/admin/dashboard" class="main-logo flex items-center shrink-0">
            <span class="grid h-9 w-9 place-content-center rounded-xl bg-primary text-lg font-bold text-white">P</span>
            <span class="text-lg ltr:ml-2 rtl:mr-2 font-semibold align-middle lg:inline dark:text-white-light">
              پنل مدیریت هوکا
            </span>
          </router-link>
          <button
            type="button"
            class="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 hover:text-primary dark:text-white-light dark:hover:bg-dark-light/10"
            @click="appStore.toggleSidebar()"
          >
            <icon-carets-down class="m-auto rotate-90" />
          </button>
        </div>

        <!-- Scrollable Menu -->
        <perfect-scrollbar
          :options="{ swipeEasing: true, wheelPropagation: false }"
          class="h-[calc(100vh-80px)] relative"
        >
          <ul class="relative font-semibold space-y-0.5 p-4 py-0">

            <!-- داشبورد -->
            <li class="menu nav-item">
              <router-link
                to="/admin/dashboard"
                class="nav-link group"
                :class="{ active: isActive('/admin/dashboard') }"
                @click="closeMobile"
              >
                <div class="flex items-center">
                  <icon-layout-grid class="group-hover:!text-primary shrink-0" />
                  <span class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">داشبورد</span>
                </div>
              </router-link>
            </li>

            <!-- بخش مدیریت -->
            <h2 class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
              <icon-minus class="w-4 h-5 flex-none hidden" />
              <span>مدیریت</span>
            </h2>

            <!-- کاربران با submenu -->
            <li class="menu nav-item">
              <button
                type="button"
                class="nav-link group w-full"
                :class="{ active: activeDropdown === 'users' }"
                @click="toggleDropdown('users')"
              >
                <div class="flex items-center">
                  <icon-users class="group-hover:!text-primary shrink-0" />
                  <span class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">کاربران</span>
                </div>
                <div :class="{ 'rtl:rotate-90 -rotate-90': activeDropdown !== 'users' }">
                  <icon-caret-down />
                </div>
              </button>
              <vue-collapsible :isOpen="activeDropdown === 'users'">
                <ul class="sub-menu text-gray-500">
                  <li>
                    <router-link to="/admin/users" @click="closeMobile">لیست کاربران</router-link>
                  </li>
                </ul>
              </vue-collapsible>
            </li>

            <!-- بخش سیستم -->
            <h2 class="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
              <icon-minus class="w-4 h-5 flex-none hidden" />
              <span>سیستم</span>
            </h2>

            <!-- تنظیمات -->
            <li class="menu nav-item">
              <router-link
                to="/admin/settings"
                class="nav-link group"
                :class="{ active: isActive('/admin/settings') }"
                @click="closeMobile"
              >
                <div class="flex items-center">
                  <icon-settings class="group-hover:!text-primary shrink-0" />
                  <span class="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">تنظیمات</span>
                </div>
              </router-link>
            </li>

            <li class="border-t border-white-light dark:border-[#1b2e4b] !my-3"></li>

            <!-- بازگشت -->
          </ul>
        </perfect-scrollbar>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import IconCaretsDown from '@/components/icon/icon-carets-down.vue'
import IconCaretDown from '@/components/icon/icon-caret-down.vue'
import IconMinus from '@/components/icon/icon-minus.vue'
import IconLayoutGrid from '@/components/icon/icon-layout-grid.vue'
import IconUsers from '@/components/icon/icon-users.vue'
import IconSettings from '@/components/icon/icon-settings.vue'

const route = useRoute()
const appStore = useAppStore()
const activeDropdown = ref<string | null>(null)

const isActive = (path: string) => route.path.startsWith(path)
const toggleDropdown = (name: string) => {
  activeDropdown.value = activeDropdown.value === name ? null : name
}
const closeMobile = () => {
  if (window.innerWidth < 1024) appStore.toggleSidebar()
}
</script>
