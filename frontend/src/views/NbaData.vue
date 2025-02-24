<template>
  <div class="top">
    <TopBar />
  </div>
  <div style="margin-top: 54px;">
    <p>计数器:{{ count }}</p>
    <button @click="increment">+</button>

    <p>计数器二:{{ count2 }}</p>
    <button @click="count2++">+</button>
    <br>
    {{ typeof user.name }}
    <p>变化:{{ user.age }}</p>
    <input v-model="user.age">
    <p>变化:{{ user.name }}</p>
    <input type="text" v-model.number="user.name">

    <div class="chat">
      <h2>WebSocket Chat</h2>
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
    </div>

    <h2>分页防抖/节流</h2>
    <h3>{{ currentPage }}</h3>
    <div v-loading="loading" element-loading-text="Loading..." style="display: inline-block;">
      <button v-for="page in totalPages" :key="page" style="cursor: pointer; " @click="handlePageChange(page)">{{ page
      }}</button>
    </div>

    <h2>reactive结构赋值</h2>
    <p>{{ user1.name }}</p>
    <button @click="changeName">Change Name</button>

    <h2>webworker</h2>
    <div class="circle"></div>
    <!-- 打印 Web Worker 返回的数据 -->
    <p>List Length: {{ listLength }}</p>

    <h2>钩子函数</h2>
    <div style="height: 200px; width: 200px; background-color: beige;" ref="el"></div>

  </div>
</template>
<script setup lang="ts">
import { reactive, ref, toRefs, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import { WebSocketService } from '@/services/websocket';
// import { debounce, throttle } from 'lodash'; // 引入 lodash 库中的防抖函数
import TopBar from '@/components/TopBar.vue'
import { useEventListener } from '@/hooks/useEventListener';
const count = ref(0)
const count2 = ref(0)
const increment = () => {
  count.value++
}
//这里自动转化成reactive对象，响应式数据结构 
// 当您使用 ref 创建一个对象或数组时，Vue 实际上会在内部使用 reactive 来使该对象或数组成为响应式的。但是，您需要通过 .value 属性来访问或修改这个响应式数据。
const user = reactive({
  name: 'zhangsan',
  age: 18
})
watch(count, (newValue, oldValue) => {
  //state状态的改变
  console.log('count 改变了')
  console.log(newValue, oldValue)
  if (count.value > 2) {
    console.log('太大了')
  }
}, { immediate: true, deep: true })

watchEffect(() => {
  console.log(`count 的值是${count.value}`)
  console.log(`count2 的值是${count2.value}`)
  console.log(`user 的值是${user.name}`)
})
watch(user, (newValue, oldValue) => {
  console.log(newValue)
  console.log(oldValue)
  console.log(`user 的值是${newValue.name}`)//隐式类型转化
}, {
  immediate: false,
  deep: false
})


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


const currentPage = ref(1);
const totalPages = ref(10);
// 加载状态
const loading = ref(false);

const fetchData = async (page: number) => {
  // 模拟异步请求
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log(`Fetching data for page ${page}`);
      // 更新页面内容
      currentPage.value = page;
      resolve();
    }, 500);
  });
};

// const handlePageChange = debounce(async (page) => {
//   await fetchData(page);
// }, 300);

// const handlePageChange = throttle(async (page) => {
//   await fetchData(page);
// }, 500);

const handlePageChange = async (page: number) => {
  // 请求开始，设置 loading 为 true
  loading.value = true;
  try {
    await fetchData(page);
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // 请求结束，设置 loading 为 false
    loading.value = false;
  }
};


const user1 = reactive({ name: [1, 2, 3] });
// 解构赋值，保持响应式
const { name } = toRefs(user1);

const changeName = () => {
  user1.name = [2, 2, 3];
  console.log(name.value);
};


const listLength = ref<number>(0);
// 创建 Web Worker 实例
let worker: Worker | null = null;

onMounted(() => {
  // 创建 Web Worker
  worker = new Worker(new URL('@/services/webworker.ts', import.meta.url), { type: 'module' });

  // 接收 Web Worker 返回的数据
  worker.onmessage = (e) => {
    listLength.value = e.data;
    console.log('Worker Response:', e.data);
  };

  // 每秒向 worker 发送消息
  setInterval(() => {
    worker?.postMessage({});
  }, 1000);
});

onBeforeUnmount(() => {
  if (worker) {
    worker.terminate();  // 在组件销毁前停止 Web Worker
  }
});

const el = ref();
const click = () => {
  console.count('click');
}
useEventListener(el, 'click', click)

</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  position: fixed;
  top: 0;
  background-color: white;
  z-index: 100;
}

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