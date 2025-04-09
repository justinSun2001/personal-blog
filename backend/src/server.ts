// 所有的 req, res, next 都加上了类型注解
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import mysql from "mysql2/promise"; // 引入 mysql2/promise 库
import { startWebSocketServer } from "./websocketServer"; // 导入 WebSocket 服务器
// 加载环境变量
dotenv.config({ path: path.join(__dirname, ".env") });

// 导入路由
import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import catalogRouter from "./routes/catalog";
import ocrRouter from "./routes/ocr";

import { authenticateToken } from "./jwt";
import { sessionA } from "./session";
import { fileURLToPath } from "url";

// 初始化 Express
const app = express();
app.use(sessionA);
// ✅ 1. 统一 CORS 处理
// 使用 cors 库，避免重复设置 Access-Control-Allow-Origin。
app.use(
  cors({
    // origin: "*", // 允许所有源
    origin: "http://localhost:5173", // 允许特定的源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "if-none-match",
    ],
    credentials: true, // 允许携带 cookies 或认证信息
  })
);

// ✅ 2. MongoDB 连接优化
// 从 .env 文件中读取数据库连接配置信息
const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  PORT,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;
// 构建 MongoDB 连接字符串
const mongoDB = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}`;

mongoose
  .connect(mongoDB)
  .then(() => console.log("✅ MongoDB 连接成功"))
  .catch((err) => console.error("❌ MongoDB 连接错误:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 连接错误："));

// ✅ 添加 MySQL 数据库连接
const mysqlConfig = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
};

const mysqlPool = mysql.createPool(mysqlConfig);

mysqlPool
  .getConnection()
  .then((connection) => {
    console.log("✅ MySQL 连接成功");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ MySQL 连接错误:", err);
  });

// 将 MySQL 连接池挂载到 Express 应用上，方便在路由中使用
app.set("mysqlPool", mysqlPool);

// ✅ 3. 基础中间件
app.use(logger("dev"));
app.use(express.json()); // 解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 解析表单数据
app.use(cookieParser());
// ✅ 4. 托管静态文件
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      // 获取文件所在的文件夹名
      const folderName = path.basename(path.dirname(filePath));
      // 获取文件名
      const filename = path.basename(filePath);
      if (folderName == "files") {
        // 避免中文或特殊字符乱码
        const encodedFileName = encodeURIComponent(filename);
        res.setHeader(
          "Content-Disposition",
          `attachment; filename*=UTF-8''${encodedFileName}`
        );
      }
    },
  })
);

// ✅ 5. 视图引擎（如果不需要可删除）
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ✅ 6. 使用路由
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/catalog", authenticateToken, catalogRouter);
app.use("/ocr", ocrRouter);

// ✅ 7. 处理 404 错误
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// ✅ 8. 统一错误处理
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({ error: err.message || "服务器内部错误" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
startWebSocketServer();

export default app;
