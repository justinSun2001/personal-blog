<template>
  <div class="main">
    <div class="pageContent">
      <main-content-item v-if="exist1" :data="articleData[0] ? articleData[0] : {}"></main-content-item>
      <main-content-item v-if="exist2" :data="articleData[1] ? articleData[1] : {}"></main-content-item>
      <main-content-item v-if="exist3" :data="articleData[2] ? articleData[2] : {}"></main-content-item>
      <!-- <transition-group name="fade" tag="div">
        <main-content-item v-for="item in articleData" :key="item.id" :data="item"></main-content-item>
      </transition-group> -->
    </div>
    <div class="pageIndex">
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size=3 :pager-count=9 :total="totalPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeUnmount } from 'vue';
import MainContentItem from './MainContentItem.vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'MainContent',
  components: {
    MainContentItem,
  },
  setup() {
    const store = useStore();
    const currentPage = computed(() => store.getters.getCurrentPage);
    const totalPage = computed(() => store.getters.getArticleCount);

    const exist1 = computed(() => articleData.value.length > 0);
    const exist2 = computed(() => articleData.value.length > 1);
    const exist3 = computed(() => articleData.value.length > 2);
    const articleData = computed(() => store.getters.getArticleData);

    const handleCurrentChange = (val: number) => {
      // 2. 保存当前页
      console.log('当前页2', currentPage.value);
      store.commit('setCurrentPage', val);
    };

    onBeforeUnmount(() => {
      // 1. 保存当前滚动位置
      const scrollPosition =
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log('滚动位置2', scrollPosition);
      store.commit('setScrollPosition', scrollPosition);
    })

    return {
      articleData,
      currentPage,
      totalPage,
      exist1,
      exist2,
      exist3,
      handleCurrentChange,
    };
  },
});
</script>

<style scoped lang="scss">
.main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 10px;
}
</style>
