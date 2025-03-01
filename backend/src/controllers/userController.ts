import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";
import { getPubKeyPem, privateDecrypt } from "../public/keys";
import { generateToken, generateReFreshToken } from "../jwt";
import bcrypt from "bcryptjs"; // 引入bcryptjs
// 扩展 Request 类型，添加 user 属性
type User = { username: string } | { email: string };

// 刷新token
export const refresh_token = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, username } = req.user as { email: string; username: string }; // 明确断言类型
  // 新token
  const token = generateToken(email ? { email } : { username });
  // 新refreshToken
  const refreshToken = generateReFreshToken(email ? { email } : { username });
  res.send({
    data: {
      token,
      refreshToken,
    },
    status: 200,
    success: true,
  });
};

// 用户注册
export const user_register = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 解密数据
  const { email, username, pass } = privateDecrypt(req.body.encrypted);
  // 检查 email 是否已存在
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // 如果 email 已存在，返回错误消息
        return res.send({
          status: 400,
          data: { err: "邮箱已存在", success: false },
        });
      }

      // 检查 username 是否已存在
      return User.findOne({ username }).then((existingUserByUsername) => {
        if (existingUserByUsername) {
          // 如果 username 已存在，返回错误消息
          return res.send({
            status: 400,
            data: { err: "用户名已存在", success: false },
          });
        }
        // 加密密码
        bcrypt.hash(pass, 10, (err, hashedPassword) => {
          if (err) {
            return next(err); // 如果加密过程中出现错误
          }
          // 创建新的用户
          const user = new User({
            password: hashedPassword,
            email,
            username,
          });

          // 保存新用户到数据库
          user
            .save()
            .then(() => {
              return res.send({
                status: 201,
                data: { message: "注册成功，请登录！", success: true },
              });
            })
            .catch((err) => next(err)); // 处理保存过程中可能出现的错误
        });
      });
    })
    .catch((err) => next(err)); // 处理查询数据库过程中可能出现的错误
};

// 用户登录
export const user_login = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 解密数据
  const { email, username, pass } = privateDecrypt(req.body.encrypted);
  // 检查 email 或 username 是否存在
  const searchCriteria = email ? { email } : { username };
  // 检查密码是否匹配
  User.findOne(searchCriteria)
    .lean() // 避免 Mongoose Document 类型问题
    .exec()
    .then((user: IUser | null) => {
      if (!user) {
        res.send({
          status: 400,
          data: {
            token: null,
            refreshToken: null,
            err: "用户名或邮箱不存在",
            success: false,
          },
        });
        return;
      }
      // 使用 bcrypt 比对密码
      bcrypt.compare(pass, user.password, (err, isMatch) => {
        if (err) {
          return next(err); // 发生错误时处理
        }

        if (!isMatch) {
          return res.send({
            status: 400,
            data: {
              token: null,
              refreshToken: null,
              err: "密码错误",
              success: false,
            },
          });
        }
        // 生成token及refreshToken
        const token = generateToken(email ? { email } : { username });
        const refreshToken = generateReFreshToken(
          email ? { email } : { username }
        );
        res.send({
          sataus: 200,
          data: { token, refreshToken, err: null, success: true },
        });
      });
    })
    .catch((err) => next(err));
};

// 获取所有用户
export const user_list = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  User.find()
    .lean() // 避免 Mongoose Document 类型问题
    .exec()
    .then((user_list: IUser[]) => res.send(user_list))
    .catch((err) => next(err));
};
// callback 模式获取所有用户
// export const user_list = (req: Request, res: Response, next: NextFunction): void => {
//   const callback = req.query.callback; // 获取回调函数名
//   User.find()
//     .lean() // 避免 Mongoose Document 类型问题
//     .exec()
//     .then((user_list: IUser[]) => res.send(`${callback}(${JSON.stringify(user_list)})`))
//     .catch((err) => next(err));
// };

export const get_pubkey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.set("Content-Type", "application/x-pem-file");
  const pub_key = getPubKeyPem();
  res.send({
    data: { pub_key },
    err: null,
    success: true,
  });
};
