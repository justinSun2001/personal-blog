import JSEncrypt from 'jsencrypt';
import { setKeyInLocal, getKeyByLocal } from '@/common/keyAndToken.ts';
import { getPubKey } from '@/services/user';
import type { AxiosResponse } from 'axios';

// 获取公钥
export const getRsaKey = async () => {
  const key = getKeyByLocal();
  if (['undefined', null, undefined].includes(key)) {
    try {
      // Assuming getPubKey returns an AxiosResponse
      const response: AxiosResponse = await getPubKey();
      const data = response.data;

      // Assuming that response.data contains the public key
      if (data && data.pub_key) {
        setKeyInLocal(data.pub_key);
        return data.pub_key;
      }
    } catch (error) {
      console.error('Error fetching public key:', error);
    }
  }
  return key;
};

// 加密参数
export const encryptParam = async (param: object) => {
  const key = await getRsaKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(key);
  return encryptor.encrypt(JSON.stringify(param));
};
