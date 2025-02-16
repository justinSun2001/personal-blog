<template>
  <div class="top">
    <TopBar :in-use1="true"></TopBar>
  </div>
  <div class="head">
    <HeadContent></HeadContent>
  </div>
  <el-divider></el-divider>
  <div class="page">
    <MainContent :current-page="Number(currentPage[0])"></MainContent>
    <div class="side">
      <SideContent :amount="amount"></SideContent>
    </div>
  </div>
  <BottomContent></BottomContent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import http from "@/services/http.ts";

import TopBar from "@/components/TopBar.vue";
import MainContent from "@/components/MainContent.vue";
import HeadContent from "@/components/HeadContent.vue";
import SideContent from "@/components/SideContent.vue";
import BottomContent from "@/components/BottomContent.vue";

// Vue Router
const route = useRoute();
// 响应式变量
const amount = ref<number>(1);
// 计算属性
const currentPage = computed(() => route.params.id as string);
// 生命周期钩子
onMounted(() => {
  http.get("/catalog/data").then((result:any) => {
    amount.value = result.data.article_count - 1;
  });
});
</script>

<style scoped lang="scss">
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
  margin-left: 8px;
  margin-right: 8px;
  background-color: #f9f9fb;
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

/* 修改el-divider的样式 */
.el-divider--horizontal {
  margin: 8px 0;
  background: transparent;
  border-top: 1px solid #e8eaec;
}
</style>
