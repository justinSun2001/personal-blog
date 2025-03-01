<template>
  <div class="container">
    <h1>文章列表</h1>
    <!-- 使用 v-for 指令遍历文章列表 -->
    <ul>
      <li v-for="article in data" :key="article._id">
        <!-- 为每一项添加超链接，这里假设链接到文章详情页，路径为 article.path -->
        <div>
          <!-- 显示文章标题和作者 -->
          <a @click="editArticle(article._id)" class="link1">{{ article.title }}</a> ---
          <a @click="editAuthor(article.author._id)" class="link2">({{ article.author.first_name }} {{
            article.author.family_name
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
interface myArticle {
  _id: string;
  title: string;
  author: Author;
}
const data = reactive<myArticle[]>([]);
// 定义异步函数获取文章数据
const getTotalData = async () => {
  try {
    // 发送 HTTP 请求获取文章数据
    const articles: myArticle[] = await http.get('/catalog/articles');
    // 将响应数据赋值给 data
    data.push(...articles);
  } catch (error) {
    // 处理请求错误
    console.error('获取文章数据失败:', error);
  }
};
const editArticle = (id: string) => {
  router.push(`/userdata/article/${id}`);
}
const editAuthor = (id: string) => {
  router.push(`/userdata/author/${id}`);
}
onMounted(() => {
  getTotalData();
  store.dispatch('updateActiveMenuKey', '2-1')
})

</script>
<style lang="scss" scoped>
ul {
  margin-left: 30px;
}

li {
  list-style: disc;
}

.link1 {
  color: blue;
}

.link2 {
  color: red;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 10px #000;
}
</style>