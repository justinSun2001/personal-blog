import http from './http';

export const getPubKey = () => {
  return http.get('/user/pubkey');
};
export const login = (data: object) => {
  return http.post('/user/login', data);
};
export const register = (data: object) => {
  return http.post('/user/register', data);
};
export const getRefreshToken = () => {
  return http.get('/user/refreshToken');
};
