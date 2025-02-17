import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user';
import multer from "multer";
const upload = multer();  // 内存存储，处理 multipart/form-data


// 用户注册
export const user_register = (req: Request, res: Response, next: NextFunction): void => {
  const user = new User({
    password: req.body.pass,
    email: req.body.email,
    userName: req.body.userName,
  });
  console.log("Received Data:", req.body); // 输出 req.body 以检查数据是否收到
  user.save()
    .then(() => res.json(req.body))
    .catch((err) => next(err));
};

// 用户登录
export const user_login = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Received Data:", req.body); // 输出 req.body 以检查数据是否收到
  User.findOne({ email: req.body.email })
    .where('password')
    .equals(req.body.pass)
    .lean() // 避免 Mongoose Document 类型问题
    .exec()
    .then((login: IUser | null) => {
      if (!login) {
        return res.status(404).json({ message: 'User not found or incorrect password' });
      }
      res.json(login);
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
