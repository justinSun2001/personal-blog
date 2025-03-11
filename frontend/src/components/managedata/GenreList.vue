<template>
  <div class="container">
    <h1>类别列表</h1>
    <!-- 使用 v-for 指令遍历列表 -->
    <ul>
      <li v-for="genre in data" :key="genre._id">
        <!-- 为每一项添加超链接 -->
        <div>
          <!-- 显示类别 -->
          <a @click="editGenre(genre._id)" class="link">{{ genre.name }}</a>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">

import http from '@/services/http'
import { onMounted, reactive } from 'vue';
import type { Genre } from '@/types/index';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();

const data = reactive<Genre[]>([]);

// 定义异步函数获取数据
const getTotalData = async () => {
  try {
    // 发送 HTTP 请求获取数据
    const genres: Genre[] = await http.get('/catalog/genres');
    // 将响应数据赋值给 data
    data.push(...genres);
  } catch (error) {
    // 处理请求错误
    console.error('获取类别数据失败:', error);
  }
};

const editGenre = (id: string) => {
  router.push(`/userdata/genre/${id}`);
}

onMounted(() => {
  getTotalData();
  store.dispatch('updateActiveMenuKey', '2-3')
})

</script>
<style lang="scss" scoped>
ul {
  margin-left: 30px;
}

li {
  list-style: disc;
}

.link {
  color: blue;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 10px #000;
}
</style>