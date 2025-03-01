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
  // ws.send("Welcome to the WebSocket chat!");

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

// 导出 WebSocket 服务器实例
export const startWebSocketServer = () => {
  console.log("WebSocket Server is running on ws://localhost:8080");
  return wss;
};

// 监听外部模块调用
export const sendToClients = (message: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
