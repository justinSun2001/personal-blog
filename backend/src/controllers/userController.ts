import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user";
import { getPubKeyPem, privateDecrypt } from "../public/keys";
import { generateToken, generateReFreshToken } from "../jwt";
import bcrypt from "bcryptjs"; // 引入bcryptjs
import { send } from "../email";
// 扩展 Request 类型，添加 user 属性
type User = { username: string } | { email: string };
// 存储验证码的 Map，key 是邮箱，value 是验证码及过期时间
const codeStorage: Map<string, { code: string; expireAt: number }> = new Map();

const generateCode = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    // 随机从 chars 中选择一个字符并拼接
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// 无感刷新时返回的token
export const refreshed_token = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, username } = req.user as { email: string; username: string }; // 明确断言类型
  // 新token
  const token = generateToken(email ? { email } : { username });
  res.send({
    data: {
      token
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
  const code = req.body.code;

  // 检查 email 是否已存在
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        // 如果 email 已存在，返回错误消息
        return res.status(400).send({
          status: 400,
          data: { err: "邮箱已存在", success: false },
        });
      }

      // 检查 username 是否已存在
      return User.findOne({ username }).then((existingUserByUsername) => {
        if (existingUserByUsername) {
          // 如果 username 已存在，返回错误消息
          return res.status(400).send({
            status: 400,
            data: { err: "用户名已存在", success: false },
          });
        }
        // 1. 验证验证码是否存在和匹配
        const storedData = codeStorage.get(email) as {
          code: string;
          expireAt: number;
        };

        if (!storedData) {
          return res.status(400).send({
            status: 400,
            data: { err: "验证码不存在或已过期", success: false },
          });
        }

        // 2. 检查验证码是否过期
        if (Date.now() > storedData.expireAt) {
          // 验证码过期，删除存储的验证码
          codeStorage.delete(email);
          return res.status(400).send({
            status: 400,
            data: { err: "验证码已过期", success: false },
          });
        }

        // 3. 检查验证码是否匹配
        if (storedData.code.toLowerCase() !== code.toLowerCase()) {
          return res.status(400).send({
            status: 400,
            data: { err: "验证码不匹配", success: false },
          });
        }

        // 验证通过后，删除验证码
        codeStorage.delete(email);
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
        req.session.user = {
          id: user._id,
          username: username,
          loginAt: new Date(),
        };
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

// 获取公钥
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

// 获取验证码
export const get_code = (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send({
      data: null,
      err: "Email is required",
      status: 400,
    });
  }
  User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      // 如果 email 已存在，返回错误消息
      return res.status(400).send({
        status: 400,
        data: { err: "邮箱已存在", success: false },
      });
    } else {
      // 生成验证码
      const code = generateCode();
      const expireAt = Date.now() + 5 * 60 * 1000; // 设置验证码 5 分钟后过期

      // 存储验证码到 Map 中
      codeStorage.set(email, { code, expireAt });

      // 发送验证码邮件
      send(email, code)
        .then(() => {
          res.send({
            data: { message: "验证码已发送", success: true },
            err: null,
            status: 200,
          });
        })
        .catch((err: unknown) => {
          console.error("Error sending email:", err);
          res.status(500).send({
            data: { success: false },
            err: "发送验证码失败",
            status: 500,
          });
        });
    }
  });
};
