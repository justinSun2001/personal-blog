import { createStore } from 'vuex'
import http from '@/services/http'
import VuexPersistence from 'vuex-persistedstate'; // 导入 VuexPersistence
// 定义 State 类型
interface State {
  userToken: string;
  currentPage: number;
  currentPage1: number;
  articleCount: number;
  authorCount: number;
  genreCount: number;
}

// 创建 Vuex Store
const store =  createStore<State>({
  state: {
    userToken: '',
    currentPage: 1,
    currentPage1: 1,
    articleCount: 0,
    authorCount: 0,
    genreCount: 0,
  },
  getters: {
    // Getters 需要指定返回值的类型
    getUserToken: (state: State) => state.userToken,
    getCurrentPage: (state: State) => state.currentPage,
    getCurrentPage1: (state: State) => state.currentPage1,
    getArticleCount: (state: State) => state.articleCount,
  },
  mutations: {
    // Mutations 需要指定 state 的类型
    setUserToken(state: State, token: string) {
      state.userToken = token;
    },
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

  },
  actions: {
    // 如果你有 actions，需要为它们声明类型
    async fetchData({ commit }) {
      try {
        const result:any = await http.get("/catalog/data");
        commit("setArticleCount", result.article_count);
        commit("setAuthorCount", result.author_count);
        commit("setGenreCount", result.genre_count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
  },
  modules: {
    // 如果有模块，需要声明类型
  },
  plugins: [
    // 配置 vuex-persistedstate 插件，持久化部分或全部 state
    VuexPersistence({
      storage: window.localStorage, // 可以选择 localStorage 或 sessionStorage
      // 你也可以指定需要持久化的 state，例如：
      // paths: ['userToken', 'currentPage'] 
    }),
  ],
})

export default store;