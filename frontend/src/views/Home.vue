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
      <MainContent v-if="dataLoaded" :current-page="Number(currentPage)"></MainContent>
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
import { ref, computed, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import TopBar from "@/components/TopBar.vue";
import MainContent from "@/components/MainContent.vue";
import HeadContent from "@/components/HeadContent.vue";
import SideContent from "@/components/SideContent.vue";
import BottomContent from "@/components/BottomContent.vue";

// Vue Router
const route = useRoute();
const store = useStore();
// 标记数据是否加载完成
const dataLoaded = ref(false);
// 计算属性
const currentPage = computed(() => route.params.id as string);
// 生命周期钩子
onBeforeMount(() => {
  store.dispatch("fetchData").then(() => {
    // 数据加载完成后，将 dataLoaded 设置为 true
    dataLoaded.value = true;
  }).catch((error) => {
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
  margin-left: 8px;
  margin-right: 8px;
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
