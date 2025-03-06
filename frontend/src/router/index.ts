import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

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
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      keepAlive: false, // 需要被缓存
    },
  },

  {
    path: '/articles/:id',
    name: 'ArticleContent',
    component: () => import('@/views/ArticleContent.vue'),
    props: true, // 将 id 参数作为 prop 传递给组件
    meta: {
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/articlelist',
    // name: 'ArticleList',
    component: () => import('@/views/ArticleList.vue'),
    meta: {
      keepAlive: true, // 需要被缓存
    },
  },
  {
    path: '/nbadata/:id*',
    name: 'NbaData',
    component: () => import('@/views/NbaData.vue'),
  },
  {
    path: '/about/:id*',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/userdata/',
    name: 'UserData',
    component: () => import('@/views/UserData.vue'),
    children: [
      {
        path: 'datahome',
        name: 'DataHome',
        component: () => import('@/components/userdata/DataHome.vue'),
      },
      {
        path: 'articlelist',
        name: 'ArticleList',
        component: () => import('@/components/userdata/ArticleList.vue'),
      },
      {
        path: 'authorlist',
        name: 'Authorlist',
        component: () => import('@/components/userdata/AuthorList.vue'),
      },
      {
        path: 'genrelist',
        name: 'GenreList',
        component: () => import('@/components/userdata/GenreList.vue'),
      },
      {
        path: 'article/:id',
        name: 'ArticleDetail',
        component: () => import('@/components/userdata/ArticleDetail.vue'),
      },
      {
        path: 'author/:id',
        name: 'AuthorDetail',
        component: () => import('@/components/userdata/AuthorDetail.vue'),
      },
      {
        path: 'genre/:id',
        name: 'GenreDetail',
        component: () => import('@/components/userdata/GenreDetail.vue'),
      },
      {
        path: 'addarticle',
        name: 'AddArticle',
        component: () => import('@/components/userdata/AddArticle.vue'),
      },
      {
        path: 'addauthor',
        name: 'AddAuthor',
        component: () => import('@/components/userdata/AddAuthor.vue'),
      },
      {
        path: 'addgenre',
        name: 'AddGenre',
        component: () => import('@/components/userdata/AddGenre.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(), // 使用 history 模式
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, _, next) => {
  // If the route is not '/user' and the user is not authenticated, redirect to '/user'
  const isAuthenticated = !!localStorage.getItem('user'); // Example: check if the 'user' exists in localStorage

  if (to.path !== '/user' && !isAuthenticated) {
    // If not authenticated, redirect to '/user'
    next('/user');
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router;
