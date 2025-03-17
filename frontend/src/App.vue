<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { WebSocketService } from '@/services/websocket';
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex';
const store = useStore();
const websocketService = new WebSocketService();
// 建立 WebSocket 连接
onMounted(() => {
  websocketService.connect('ws://localhost:8080'); // 连接到 WebSocket 服务器

  // 设置回调处理接收到的消息
  websocketService.onMessage((msg: string) => {
    ElNotification({
      // title: 'Success',
      message: msg,
      type: 'success',
    });
    if (msg == '有新文章发布了！') {
      store.dispatch("fetchData");
    } else if (msg == '有新文章更新了！') {
      console.log('有新文章更新了！');
      store.commit("setArticleUpdate", true);
    }
  });
});
// 组件卸载时关闭 WebSocket 连接
onBeforeUnmount(() => {
  websocketService.close();
});
</script>

<style lang="scss">
body {
  margin: 0;
  /* 去除 body 默认样式 */
}
</style>
