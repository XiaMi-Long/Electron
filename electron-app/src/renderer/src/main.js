import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css'
import { createPinia } from 'pinia'
import { router } from '@renderer/router/index'
import {
  // create naive ui
  create,
  // component
  NAvatar,
  NSpace,
  NButton,
  NList,
  NListItem,
  NImage,
  NGrid,
  NGridItem,
  NSpin,
  NMessageProvider,
  NNotificationProvider,
  NDrawer,
  NDrawerContent,
  NFormItem,
  NInput,
  NRadio,
  NRadioGroup,
  NForm,
  NScrollbar,
  NIcon
} from 'naive-ui'

const pinia = createPinia()

const naive = create({
  components: [
    NAvatar,
    NSpace,
    NButton,
    NList,
    NListItem,
    NImage,
    NGrid,
    NGridItem,
    NSpin,
    NMessageProvider,
    NNotificationProvider,
    NDrawer,
    NDrawerContent,
    NFormItem,
    NForm,
    NInput,
    NRadio,
    NRadioGroup,
    NScrollbar,
    NIcon
  ]
})

createApp(App).use(router).use(naive).use(pinia).mount('#app')
