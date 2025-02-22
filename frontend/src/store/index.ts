import { createStore } from 'vuex';
import http from '@/services/http';
import VuexPersistence from 'vuex-persistedstate'; // 导入 VuexPersistence

// 定义 State 类型
interface State {
  currentPage: number;
  currentPage1: number;
  articleCount: number;
  authorCount: number;
  genreCount: number;
  articleData: object[];  // 这里的类型根据实际需求调整
  recentArticles: object[];  // 最近文章列表
}

// 创建 Vuex Store
const store = createStore<State>({
  state: {
    currentPage: 1,
    currentPage1: 1,
    articleCount: 0,
    authorCount: 0,
    genreCount: 0,
    articleData: [],  // 初始化为空数组
    recentArticles: [],  // 最近文章列表
  },
  getters: {
    // Getters 需要指定返回值的类型
    getCurrentPage: (state: State) => state.currentPage,
    getCurrentPage1: (state: State) => state.currentPage1,
    getArticleCount: (state: State) => state.articleCount,
    getArticleData: (state: State) => state.articleData,  // 获取文章数据的 getter
    getRecentArticles: (state: State) => state.recentArticles,  // 获取最近文章列表的 getter
  },
  mutations: {
    // Mutations 需要指定 state 的类型
    setCurrentPage(state: State, page: number) {
      state.currentPage = page;
    },
    setCurrentPage1(state: State, page: number) {
      state.currentPage1 = page;
    },
    setArticleCount(state: State, count: number) {
      state.articleCount = count;
    },
    setAuthorCount(state: State, count: number) {
      state.authorCount = count;
    },
    setGenreCount(state: State, count: number) {
      state.genreCount = count;
    },
    setArticleData(state: State, articleData: object[]) {
      state.articleData = articleData;  // 更新文章数据
    },
    setRecentArticles(state: State, recentArticles: object[]) {
      state.recentArticles = recentArticles;  // 更新最近文章列表
    }
  },
  actions: {
    // 异步操作，获取文章数据并更新到 state
    async fetchData({ commit }) {
      try {
        const result: any = await http.get('/catalog/data');
        commit('setArticleCount', result.article_count);
        commit('setAuthorCount', result.author_count);
        commit('setGenreCount', result.genre_count);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
  },
  modules: {
    // 如果有模块，需要声明类型
  },
  plugins: [
    VuexPersistence({
      storage: window.localStorage,  // 持久化到 localStorage
      // paths: ['articleData', 'currentPage', 'currentPage1'],  // 持久化这些字段
    }),
  ],
});

export default store;
