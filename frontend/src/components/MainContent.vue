<template>
  <div class="main">
    <main-content-item v-if="exist1" :data1="articleData[0] ? articleData[0] : {}"></main-content-item>
    <main-content-item v-if="exist2" :data1="articleData[1] ? articleData[1] : {}"></main-content-item>
    <main-content-item v-if="exist3" :data1="articleData[2] ? articleData[2] : {}"></main-content-item>
    <div class="pageIndex">
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
      v-model:current-page="currentPage" :page-size="3" :pager-count="10" :total="totalPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import MainContentItem from './MainContentItem.vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'MainContent',
  components: {
    MainContentItem,
  },
  setup() {
    const store = useStore();
    const currentPage = ref(store.getters.getCurrentPage);  // 从 store 中获取当前页初始值
    const totalPage = computed(() => store.getters.getArticleCount);

    const exist1 = ref(false);
    const exist2 = ref(false);
    const exist3 = ref(false);
    const articleData = ref(store.getters.getArticleData);
    exist1.value = articleData.value.length > 0;
    exist2.value = articleData.value.length > 1;
    exist3.value = articleData.value.length > 2;

    const handleCurrentChange = (val: number) => {
      // Update page in store
      currentPage.value = val;
      console.log('当前页',currentPage.value);
      store.commit('setCurrentPage', val);
    };

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
  margin: 0 10px;
}
.pageIndex {
  text-align: center;
}
</style>
