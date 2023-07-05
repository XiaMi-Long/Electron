import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@renderer/pages/home/index.vue'),
        children: [
            {
                path: '/background',
                component: () => import('@renderer/components/background/index.vue')
            },
            {
                path: '/user',
                component: () => import('@renderer/components/user/index.vue')
            },
            {
                path: '/setting',
                component: () => import('@renderer/components/setting/index.vue')
            }
        ]
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export { router }