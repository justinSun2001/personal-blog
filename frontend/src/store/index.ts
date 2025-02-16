import { createStore } from 'vuex'

// 定义 State 类型
interface State {
  userToken: string;
  currentPage: number;
  currentPage1: number;
}

// 创建 Vuex Store
const store =  createStore<State>({
  state: {
    userToken: '',
    currentPage: 1,
    currentPage1: 1,
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
  },
  actions: {
    // 如果你有 actions，需要为它们声明类型
  },
  modules: {
    // 如果有模块，需要声明类型
  }
})

export default store;