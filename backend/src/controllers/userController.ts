import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { getPubKeyPem, privateDecrypt } from "../public/keys";
import { generateToken, generateReFreshToken } from "../jwt";
// 扩展 Request 类型，添加 user 属性
type User = { username: string } | { email: string };

export const refresh_token = (req: Request, res: Response, next: NextFunction): void => {
  const { email, username } = req.user as { email: string; username: string }; // 明确断言类型
  // 新token
  const token = generateToken(email ? { email } : { username });
  // 新refreshToken
  const refreshToken = generateReFreshToken(email ? { email } : { username });
  res.send({
    data: {
      token,refreshToken
    },
    status: 200,
    success: true,
  })
}
// 用户注册
export const user_register = (req: Request, res: Response, next: NextFunction): void => {
  const { email, username, pass } = req.body;

  // 检查 email 是否已存在
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        // 如果 email 已存在，返回错误消息
        return res.status(400).json({ message: 'Email already exists.' });
      }

      // 检查 username 是否已存在
      return User.findOne({ username })
        .then(existingUserByUsername => {
          if (existingUserByUsername) {
            // 如果 username 已存在，返回错误消息
            return res.status(400).json({ message: 'Username already exists.' });
          }

          // 创建新的用户
          const user = new User({
            password: pass,
            email,
            username,
          });

          // 保存新用户到数据库
          user.save()
            .then(() => res.status(201).json({ message: 'Registration successful.', data: req.body }))
            .catch(err => next(err)); // 处理保存过程中可能出现的错误
        });
    })
    .catch(err => next(err));  // 处理查询数据库过程中可能出现的错误
};

// 用户登录
export const user_login = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Received Data:", req.body); // 输出 req.body 以检查数据是否收到
  // Decrypt the incoming data to extract email or username and password
  const { email, username, pass } = privateDecrypt(req.body.encrypted);
  console.log("Decrypted Data:", email, username, pass); // Output decrypted data

  // Determine if we are using email or username for login
  const searchCriteria = email ? { email } : { username };
  console.log("Search Criteria:", searchCriteria); // Output search criteria
  User.findOne(searchCriteria)
    .where('password')
    .equals(pass)
    .lean() // 避免 Mongoose Document 类型问题
    .exec()
    .then((login: IUser | null) => {
      if (!login) {
        res.send({
          data: {token: null, refreshToken:'null', err: "用户名或密码错误", success:false},
        });
        return 
      }
      // Generate the token using either username or email
      const token = generateToken(email ? { email } : { username });
      const refreshToken = generateReFreshToken(email ? { email } : { username });
      res.send({
        data: {token, refreshToken, err: null, success:true},
      });
    })
    .catch((err) => next(err));
};

// 获取所有用户
export const user_list = (req: Request, res: Response, next: NextFunction): void => {
  User.find()
    .lean() // 避免 Mongoose Document 类型问题
    .exec()
    .then((user_list: IUser[]) => res.json(user_list))
    .catch((err) => next(err));
};

export const get_pubkey = (req: Request, res: Response, next: NextFunction): void => {
  res.set('Content-Type', 'application/x-pem-file');
    const pub_key = getPubKeyPem();
    res.send({
      data: { pub_key },
      err: null,
      success: true
    });
}
