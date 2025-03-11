<template>
  <div class="page">
    <div class="head">
      <el-select v-model="selectedGenreID" placeholder="选择类别" style="width: 240px">
        <el-option v-for="item in genres" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
    </div>
    <div class="main">
      <div class="text-right" v-for="(item, index) in data" :key="index">
        <div class="text-container">
          <a class="text" @click="itemClick(index)">{{ item.summary }}</a>
        </div>
      </div>
    </div>
    <div class="pageIndex">
      <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
        :current-page="currentPage" :page-size="pageSize" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import http from '@/services/http'
import type { mySummary, myGenre } from '@/types/index'
const router = useRouter()
const store = useStore()

const selectedGenreID = ref('All')
const genres = ref<myGenre[]>([])

// Using refs to declare data variables
const total = computed(() => store.getters.getArticleCount)
const currentPage = computed(() => store.getters.getCurrentPage1)
const pageSize = ref(14)

const data = reactive<mySummary[]>([])

const fetchData = async () => {
  const result: mySummary[] = await http.post('/catalog/summaryData', { currentPage: currentPage.value, pageSize: pageSize.value, selectedGenreID: selectedGenreID.value })
  data.splice(0, data.length, ...result);
}

// 定义异步函数获取数据
const getGenres = async () => {
  try {
    // 发送 HTTP 请求获取数据
    const mygenres: myGenre[] = await http.get('/catalog/genres');
    // 默认添加 "All" 选项，并将其设置为选中状态
    const allOption: myGenre = { _id: 'All', name: 'All' };  // 假设 Genre 对象有 id 和 name 属性
    genres.value = [allOption, ...mygenres]; // 将 "All" 选项添加到开头
  } catch (error) {
    // 处理请求错误
    console.error('获取类别数据失败:', error);
  }
};

// Watch for currentPage changes to refetch the data
watch(() => ({ currentPage: currentPage.value, total: total.value, selectedGenreID: selectedGenreID.value }), fetchData, { immediate: true })

// Handling item click navigation
const itemClick = (n: number) => {
  const id = data[n]._id
  router.push({
    path: `/articles/${id}`
  })
}

// Handling page change
const handleCurrentChange = (currentPage: number) => {
  store.commit('setCurrentPage1', currentPage);
}

onBeforeMount(() => {
  getGenres();
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.head {
  margin-top: 10px;
}

.main {
  background-color: #f9f9fb;
  flex: 1;
  margin: 20px 0;
}

.text-right:hover {
  background-color: whitesmoke;
}

.text-container {
  background-color: #f9f9fb;
  border-bottom: 1px solid rgb(191, 185, 185);
  padding-left: 5px;
  height: 3em;
  line-height: 3em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

a:hover {
  text-decoration: underline;
  color: rgb(10, 26, 26);
}

.text {
  cursor: pointer;
}

.pageIndex {
  text-align: center;
  margin-bottom: 30px;
}
</style>
