import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { handleNetErr, handleAuth } from './httpTools';
import { serviceConfig } from './config.ts';
import { useRouter } from 'vue-router';
import { decodeNestedData } from '@/common/decodeHtml.ts';
import { storeDataToIndexedDB, getDataFromIndexedDB, getEtagFromIndexedDB } from './indexedDB.ts';
const router = useRouter();

// 刷新token时的队列
interface watingQueueTyp {
  resolve: (value: Promise<AxiosResponse>) => void;
  config: InternalAxiosRequestConfig;
}
const watingQueue: watingQueueTyp[] = [];

// 是否正在刷新token
let isRefreshTokening = false;

// 初始化axios
const { baseURL, useTokenAuthorization, timeout, withCredentials } = serviceConfig;
const http = axios.create({
  baseURL,
  timeout,
  withCredentials,
});

// 请求拦截器
http.interceptors.request.use(async (config) => {
  // 获取当前请求的 URL
  const url = config.url as string;
  if (url.includes('/catalog/articlesData')) {
    // 获取对应的 ETag
    const etag = await getEtagFromIndexedDB(url);
    if (etag) {
      // 如果存在 ETag，则将其添加到请求头
      config.headers['If-None-Match'] = etag;
    }
  }

  if (useTokenAuthorization) {
    config = handleAuth(config, isRefreshTokening); // 添加token
  }

  return config;
});

// 响应拦截器
http.interceptors.response.use(
  (res) => {
    console.log('响应拦截', res);
    if (res.status === 200 || res.status === 201) {
      const newEtag = res.headers['etag'];
      if (newEtag && res.config.url?.includes('/catalog/articlesData')) {
        // 存储新的 ETag 和数据到 IndexedDB
        storeDataToIndexedDB(res.config.url, res.data, newEtag);
        console.log('缓存数据');
      }

      // 处理返回数据
      // 对文章内容进行解码
      if (
        res.config.url === '/catalog/articles' ||
        res.config.url?.includes('/catalog/articlesData') ||
        res.config.url?.includes('/catalog/summaryData')
      ) {
        res.data = decodeNestedData(res.data);
      }
      return Promise.resolve(res.data);
    }

    return Promise.reject(res);
  },
  async (err) => {
    const needRefreshToken = err.response.status === 401 && err.config.url !== '/user/refreshToken';
    if (needRefreshToken) {
      return await silentTokenRefresh(err);
    }

    if (err.response.status === 304) {
      // 304 状态码表示资源未修改，直接返回本地缓存的数据
      const cachedData = await getDataFromIndexedDB(err.config.url);
      if (cachedData) {
        console.log('使用缓存数据');
        return Promise.resolve(cachedData);
      } else {
        console.log('没有缓存数据');
        return Promise.reject(err);
      }
    }

    handleNetErr(err);
    console.log('错误响应拦截', err);
    return Promise.reject(err);
  }
);

export default http;

import { getRefreshToken } from './user.ts';
import { setRefreshTokenInLocal, setTokenInLocal } from '@/common/keyAndToken.ts';

// 无感刷新token
async function silentTokenRefresh(err: AxiosError) {
  const config = err.config as InternalAxiosRequestConfig;
  if (!isRefreshTokening) {
    return await startRefresh(config);
  }
  return waitingRefresh(config);
}

// 开始刷新token
async function startRefresh(config: InternalAxiosRequestConfig) {
  await refreshToken();
  tryWatingRequest();
  return http(config); //该配置对应的请求第一次发现了token失效,直接重新发送
}

// 正在刷新token,将当前请求存储
function waitingRefresh(config: InternalAxiosRequestConfig) {
  return new Promise((resolve) => {
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
    // 检查响应的状态是否为成功（例如 200）
    if (response.status === 200) {
      const { token, refreshToken } = response.data; // 从响应数据中提取 token 和 refreshToken
      console.log('Refresh token successful');
      // 保存 token 和 refreshToken
      setTokenInLocal(token);
      setRefreshTokenInLocal(refreshToken);
    } else if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      router.push('/user');
    } else {
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
