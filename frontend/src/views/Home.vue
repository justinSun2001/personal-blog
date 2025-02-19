<template>
  <div class="top">
    <TopBar :in-use1="true"></TopBar>
  </div>
  <div class="container">
    <div class="head">
      <HeadContent></HeadContent>
    </div>
    <el-divider></el-divider>
    <div class="page">
      <MainContent v-if="dataLoaded"></MainContent>
      <div class="side">
        <SideContent v-if="dataLoaded"></SideContent>
      </div>
    </div>
    <div class="bottom">
      <BottomContent></BottomContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import http from "@/services/http";

import TopBar from "@/components/TopBar.vue";
import MainContent from "@/components/MainContent.vue";
import HeadContent from "@/components/HeadContent.vue";
import SideContent from "@/components/SideContent.vue";
import BottomContent from "@/components/BottomContent.vue";

const store = useStore();
// 标记数据是否加载完成
const dataLoaded = ref(false);
// 计算属性
const currentPage = store.getters.getCurrentPage;

// 请求数据
const fetchArticles = async () => {
  try {
    const result: any = await http.get('/catalog/articlesData');
    const articleCount = store.state.articleCount;
    console.log("文章总数", articleCount);
    console.log("当前页", currentPage);

    const startIndex = articleCount - (Number(currentPage) * 3 - 2);
    console.log("起始索引", startIndex);

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

    // 使用 Promise.all 来请求对应的文章数据
    const articleDataList = await Promise.all(
      requestedIndexes.map(async (index) => {
        const article = result[index];
        if (article) {
          // 发送请求获取文章数据
          const res: any = await http.get(`/catalog/articlesData/${article._id}`);
          const articleData = res.article;
          return {
            title: articleData.title,
            message: articleData.summary,
            date: articleData.date,
            url: `http://localhost:3000${articleData.path}`,
            id: articleData._id,
            genre: articleData.genre,
          };
        }
      })
    );

    // 一旦所有请求都完成，将结果存储到 articleData 数组中
    const articleData= articleDataList.filter(item => item !== undefined); // 确保移除任何 null 或 undefined 数据
    store.commit("setArticleData", articleData);
  } catch (err) {
    console.error("获取文章数据失败", err);
  }
};


// 生命周期钩子
onMounted(() => {
  store.dispatch("fetchData")
    .then(() => {
      // 调用 fetchArticles 并确保它的所有异步请求都完成
      return fetchArticles();  // fetchArticles 函数返回一个 Promise
    })
    .then(() => {
      // 当 fetchArticles 完成后，设置 dataLoaded 为 true
      dataLoaded.value = true;
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
  height: calc(100vh - 54px); // 这里 54px 是 TopBar 的固定高度
}

.top {
  width: 100%;
  position: fixed;
  background-color: white;
  z-index: 100;
}

.head {
  padding-top: 54px;
}

.page {
  flex: 1;
  background-color: #f9f9fb;
}

.bottom {
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
}

/* 响应式布局 */
@media screen and (min-width: 960px) {
  .page {
    display: flex;
    justify-content: space-between;
  }

  .side {
    margin-left: 50px;
  }
}
</style>
