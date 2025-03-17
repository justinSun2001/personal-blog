<template>
  <div style="margin-top: 54px;">
    <h2>Video</h2>


    <div class="chat">
      <h2>WebSocket Chat</h2>
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
    </div>


    <!-- <h2>webworker</h2>
    <div class="circle"></div>
    <p>List Length: {{ listLength }}</p> -->

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, effect } from 'vue'
import { WebSocketService } from '@/services/websocket';
// import { debounce, throttle } from 'lodash'; // 引入 lodash 库中的防抖函数
import { useStore } from 'vuex';
const store = useStore();
onMounted(() => {
  store.commit('setInUse', '3');
})

let count = ref(0)
effect(() => {
  console.log(`数据变化了：${count.value}`)
})
count.value = 1
count = ref(0)
//effect不会监听到此处的变化
count.value = 2
console.log("结束了")
console.log(count)





const websocketService = new WebSocketService();
const messages = ref<string[]>([]); // 用于存储接收到的消息
const message = ref<string>(''); // 输入框的消息内容

// 建立 WebSocket 连接
onMounted(() => {
  websocketService.connect('ws://localhost:8080'); // 连接到 WebSocket 服务器

  // 设置回调处理接收到的消息
  websocketService.onMessage((msg: string) => {
    messages.value.push(msg); // 将接收到的消息添加到消息列表
  });
});

// 发送消息
const sendMessage = () => {
  if (message.value.trim() !== '') {
    websocketService.sendMessage(message.value);
    message.value = ''; // 清空输入框
  }
};

// 组件卸载时关闭 WebSocket 连接
onBeforeUnmount(() => {
  websocketService.close();
});


// const listLength = ref<number>(0);
// // 创建 Web Worker 实例
// let worker: Worker | null = null;

// onMounted(() => {
//   // 创建 Web Worker
//   worker = new Worker(new URL('@/services/webworker.ts', import.meta.url), { type: 'module' });

//   // 接收 Web Worker 返回的数据
//   worker.onmessage = (e) => {
//     listLength.value = e.data;
//     console.log('Worker Response:', e.data);
//   };

//   // 每秒向 worker 发送消息
//   setInterval(() => {
//     worker?.postMessage({});
//   }, 1000);
// });

// onBeforeUnmount(() => {
//   if (worker) {
//     worker.terminate();  // 在组件销毁前停止 Web Worker
//   }
// });



</script>

<style lang="scss" scoped>
.circle {
  width: 300px;
  height: 300px;
  background-color: blue;
  border-radius: 50%;
  position: relative;
  animation: moveRightLeft 2s infinite alternate;
}

@keyframes moveRightLeft {
  from {
    left: 100px;
  }

  to {
    left: 600px;
  }
}
</style>