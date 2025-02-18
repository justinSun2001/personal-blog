import axios from 'axios';
import store from '@/store'; // 假设 Vuex 存储在 store 中

// 创建 axios 实例
const http = axios.create({
  baseURL: 'http://localhost:3000/', // 根据需要设置 baseURL
  timeout: 5000, // 设置请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头，例如添加 token
    // 假设 token 存储在 localStorage 或 Vuex 中
    const token = store.getters.getUserToken; 
    const isAuthRequired = config.url && !config.url.includes('/user'); // 根据实际情况判断需要 token 的条件

    // 如果 token 存在且请求需要认证，则将 token 添加到请求头
    if (token && isAuthRequired) {
      config.headers['Authorization'] = `Bearer ${token}`; // 添加 token 到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data; // 返回响应数据
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
