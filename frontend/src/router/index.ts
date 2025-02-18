import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/user',
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User.vue'),
  },
  {
    path: '/home',
    redirect: '/home/1',
  },
  {
    path: '/home/:id',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      depth: 1,
      keepAlive: true, // 需要被缓存
    },
  },

  {
    path: '/articles/:id',
    name: 'ArticleContent',
    component: () => import('@/views/ArticleContent.vue'),
    props: true,
    meta: {
      depth: 0.5,
      keepAlive: true, // 需要被缓存
    },
  },

  {
    path: '/articleList/:id',
    name: 'Articles',
    component: () => import('@/views/Articles.vue'),
    meta: {
      depth: 2,
      keepAlive: true, // 需要被缓存
    },
  },

  {
    path: '/about/:id*',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  
]

const router = createRouter({
  history: createWebHistory(), // 使用 history 模式
  routes,
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  // If the route is not '/user' and the user is not authenticated, redirect to '/user'
  const isAuthenticated = !!localStorage.getItem('user');  // Example: check if the 'user' exists in localStorage

  if (to.path !== '/user'  && !isAuthenticated) {
    // If not authenticated, redirect to '/user'
    next('/user');
  } else {
    // Otherwise, allow navigation
    next();
  }
})

export default router
