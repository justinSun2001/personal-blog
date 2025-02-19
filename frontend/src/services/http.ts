import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { handleNetErr, handleRequestHeader, handleAuth } from './httpTools';
import { serviceConfig } from './config.ts';
import { useRouter } from 'vue-router';
interface watingQueueTyp {
  resolve: (value: any) => void;
  config: InternalAxiosRequestConfig<any>;
}
const router = useRouter();
let isRefreshTokening = false;
const watingQueue: watingQueueTyp[] = [];
const { baseURL, useTokenAuthorization, timeout, withCredentials } = serviceConfig;
const http = axios.create({
  baseURL,
  timeout,
  withCredentials
});

http.interceptors.request.use(config => {
  config = handleRequestHeader(config, {}); // 其他调整
  if (useTokenAuthorization) {
    config = handleAuth(config, isRefreshTokening); // 添加token
  }

  return config;
});

http.interceptors.response.use(
  res => {
    console.log(res);
    if (res.status === 200 || res.status === 201) {
      // handleAuthError(res);
      return Promise.resolve(res.data);
    }

    return Promise.reject(res);
  },
  async err => {
    console.log(err);
    const needRefreshToken = err.response.status === 401 && err.config.url !== '/user/refreshToken';
    if (needRefreshToken) {
      return await silentTokenRefresh(err);
    }
    handleNetErr(err);

    return Promise.reject(err);
  }
);

export default http;

import { getRefreshToken } from '../services/login.ts';
import { setRefreshTokenInLocal, setTokenInLocal } from '@/common/keyAndToken.ts';

// 无感刷新token
async function silentTokenRefresh(err: any) {
  const { config } = err;
  if (!isRefreshTokening) {
    return await startRefresh(config);
  }
  return waitingRefresh(config);
}

// 开始刷新token
async function startRefresh(config: InternalAxiosRequestConfig<any>) {
  await refreshToken();
  tryWatingRequest();
  return http(config); //该配置对应的请求第一次发现了token失效,直接重新发送
}

// 正在刷新token,将当前请求存储
function waitingRefresh(config: InternalAxiosRequestConfig<any>) {
  return new Promise(resolve => {
    //存储刷新期间失败的请求,返回一个新的promise,保持该次请求的状态为等待,不让这次请求结束,使结果正确返回至对应的请求发出点
    watingQueue.push({ config, resolve });
  });
}

// 请求新token,并更新本地
async function refreshToken() {
  isRefreshTokening = true;
  try {
    // 调用 getRefreshToken()，并获取响应对象
    const response = await getRefreshToken();
    console.log('Refresh token response:', response);
    // 检查响应的状态是否为成功（例如 200）
    if (response.status === 200) {
      const { token, refreshToken } = response.data; // 从响应数据中提取 token 和 refreshToken
      console.log('Refresh token successful:', token, refreshToken);
      // 保存 token 和 refreshToken
      setTokenInLocal(token);
      setRefreshTokenInLocal(refreshToken);
    } else if(response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      router.push('/user');
    }
      else {
      // 如果状态码不是 200，处理异常或错误逻辑
      console.error('Refresh token failed with status:', response.status);
    }
  } catch (error) {
    // 捕获任何错误，例如网络请求错误
    console.error('Error refreshing token:', error);
  } finally {
    // 无论如何，都结束刷新状态
    isRefreshTokening = false;
  }
}

// 重新发送由于token过期存储的请求
function tryWatingRequest() {
  while (watingQueue.length > 0) {
    const { config, resolve } = watingQueue.shift() as watingQueueTyp;
    resolve(http(config));
  }
}
