<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <h1>Local Library Home
    </h1>
    <p>欢迎来到本地文章后台数据管理系统</p>
    <h1>Dynamic content</h1>
    <p>暂时包含以下内容:</p>
    <ul>
      <li><strong>文章总数: </strong>{{ data.article_count }}</li>
      <li><strong>作者总数: </strong>{{ data.author_count }}</li>
      <li><strong>类型总数: </strong>{{ data.genre_count }}</li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import http from '@/services/http'
import { onMounted, reactive } from 'vue';
import type { ArticleList } from '@/types/index';
import { useStore } from 'vuex';
const store = useStore();
const data = reactive({
  article_count: 0,
  author_count: 0,
  genre_count: 0,
});
const getTotalData = async () => {
  try {
    const result: ArticleList = await http.get('/catalog/data');
    data.article_count = result.article_count;
    data.author_count = result.author_count;
    data.genre_count = result.genre_count;
  } catch (error) {
    console.error("获取全部数据失败", error);
  }
}
onMounted(() => {
  getTotalData();
  store.dispatch('updateActiveMenuKey', '1')
})

</script>
<style lang="scss" scoped>
ul {
  margin-left: 30px;
}

li {
  list-style: disc;
}
</style>