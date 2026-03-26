import { $themeConfig } from '@/theme.config'
import { useAppStore, type LocaleCode } from '@/stores/app'

export default {
  init() {
    const store = useAppStore()

    let value: string | boolean | null = localStorage.getItem('theme')
    store.toggleTheme((value as string) || $themeConfig.theme)

    value = localStorage.getItem('menu')
    store.toggleMenu((value as string) || $themeConfig.menu)

    value = localStorage.getItem('layout')
    store.toggleLayout((value as string) || $themeConfig.layout)

    value = localStorage.getItem('i18n_locale')
    const locale = (value as string) || $themeConfig.locale
    const item = store.languageList.find((entry) => entry.code === locale)
    this.toggleLanguage(item || store.languageList[0])

    value = localStorage.getItem('rtlClass')
    store.toggleRTL((value as string) || $themeConfig.rtlClass)

    value = localStorage.getItem('animation')
    store.toggleAnimation((value as string) || $themeConfig.animation)

    value = localStorage.getItem('navbar')
    store.toggleNavbar((value as string) || $themeConfig.navbar)

    value = localStorage.getItem('semidark')
    store.toggleSemidark(value === 'true' ? true : $themeConfig.semidark)
  },

  toggleLanguage(item?: { code: LocaleCode; name: string }) {
    const store = useAppStore()
    const lang = item || store.languageList.find((entry) => entry.code === store.locale) || store.languageList[0]
    store.toggleLocale(lang.code)
    return lang
  },

  changeAnimation(type = 'add') {
    const store = useAppStore()
    if (!store.animation) return

    const element = document.querySelector('.animation')
    if (!element) return

    if (type === 'add') {
      element.classList.add('animate__animated', store.animation)
    } else {
      element.classList.remove('animate__animated', store.animation)
    }
  },
}
