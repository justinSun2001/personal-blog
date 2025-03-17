<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="container">
    <div class="head">
      <HeadContent></HeadContent>
    </div>
    <div class="main">
      <el-divider></el-divider>
      <div class="page">
        <MainContent></MainContent>
        <SideContent></SideContent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick, onActivated } from "vue";
import { useStore } from "vuex";
import http from "@/services/http";
import MainContent from "@/components/homedata/MainContent.vue";
import HeadContent from "@/components/homedata/HeadContent.vue";
import SideContent from "@/components/SideContent.vue";

import type { myArticle } from "@/types/index";
const store = useStore();
// 请求数据
const fetchArticles = async () => {
  try {
    const articleCount = store.state.articleCount;
    const currentPage = store.getters.getCurrentPage;
    if (currentPage === 1 && store.getters.getRecentArticles.length > 0 && !store.getters.getArticleUpdate) {
      store.commit("setArticleData", store.getters.getRecentArticles);
      return
    }
    const startIndex = articleCount - (Number(currentPage) * 3 - 2);
    // 这里可以使用一个数组来存储请求的文章
    const requestedIndexes = [];
    if (startIndex >= 2) {
      // 如果 index 大于等于 2，按顺序请求 3 个文章
      requestedIndexes.push(startIndex, startIndex - 1, startIndex - 2);
    } else {
      // 否则根据实际情况请求对应数量的文章
      if (startIndex >= 1) {
        requestedIndexes.push(startIndex, startIndex - 1);
      } else {
        requestedIndexes.push(startIndex);
      }
    }
    // 合并请求对应的文章数据(？用来创建唯一标识区分不同页的响应)
    const articleDataList: myArticle[] = await http.post(`/catalog/articlesData?${currentPage}`, requestedIndexes);
    // 一旦所有请求都完成，将结果存储到 articleData 数组中
    const articleData = articleDataList.filter(item => item !== undefined); // 确保移除任何 null 或 undefined 数据
    store.commit("setArticleData", articleData);

  } catch (err) {
    console.error("获取文章数据失败", err);
  }
};
// 请求数据
const fetchRencentArticles = async () => {
  try {
    const articleCount = store.state.articleCount;
    const startIndex = articleCount - 1;
    // 这里可以使用一个数组来存储请求的文章
    const requestedIndexes = [];
    if (startIndex >= 2) {
      // 如果 index 大于等于 2，按顺序请求 3 个文章
      requestedIndexes.push(startIndex, startIndex - 1, startIndex - 2);
    } else {
      // 否则根据实际情况请求对应数量的文章
      if (startIndex >= 1) {
        requestedIndexes.push(startIndex, startIndex - 1);
      } else {
        requestedIndexes.push(startIndex);
      }
    }
    // 合并请求对应的文章数据(？用来创建唯一标识区分不同页的响应)
    const articleDataList: myArticle[] = await http.post(`/catalog/articlesData?1`, requestedIndexes);
    // 一旦所有请求都完成，将结果存储到 articleData 数组中
    const articleData = articleDataList.filter(item => item !== undefined); // 确保移除任何 null 或 undefined 数据
    store.commit("setRecentArticles", articleData);

  } catch (err) {
    console.error("获取文章数据失败", err);
  }
};

watch(
  [() => store.getters.getCurrentPage, () => store.getters.getArticleCount], // 监听 currentPage 和 articleCount
  ([newPage, newCount], [oldPage, oldCount]) => {
    // 监听 currentPage 变化
    if (newCount !== oldCount) {
      fetchRencentArticles()
    }
    if ((newPage !== oldPage)) {
      fetchArticles()
    }
  },
  { deep: true }
);

// 生命周期钩子
onMounted(() => {
  store.commit('setInUse', '1');
  store.dispatch("fetchData")       // 获取文章总数等元数据
    .then(() => {
      fetchRencentArticles();  // fetchArticles 函数返回一个 Promise
      fetchArticles();  // fetchArticles 函数返回一个 Promise
    })
    .then(() => {
      // DOM更新后恢复滚动
      nextTick(() => {
        const scrollPosition = store.getters.getScrollPosition;
        document.documentElement.scrollTo(0, scrollPosition)
      })
    })
    .catch((error) => {
      console.error('Failed to fetch data:', error);
    });
});

// Todo: 只对更新的数据进行重新获取
onActivated(() => {
  console.log('组件激活');
  store.commit('setInUse', '1');
  console.log(store.getters.getArticleUpdate);
  if (store.getters.getArticleUpdate) {
    console.log('有新文章更新了！');
    fetchArticles()
    store.commit("setArticleUpdate", false);
  }
})

</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  background-color: #f9f9fb;
}

/* 响应式布局 */
@media screen and (min-width: 960px) {
  .page {
    display: flex;
    justify-content: space-between;
  }
}
</style>
