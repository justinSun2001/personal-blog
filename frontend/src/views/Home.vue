<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="top">
    <TopBar :in-use1="true"></TopBar>
  </div>
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
    <div class="bottom">
      <BottomContent></BottomContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, nextTick } from "vue";
import { useStore } from "vuex";
import http from "@/services/http";

import TopBar from "@/components/TopBar.vue";
import MainContent from "@/components/MainContent.vue";
import HeadContent from "@/components/HeadContent.vue";
import SideContent from "@/components/SideContent.vue";
import BottomContent from "@/components/BottomContent.vue";

import type { myArticle } from "@/types/index";
const store = useStore();
// 请求数据
const fetchArticles = async () => {
  try {
    const articleCount = store.state.articleCount;
    const currentPage = store.getters.getCurrentPage;

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

    // 如果是第一页数据，存储到 Vuex
    if (currentPage === 1 && !store.state.recentArticles.length) {
      store.commit("setRecentArticles", articleData);
    } else if (currentPage === 1 && store.state.recentArticles.length) {
      // 获取当前 Vuex 中的 recentArticles
      const currentArticles: myArticle[] = store.state.recentArticles;
      // 检查文章是否发生变化
      articleData.forEach((newArticle, index) => {
        if (currentArticles[index] == null) {
          store.commit("changeRecentArticles", { index, article: newArticle });
        } else {
          // 过滤出 title 或 genre 中的 name 发生变化的文章
          const genreChanged = currentArticles[index].genre.some(existingGenre =>
            newArticle.genre.some(newGenre =>
              newGenre.name !== existingGenre.name
            )
          );
          // 检查 title 是否相同
          if (currentArticles[index].title !== newArticle.title || genreChanged) {
            store.commit("changeRecentArticles", { index, article: newArticle });
          }
        }
      });
    }

  } catch (err) {
    console.error("获取文章数据失败", err);
  }
};

watch(
  [() => store.getters.getCurrentPage, () => store.getters.getArticleCount], // 监听 currentPage 和 articleCount
  ([newPage, newCount], [oldPage, oldCount]) => {
    // 监听 currentPage 变化
    if (newPage !== oldPage) {
      console.log("currentPage 变化了", oldPage, "=>", newPage);
      fetchArticles()
    }

    // 监听 articleCount 变化
    if (newCount !== oldCount) {
      console.log("articleCount 变化了", oldCount, "=>", newCount);
      store.commit("setRecentArticles", []); // 清空最近文章(用于sidecontent的更新)
    }
  },
  { deep: true }
);


// 生命周期钩子
onMounted(() => {
  store.dispatch("fetchData")       // 获取文章总数等元数据
    .then(() => {
      return fetchArticles();  // fetchArticles 函数返回一个 Promise
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


</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top {
  width: 100%;
  position: fixed;
  z-index: 100;
}

.head {
  padding-top: 54px;
}

.main {
  flex: 1;
  background-color: #f9f9fb;
}

.bottom {
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
  color: black;
  background-color: rgba(0, 0, 0, 0.177);
}

/* 响应式布局 */
@media screen and (min-width: 960px) {
  .page {
    display: flex;
    justify-content: space-between;
  }
}
</style>
