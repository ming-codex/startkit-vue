import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import elementIcon from './element-icon'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n/index'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(elementIcon)

app.mount('#app')
