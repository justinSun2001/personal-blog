<template>
  <div class="pageList">
    <div class="head">
      <el-select v-model="selectedGenreID" placeholder="选择类别" style="width: 240px">
        <el-option v-for="item in genres" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
      <!-- 添加搜索框 -->
      <el-input v-model="searchQuery" placeholder="搜索..." style="width: 240px; margin-left: 16px" />
      <el-button type="primary" @click="filterData" style="margin-left: 16px">搜索</el-button>
    </div>
    <div class="main">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 :columns="columns" :data="filterdata" row-class="rowClass" :width="width" :height="height" />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, onDeactivated, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import http from '@/services/http'
import type { mySummary, myGenre } from '@/types/index'
import {
  ElButton,
  TableV2FixedDir,
} from 'element-plus'
import { h } from 'vue'
import type { Column } from 'element-plus'


const router = useRouter()
const store = useStore();
const selectedGenreID = ref('All')
const searchQuery = ref('')
const genres = ref<myGenre[]>([])
const loading = ref(false);

const data = ref<mySummary[]>([])
const filterdata = ref<mySummary[]>([])
const columns: Column[] = [
  {
    key: 'operations',
    title: 'Operations',
    dataKey: '_id',
    cellRenderer: ({ cellData: _id }: { cellData: string }) => {
      return h('div', {
        style: { display: 'flex', justifyContent: 'center', gap: '10px' }
      }, [
        h(ElButton, {
          size: 'default',
          onClick: () => itemClick(_id)
        }, { default: () => '查看' }),

        h(ElButton, {
          size: 'default',
          type: 'primary',
          onClick: () => editItem(_id)
        }, { default: () => '编辑' })
      ]);
    },
    width: 150,
    align: 'center',
    fixed: TableV2FixedDir.LEFT,
  },
  { title: 'Summary', key: 'summary', dataKey: 'summary', width: 600, flexGrow: 1 },
  { title: 'Date', key: 'date', dataKey: 'date', width: 120, fixed: TableV2FixedDir.RIGHT, },
]

const fetchData = async () => {
  loading.value = true;
  const result: mySummary[] = await http.post('/catalog/summaryData', { selectedGenreID: selectedGenreID.value })
  // 为每个条目添加 id 属性
  data.value = result
  filterdata.value = result
  loading.value = false;
}

// TODO：这里存在效率问题和数据请求逻辑问题
const filterData = async () => {
  console.log('searchQuery', searchQuery.value)
  loading.value = true;
  filterdata.value = await data.value.filter((item) => {
    return item.summary.toLowerCase().includes(searchQuery.value.toLowerCase());
  })
  loading.value = false;
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
watch(() => ({ selectedGenreID: selectedGenreID.value }), fetchData, { immediate: true })


const itemClick = (id: string) => {
  router.push({
    path: `/articles/${id}`
  })
}
const editItem = (id: string) => {
  router.push({
    path: `/userdata/article/${id}`
  })
}
onBeforeMount(() => {
  getGenres();
  store.commit('setInUse', '2');
})

onActivated(() => {
  store.commit('setInUse', '2');
  console.log('ArticleLists activated')
})

onDeactivated(() => {
  console.log('ArticleLists deactivated')
})
</script>

<style lang="scss" scoped>
.pageList {
  display: flex;
  flex-direction: column;
}

.head {
  margin-top: 10px;
}

.main {
  height: 600px;
  margin: 30px 0;
}

.row {
  cursor: pointer;
}
</style>
