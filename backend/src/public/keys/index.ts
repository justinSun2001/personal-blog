import fs from 'fs';
import crypto, { KeyObject } from 'crypto'; // 引入类型定义
import path from 'path';

interface KeyPair {
  publicKeyPem: string;
  privateKeyPem: string;
}

// 生成 RSA 密钥对
const createKeys = (): KeyPair => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  // 将公钥和私钥转换为 PEM 格式的字符串
  const publicKeyPem = publicKey.export({ type: 'pkcs1', format: 'pem' }).toString();
  const privateKeyPem = privateKey.export({ type: 'pkcs1', format: 'pem' }).toString();

  return { publicKeyPem, privateKeyPem };
};
// 设置公钥
const setPubKeyPem = (pubKey: string): void => {
  const filepath = path.join(__dirname, 'public.pem');
  fs.writeFileSync(filepath, pubKey);
};

// 设置私钥
const setPrivateKeyPem = (priKey: string): void => {
  const filepath = path.join(__dirname, 'private.pem');
  fs.writeFileSync(filepath, priKey);
};
// 获取公钥
const getPubKeyPem = (): string => {
  const filepath = path.join(__dirname, 'public.pem');
  
  // 检查文件是否存在并读取
  try {
    const publicKey = fs.readFileSync(filepath, 'utf8');
    if (!publicKey) {
      const { publicKeyPem, privateKeyPem } = createKeys();
      setPubKeyPem(publicKeyPem);
      setPrivateKeyPem(privateKeyPem);
      return publicKeyPem;
    }
    return publicKey;
  } catch (error) {
    const { publicKeyPem, privateKeyPem } = createKeys();
    setPubKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);
    return publicKeyPem;
  }
};
// 获取私钥
const getPrivateKeyPem = (): string => {
  const filepath = path.join(__dirname, 'private.pem');
  
  // 检查文件是否存在并读取
  try {
    const privateKey = fs.readFileSync(filepath, 'utf8');
    if (!privateKey) {
      const { publicKeyPem, privateKeyPem } = createKeys();
      setPubKeyPem(publicKeyPem);
      setPrivateKeyPem(privateKeyPem);
      return privateKeyPem;
    }
    return privateKey;
  } catch (error) {
    const { publicKeyPem, privateKeyPem } = createKeys();
    setPubKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);
    return privateKeyPem;
  }
};
// 使用私钥解密
const privateDecrypt = (encrypted: string): any => {
  const privateKeyPem = getPrivateKeyPem();
  const privateKey: KeyObject = crypto.createPrivateKey(privateKeyPem);
  const encryptedData = Buffer.from(encrypted, 'base64');

  // 使用私钥进行解密
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING, // 根据加密时的填充方式选择
    },
    encryptedData
  );

  return JSON.parse(decryptedBuffer.toString('utf8'));
};

// 最后将这些方法暴露出去
export {
  getPubKeyPem,
  getPrivateKeyPem,
  privateDecrypt,
};
