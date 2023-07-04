import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@renderer/router/index'

createApp(App).use(router).mount('#app')