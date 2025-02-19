// httpTools.ts
import type { InternalAxiosRequestConfig } from 'axios';
import { getTokenByLocal, getRefreshTokenByLocal } from '@/common/keyAndToken.ts';

export function handleNetErr(error: any) {
  // 处理网络错误，例如：断网、服务器异常等
  if (!error.response) {
    console.error('Network Error:', error);
  } else {
    console.error('HTTP Error:', error.response.status, error.response.statusText);
  }
}

export function handleAuthError(response: any) {
  // 处理身份认证错误，比如token失效
  if (response.status === 401) {
    console.error('Authorization Error: Token expired or invalid');
  }
}

export function handleRequestHeader(config: InternalAxiosRequestConfig, extraHeaders: any): InternalAxiosRequestConfig {
  // 设置请求头的一些逻辑，例如默认的 headers
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  return config;
}

export function handleAuth(config: InternalAxiosRequestConfig, isRefreshTokening: boolean): InternalAxiosRequestConfig {
  // 如果当前不是在刷新 token，添加 token
  const token = getTokenByLocal(); // 从本地存储获取当前的 token
  const refreshToken = getRefreshTokenByLocal();
  if (token && !isRefreshTokening) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }else if(isRefreshTokening){
    config.headers['Authorization'] = `Bearer ${refreshToken}`;
  }
  return config;
}
