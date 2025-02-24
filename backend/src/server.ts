// 所有的 req, res, next 都加上了类型注解
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import createError from "http-errors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import WebSocket, { Server } from "ws";

// 创建 WebSocket 服务器
const wss = new Server({ port: 8080 });

// 定义心跳间隔和超时时间
const HEARTBEAT_INTERVAL = 30000; // 每30秒发送一次 "ping"
const HEARTBEAT_TIMEOUT = 5000; // 超过5秒未收到 "pong"，认为连接断开

// 监听客户端连接
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  // 发送欢迎消息给新连接的客户端
  ws.send("Welcome to the WebSocket chat!");

  let heartbeatTimer: NodeJS.Timeout | null = null;

  // 定时发送 "ping" 消息
  const pingInterval = setInterval(() => {
    console.log("Sending ping to client");
    ws.send("ping");

    // 启动心跳超时检测
    heartbeatTimer = setTimeout(() => {
      console.log("No pong received, closing connection");
      ws.close();
    }, HEARTBEAT_TIMEOUT);
  }, HEARTBEAT_INTERVAL);

  // 接收到客户端消息时广播给所有客户端
  ws.on("message", (message: string) => {
    console.log("received: %s", message);

    // 客户端发送 "ping" 时，返回 "pong"
    if (message == "ping") {
      console.log("Received ping, sending pong");
      ws.send("pong");
    }
    // 客户端发送 "pong" 时，重置心跳超时检测
    else if (message == "pong") {
      console.log("Received pong, resetting timeout");
      if (heartbeatTimer) {
        clearTimeout(heartbeatTimer);
        heartbeatTimer = null;
      }
    } else {
      // 处理消息并返回特定响应
      const responseMessage = `Server received: ${message}`;
      // 向当前客户端发送响应
      ws.send(responseMessage);
    }

    // 如果你想广播给所有其他客户端，可以这样做：
    // wss.clients.forEach(client => {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     (client as WebSocket).send(`Broadcast message: ${message}`);
    //   }
    // });
  });

  // 客户端关闭连接时
  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(pingInterval); // 清理定时器
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
    }
  });

  // 处理错误
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// 加载环境变量
dotenv.config({ path: path.join(__dirname, ".env") });

// 导入路由
import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import catalogRouter from "./routes/catalog";
import { authenticateToken } from "./jwt";

// 初始化 Express
const app = express();

// ✅ 1. 统一 CORS 处理
// 使用 cors 库，避免重复设置 Access-Control-Allow-Origin。
app.use(
  cors({
    // origin: "*", // 允许所有源
    origin: "http://localhost:5173", // 允许特定的源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // 允许携带 cookies 或认证信息
  })
);

// ✅ 2. MongoDB 连接优化
// 从 .env 文件中读取数据库连接配置信息
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, PORT } = process.env;
// 构建 MongoDB 连接字符串
const mongoDB = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}`;

mongoose
  .connect(mongoDB)
  .then(() => console.log("✅ MongoDB 连接成功"))
  .catch((err) => console.error("❌ MongoDB 连接错误:", err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB 连接错误："));

// ✅ 3. 基础中间件
app.use(logger("dev"));
app.use(express.json()); // 解析 JSON 数据
app.use(express.urlencoded({ extended: true })); // 解析表单数据
app.use(cookieParser());
// ✅ 4. 托管静态文件
app.use(express.static(path.join(__dirname, "public")));

// ✅ 5. 视图引擎（如果不需要可删除）
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ✅ 6. 使用路由
app.use("/", indexRouter);
app.use("/user", userRouter);
// app.use("/catalog", authenticateToken, catalogRouter);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
