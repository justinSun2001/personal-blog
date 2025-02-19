<template>
  <div class="main">
    <main-content-item v-if="exist1" :data1="articleData[0] ? articleData[0] : {}"></main-content-item>
    <main-content-item v-if="exist2" :data1="articleData[1] ? articleData[1] : {}"></main-content-item>
    <main-content-item v-if="exist3" :data1="articleData[2] ? articleData[2] : {}"></main-content-item>
    <div class="pageIndex">
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="1" :pager-count="1" :total="totalPage" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MainContentItem from './MainContentItem.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainContent',
  components: {
    MainContentItem,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const currentPage = ref(store.getters.getCurrentPage);
    const totalPage = ref(Math.ceil(store.getters.getArticleCount / 3));
    console.log(totalPage.value);
    const exist1 = ref(false);
    const exist2 = ref(false);
    const exist3 = ref(false);
    const articleData = ref(store.getters.getArticleData);
    exist1.value = articleData.value.length > 0;
    exist2.value = articleData.value.length > 1;
    exist3.value = articleData.value.length > 2;
    console.log(exist1.value);
    console.log(exist2.value);
    console.log(exist3.value);

    const handleCurrentChange = (currentPage: number) => {
      // Update page in store
      store.commit('setCurrentPage', currentPage);
      // Update the route
      router.push({ path: `/home/${currentPage}` });
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
