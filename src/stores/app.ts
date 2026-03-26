import { defineStore } from 'pinia'
import i18n from '@/i18n'
import appSetting from '@/app-setting'

const rtlLanguages = new Set(['ae', 'fa', 'ar'])

export const useAppStore = defineStore('app', {
  state: () => ({
    isDarkMode: false,
    theme: 'light',
    menu: 'vertical',
    layout: 'full',
    rtlClass: 'rtl',
    animation: '',
    navbar: 'navbar-sticky',
    locale: 'fa',
    sidebar: false,
    languageList: [
      { code: 'fa', name: 'فارسی' },
      { code: 'ae', name: 'Arabic' },
      { code: 'en', name: 'English' },
    ],
    isShowMainLoader: true,
    semidark: false,
  }),

  actions: {
    toggleTheme(payload: string | null = null) {
      const value = payload || this.theme
      localStorage.setItem('theme', value)
      this.theme = value

      if (value === 'light') {
        this.isDarkMode = false
      } else if (value === 'dark') {
        this.isDarkMode = true
      } else {
        this.isDarkMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
      }

      document.querySelector('body')?.classList.toggle('dark', this.isDarkMode)
    },

    toggleMenu(payload: string | null = null) {
      const value = payload || this.menu
      this.sidebar = false
      localStorage.setItem('menu', value)
      this.menu = value
    },

    toggleLayout(payload: string | null = null) {
      const value = payload || this.layout
      localStorage.setItem('layout', value)
      this.layout = value
    },

    toggleRTL(payload: string | null = null) {
      const value = payload || this.rtlClass
      localStorage.setItem('rtlClass', value)
      this.rtlClass = value
      document.querySelector('html')?.setAttribute('dir', value)
      document.querySelector('html')?.setAttribute('lang', value === 'rtl' ? this.locale : 'en')
    },

    toggleAnimation(payload: string | null = null) {
      const value = (payload || this.animation || '').trim()
      localStorage.setItem('animation', value)
      this.animation = value
      appSetting.changeAnimation()
    },

    toggleNavbar(payload: string | null = null) {
      const value = payload || this.navbar
      localStorage.setItem('navbar', value)
      this.navbar = value
    },

    toggleSemidark(payload: boolean | null = null) {
      const value = payload ?? false
      localStorage.setItem('semidark', String(value))
      this.semidark = value
    },

    toggleLocale(payload: string | null = null) {
      const value = payload || this.locale
      i18n.global.locale.value = value
      localStorage.setItem('i18n_locale', value)
      this.locale = value
      this.toggleRTL(rtlLanguages.has(value.toLowerCase()) ? 'rtl' : 'ltr')
    },

    toggleSidebar() {
      this.sidebar = !this.sidebar
    },

    toggleMainLoader() {
      this.isShowMainLoader = true
      setTimeout(() => {
        this.isShowMainLoader = false
      }, 500)
    },

    initApp() {
      appSetting.init()
    },
  },
})
