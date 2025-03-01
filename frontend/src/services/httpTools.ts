// httpTools.ts
import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { getTokenByLocal, getRefreshTokenByLocal } from '@/common/keyAndToken.ts';

export function handleNetErr(error: AxiosError) {
  // 处理网络错误，例如：断网、服务器异常等
  if (!error.response) {
    console.error('Network Error:', error);
  } else {
    console.error('HTTP Error:', error.response.status, error.response.statusText);
  }
}

export function handleAuthError(response: AxiosResponse) {
  // 处理身份认证错误，比如token失效
  if (response.status === 401) {
    console.error('Authorization Error: Token expired or invalid');
  }
}

export function handleAuth(config: InternalAxiosRequestConfig, isRefreshTokening: boolean): InternalAxiosRequestConfig {
  // 从本地存储获取当前的 token
  const token = getTokenByLocal();
  // 如果有 token 且没有在刷新状态下，将 token 添加到请求头中
  if (token && !isRefreshTokening) {
    config.headers['Authorization'] = `Bearer ${token}`;
  } else if (isRefreshTokening) {
    // 如果有 token 且在刷新状态下，将 refreshToken 添加到请求头中
    const refreshToken = getRefreshTokenByLocal();
    config.headers['Authorization'] = `Bearer ${refreshToken}`;
  }
  return config;
}
