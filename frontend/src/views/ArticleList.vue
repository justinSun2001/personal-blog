<template>
  <div class="top">
    <top-bar :inUse2="true" />
  </div>
  <div class="page">
    <div class="head">
      <el-select v-model="selectedGenre" placeholder="选择类别" style="width: 240px">
        <el-option v-for="item in genres" :key="item._id" :label="item.name" :value="item.name" />
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
    <div class="bottom">
      <BottomContent></BottomContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import BottomContent from '@/components/BottomContent.vue'
import { ref, watch, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import http from '@/services/http'
import type { mySummary, Genre } from '@/types/index'
const router = useRouter()
const store = useStore()

const selectedGenre = ref('')
const genres = ref<Genre[]>([])

// Using refs to declare data variables
const total = computed(() => store.getters.getArticleCount)
const currentPage = computed(() => store.getters.getCurrentPage1)
const pageSize = ref(14)

const data = reactive<mySummary[]>([])

// Method to fetch articles
const fetchData = async () => {
  const requestedIndexes: number[] = [];
  // 获取分页的起始索引和结束索引
  const startIndex = total.value - (currentPage.value - 1) * pageSize.value - 1;
  const size = (total.value - (currentPage.value - 1) * pageSize.value) >= pageSize.value ? pageSize.value : total.value - (currentPage.value - 1) * pageSize.value;
  // 生成请求的索引数组
  for (let i = 0; i < size; i++) {
    requestedIndexes.push(startIndex - i);
  }
  const result: mySummary[] = await http.post('/catalog/summaryData', requestedIndexes)
  Object.assign(data, result)

}


// Watch for currentPage changes to refetch the data
watch(() => ({ currentPage: currentPage.value, total: total.value }), fetchData, { immediate: true })

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
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  position: fixed;
  z-index: 100;
}

.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.head {
  padding-top: 54px;
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

.bottom {
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
  color: black;
  background-color: rgba(0, 0, 0, 0.177);
}
</style>
