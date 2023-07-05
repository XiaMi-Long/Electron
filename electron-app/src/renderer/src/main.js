import { createApp } from 'vue'
import App from './App.vue'
import 'animate.css';
import { router } from '@renderer/router/index'
import {
    // create naive ui
    create,
    // component
    NAvatar,
    NSpace,
    NButton,
    NList,
    NListItem
} from 'naive-ui'


const naive = create({
    components: [NAvatar, NSpace, NButton, NList, NListItem]
})


createApp(App).use(router).use(naive).mount('#app')