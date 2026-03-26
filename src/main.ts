import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { createHead } from '@vueuse/head'
import i18n from './i18n'
import appSetting from './app-setting'

// CSS
import './assets/css/app.css'

// perfect scrollbar - named import
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

// popper
import Popper from 'vue3-popper'

// vue-height-collapsible
import VueCollapsible from 'vue-height-collapsible/vue3/vue-height-collapsible.esm.js'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)
app.use(i18n)

// Register components globally
app.component('PerfectScrollbar', PerfectScrollbar)
app.component('Popper', Popper)
app.component('VueCollapsible', VueCollapsible)

app.mount('#app')

appSetting.init()
