import { setKeyInLocal, getKeyByLocal } from '@/common/keyAndToken.ts';
import { getPubKey } from '@/services/user';
import type { AxiosResponse } from 'axios';
import forge from "node-forge";

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

export const encryptParam = async (param: object) => {
  const publicKeyPem = await getRsaKey();
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(forge.util.encodeUtf8(JSON.stringify(param)), "RSA-OAEP", {
    md: forge.md.sha256.create(), // 使用 sha256
  });
  return forge.util.encode64(encrypted);
};
