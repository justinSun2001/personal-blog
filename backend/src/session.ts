import session from "express-session";
import { getPrivateKeyPem } from "./public/keys"; // 假设这个文件已经使用了TypeScript
declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}
// 获取私钥
const secret: string = getPrivateKeyPem(); // 你的密钥

// Session中间件配置
export const sessionA = session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1小时
    secure: process.env.NODE_ENV === "production",
  },
  name: "justinsun.sid", // 自定义cookie名称
});
