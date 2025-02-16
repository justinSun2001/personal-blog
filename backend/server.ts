// 所有的 req, res, next 都加上了类型注解
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// 加载环境变量
dotenv.config();

// 导入路由
import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import catalogRouter from "./routes/catalog";

// 初始化 Express
const app = express();

// ✅ 1. 统一 CORS 处理
// 使用 cors 库，避免重复设置 Access-Control-Allow-Origin。
app.use(
  cors({
    origin: "*", // 允许所有源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ 2. MongoDB 连接优化
const mongoDB = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local_library";
mongoose
  .connect(mongoDB)
  .then(() => console.log("✅ MongoDB 连接成功"))
  .catch((err) => console.error("❌ MongoDB 连接错误:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 连接错误："));

// ✅ 3. 基础中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ 4. 托管静态文件
app.use(express.static(path.join(__dirname, "public")));

// ✅ 5. 视图引擎（如果不需要可删除）
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ✅ 6. 使用路由
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/catalog", catalogRouter);

// ✅ 7. 处理 404 错误
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// ✅ 8. 统一错误处理
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({ error: err.message || "服务器内部错误" });
});

export default app;
