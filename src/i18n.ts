import { createI18n } from 'vue-i18n'
import ae from '@/locales/ae.json'
import fa from '@/locales/fa.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('i18n_locale') || 'fa',
  fallbackLocale: 'fa',
  messages: {
    ae,
    fa,
    en: ae,
  },
})

export default i18n
