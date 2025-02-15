<template>
  <div class="main">
    <main-content-item :index="index"></main-content-item>
    <main-content-item :index="index - 1" v-if="exist1"></main-content-item>
    <main-content-item :index="index - 2" v-if="exist2"></main-content-item>
    <div class="pageIndex">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="1"
        :pager-count="5"
        :total="total"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import MainContentItem from './MainContentItem.vue';

export default defineComponent({
  name: 'MainContent',
  components: {
    MainContentItem,
  },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const index = ref(1);
    const total = ref(8);
    const exist1 = ref(true);
    const exist2 = ref(true);

    const updateIndex = () => {
      axios.get('/catalog/data').then((result) => {
        total.value = result.data.article_count / 3;
        index.value = result.data.article_count - (props.currentPage * 3 - 2);
        exist1.value = index.value - 1 >= 0;
        exist2.value = index.value - 2 >= 0;
      });
    };

    // Watch for changes in currentPage prop
    watchEffect(() => {
      updateIndex();
    });

    const handleCurrentChange = (currentPage: number) => {
      // Update page in store
      this.$store.commit('setCurrentPage', currentPage);

      // Update the route
      this.$router.push({ path: `/home/${currentPage}` });

      // Fetch the data again
      updateIndex();
    };

    // Initial fetch when component is created
    updateIndex();

    return {
      index,
      total,
      exist1,
      exist2,
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
