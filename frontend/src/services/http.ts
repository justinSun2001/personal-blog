import axios from 'axios';

// 创建 axios 实例
const http = axios.create({
  baseURL: 'http://localhost:3000/', // 根据需要设置 baseURL
  timeout: 5000, // 设置请求超时时间
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头，例如添加 token
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
