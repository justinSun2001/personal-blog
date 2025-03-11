<template>
  <div class="container">
    <h1>作者列表</h1>
    <!-- 使用 v-for 指令遍历列表 -->
    <ul>
      <li v-for="author in data" :key="author._id">
        <!-- 为每一项添加超链接 -->
        <div>
          <!-- 显示作者 -->
          <a @click="editAuthor(author._id)" class="link">({{ author.first_name }} {{
            author.family_name
          }})</a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import http from '@/services/http'
import { onMounted, reactive } from 'vue';
import type { Author } from '@/types/index';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const router = useRouter();
const store = useStore();

const data = reactive<Author[]>([]);

// 定义异步函数获取数据
const getTotalData = async () => {
  try {
    // 发送 HTTP 请求获取数据
    const authors: Author[] = await http.get('/catalog/authors');
    // 将响应数据赋值给 data
    data.push(...authors);
  } catch (error) {
    // 处理请求错误
    console.error('获取作者数据失败:', error);
  }
};

const editAuthor = (id: string) => {
  router.push(`/userdata/author/${id}`);
}

onMounted(() => {
  getTotalData();
  store.dispatch('updateActiveMenuKey', '2-2')
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