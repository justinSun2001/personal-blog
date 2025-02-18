import jwt from 'jsonwebtoken';
import { getPrivateKeyPem } from './public/keys'; // 假设这个文件已经使用了TypeScript
import { Request, Response, NextFunction } from 'express';

// 扩展 Request 类型，添加 user 属性
type User = { username: string } | { email: string };

declare global {
  namespace Express {
    interface Request {
      user?: User; // 添加 user 属性
    }
  }
}

// 获取私钥
const secret: string = getPrivateKeyPem(); // 你的密钥

// 设置 token 过期时间
const options: jwt.SignOptions = {
  expiresIn: '10s', // 可以是数字（单位为秒）或字符串（如 '2 hours'、'1d' 等）
  algorithm: 'RS256', // 使用 RS256 非对称加密进行签名
};

// 生成并签发 JWT 令牌
function generateToken(user: User): string {
  // Check if user has a 'username' or 'email' and create the payload accordingly
  const payload = 'username' in user ? { username: user.username } : { email: user.email };
  return jwt.sign(payload, secret, options);
}

// 中间件，校验 token
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  // 登录和获取公钥不校验 token
  if (['/login', '/getPubKey'].includes(req.url)) {
    return next(); // 不做 token 校验，直接调用 next()
  }

  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // 获取 Bearer 后面的 token 值
    try {
      const decoded = jwt.verify(token, secret); // 使用密钥验证 Token
      console.log("decoded:", decoded);
      req.user = decoded as User; // 将解码后的用户信息添加到 req 对象，以便后续路由使用
      console.log("当前时间", Date.now());
      next(); // 如果验证通过，继续执行下一个中间件或路由处理程序
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized: Invalid token.' });
      return 
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided.' });
    return 
  }
}

export { generateToken, authenticateToken };
