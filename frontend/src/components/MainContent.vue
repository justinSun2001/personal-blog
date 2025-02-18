<template>
  <div class="main">
    <main-content-item :index="index" v-if="exist1"></main-content-item>
    <main-content-item :index="index - 1" v-if="exist2"></main-content-item>
    <main-content-item :index="index - 2" v-if="exist3"></main-content-item>
    <div class="pageIndex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="1"
        :pager-count="1"
        :total="totalPage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import MainContentItem from './MainContentItem.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'MainContent',
  components: {
    MainContentItem,
  },
  props: {
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    console.log("传递的当前页面值", props.currentPage);
    const store = useStore();
    const router = useRouter();

    const index = ref(0);
    const totalPage = ref(0);
    const exist1 = ref(false);
    const exist2 = ref(false);
    const exist3 = ref(false);

    const updateIndex = () => {
      const articleCount = store.state.articleCount;
      console.log("文章总数", articleCount);
      totalPage.value = articleCount / 3;
      index.value = articleCount - (props.currentPage * 3 - 2);
      exist1.value = index.value >= 0;
      exist2.value = index.value >= 1;
      exist3.value = index.value >= 2;
    };

    // Watch for changes in currentPage prop
    watchEffect(() => {
      updateIndex();
    });

    const handleCurrentChange = (currentPage: number) => {
      // Update page in store
      store.commit('setCurrentPage', currentPage);
      // Update the route
      router.push({ path: `/home/${currentPage}` });
      // Fetch the data again
      updateIndex();
    };

    // Initial fetch when component is created
    updateIndex();

    return {
      index,
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
.pageIndex {
  text-align: center;
}
</style>
