import http from './http';

export const getPubKey = () => {
  return http.get('/user/pubkey');
};
export const login = (data: object) => {
  return http.post('/user/login', data);
};