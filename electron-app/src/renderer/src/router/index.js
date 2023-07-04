import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@renderer/pages/home/index.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export { router }