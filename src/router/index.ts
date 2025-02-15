import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'),
  },
  {
    path: '/home/:id',
    name: 'Home',
    component: () => import('../views/home/Home.vue'),
    meta: {
      depth: 1,
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/articles/:id',
    name: 'ArticleContent',
    component: () => import('../components/ArticleContent.vue'),
    props: true,
    meta: {
      depth: 0.5,
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/articleList/:id',
    name: 'Articles',
    component: () => import('../views/article/Articles.vue'),
    meta: {
      depth: 2,
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/about/:id*',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(), // 使用 history 模式
  routes,
})

export default router
