// src/services/websocket.ts
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallback: (message: string) => void = () => { }; // 默认回调为空
  private heartbeatInterval: number | null = null; // 定时器ID
  private readonly HEARTBEAT_INTERVAL = 30000; // 每30秒发送一次心跳
  private readonly HEARTBEAT_TIMEOUT = 5000; // 超过5秒未收到响应，认为连接断开
  private heartbeatTimer: number | null = null; // 心跳超时定时器ID

  // 连接 WebSocket 服务器
  connect(url: string) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('Connected to WebSocket server');
      this.startHeartbeat();
    };

    this.socket.onmessage = (event: MessageEvent) => {
      if (event.data === 'pong') {
        console.log('Received pong, resetting heartbeat');
        this.resetHeartbeat();
      } else if (event.data === 'ping') {
        console.log('Received ping, sending pong');
        this.socket?.send('pong');
      } else {
        console.log('Received message:', event.data);
        if (this.messageCallback) {
          this.messageCallback(event.data);
        }
      }
    };

    this.socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
      this.stopHeartbeat();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  // 启动心跳定时器，定期发送 "ping"
  private startHeartbeat() {
    if (!this.socket) return;
    console.log('Starting heartbeat...');

    this.heartbeatInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        console.log('Sending ping to server');
        this.socket.send('ping');
        // 启动心跳超时检测
        this.heartbeatTimer = setTimeout(() => {
          console.log('Connection timeout, closing WebSocket');
          this.socket?.close();
        }, this.HEARTBEAT_TIMEOUT);
      } else {
        console.log('WebSocket not open, cannot send ping');
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  // 重置心跳超时
  private resetHeartbeat() {
    console.log('Received pong, resetting timeout');
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 停止心跳机制
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.heartbeatTimer) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 设置接收到消息时的回调
  onMessage(callback: (message: string) => void) {
    console.log('onMessage', callback);
    this.messageCallback = callback;
  }

  // 发送消息到服务器
  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  // 关闭 WebSocket 连接
  close() {
    if (this.socket) {
      this.socket.close();
      this.stopHeartbeat();
    }
  }
}