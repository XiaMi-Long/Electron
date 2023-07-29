import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    name: 'Home',
    path: '/',
    component: () => import('@renderer/pages/home/index.vue'),
    children: [
      {
        name: 'Background',
        path: '/background',
        component: () => import('@renderer/components/background/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'User',
        path: '/user',
        component: () => import('@renderer/components/user/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'CopyCount',
        path: '/copycount',
        component: () => import('@renderer/components/copy-count/index.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'Setting',
        path: '/setting',
        component: () => import('@renderer/components/setting/index.vue'),
        meta: {
          keepAlive: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * 获取所有需要缓存的路由name
 * @returns 需要缓存的路由name
 */
const getAllKeepAlive = function () {
  const result = []
  const stack = []
  routes.forEach((item) => {
    stack.push(item)
  })

  while (stack.length > 0) {
    const item = stack.pop()
    if (item.children) {
      item.children.forEach((item2) => {
        if (item2.meta.keepAlive) {
          result.push(item2.name)
        }
        if (item2.children) {
          stack.push(item2)
        }
      })
    }
  }

  return result
}

export { router, getAllKeepAlive }
