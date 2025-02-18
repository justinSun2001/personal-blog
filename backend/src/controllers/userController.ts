import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import { getPubKeyPem, privateDecrypt } from "../public/keys";
import { generateToken, authenticateToken } from "../jwt";


// 用户注册
export const user_register = (req: Request, res: Response, next: NextFunction): void => {
  const user = new User({
    password: req.body.pass,
    email: req.body.email,
    username: req.body.username,
  });
  console.log("Received Data:", req.body); // 输出 req.body 以检查数据是否收到
  user.save()
    .then(() => res.json(req.body))
    .catch((err) => next(err));
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
          data: {token: null, err: "用户名或密码错误", success:false},
        });
        return 
      }
      // Generate the token using either username or email
      const token = generateToken(email ? { email } : { username });
      res.send({
        data: {token, err: null, success:true},
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
