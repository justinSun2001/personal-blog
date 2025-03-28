import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// 定义路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/User.vue'),
  },
  {
    path: '/home',
    name: 'Home', // 路由名称
    redirect: '/homepage',
    component: () => import('@/views/SitePage.vue'),
    children: [
      {
        path: '/homepage',
        name: 'HomePage',
        component: () => import('@/components/sitepage/HomePage.vue'),
      },
      {
        path: '/articlelists',
        name: 'ArticleLists',
        component: () => import('@/components/sitepage/ArticleLists.vue'),
      },
      {
        path: '/nbadata',
        name: 'NbaData',
        component: () => import('@/components/sitepage/NbaData.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/components/sitepage/About.vue'),
      },
      {
        path: '/articles/:id',
        name: 'ArticleContent',
        component: () => import('@/components/sitepage/ArticleContent.vue'),
        props: true, // 将 id 参数作为 prop 传递给组件
      },
      {
        path: '/userdata',
        name: 'ManageUserData',
        redirect: '/userdata/datahome',
        component: () => import('@/components/sitepage/ManageUserData.vue'),
        children: [
          {
            path: '/userdata/datahome',
            name: 'DataHome',
            component: () => import('@/components/managedata/DataHome.vue'),
          },
          {
            path: '/userdata/articlelist',
            name: 'ArticleList',
            component: () => import('@/components/managedata/ArticleList.vue'),
          },
          {
            path: '/userdata/authorlist',
            name: 'Authorlist',
            component: () => import('@/components/managedata/AuthorList.vue'),
          },
          {
            path: '/userdata/genrelist',
            name: 'GenreList',
            component: () => import('@/components/managedata/GenreList.vue'),
          },
          {
            path: '/userdata/article/:id',
            name: 'ArticleDetail',
            component: () => import('@/components/managedata/ArticleDetail.vue'),
          },
          {
            path: '/userdata/author/:id',
            name: 'AuthorDetail',
            component: () => import('@/components/managedata/AuthorDetail.vue'),
          },
          {
            path: '/userdata/genre/:id',
            name: 'GenreDetail',
            component: () => import('@/components/managedata/GenreDetail.vue'),
          },
          {
            path: '/userdata/addarticle',
            name: 'AddArticle',
            component: () => import('@/components/managedata/AddArticle.vue'),
          },
          {
            path: '/userdata/addauthor',
            name: 'AddAuthor',
            component: () => import('@/components/managedata/AddAuthor.vue'),
          },
          {
            path: '/userdata/addgenre',
            name: 'AddGenre',
            component: () => import('@/components/managedata/AddGenre.vue'),
          },
        ],
      },
      {
        path: '/ocrsite',
        name: 'OcrSite',
        redirect: '/ocrsite/table',
        component: () => import('@/components/sitepage/ManageOcrData.vue'),
        children: [
          {
            path: '/ocrsite/table',
            name: 'OcrTable',
            component: () => import('@/components/ocrsite/OcrTable.vue'),
          },
          {
            path: '/ocrsite/caiji',
            name: 'CaiJi',
            component: () => import('@/components/ocrsite/CaiJi.vue'),
          },
        ],
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
