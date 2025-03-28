// config.ts

export const serviceConfig = {
  baseURL: 'http://localhost:3000/', // 你的 API 基础 URL
  useTokenAuthorization: true, // 是否启用 token 授权
  timeout: 10000, // 请求超时设置
  withCredentials: true, // 是否携带 cookie
};
