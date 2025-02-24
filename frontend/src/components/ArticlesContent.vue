<template>
  <div class="main">
    <div class="text-right" v-for="(item, index) in summary.slice(start, end).reverse()" :key="index">
      <div class="text-container">
        <a class="text" @click="itemClick(index)">{{ item }}</a>
      </div>
    </div>
  </div>
  <div class="pageIndex">
    <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-size="pageSize" :total="total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import http from '@/services/http'
import type { ItemArray, ArticleData } from '@/types/index'

export default defineComponent({
  name: 'ArticlesContent',
  props: {
    currentPage: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    // Using refs to declare data variables
    const total = ref(0)
    const pageSize = ref(15)
    const start = ref(0)
    const end = ref(0)
    const summary = ref<string[]>([])
    const items = ref<string[]>([])

    const router = useRouter()
    const store = useStore()

    // Method to fetch articles
    const fetchData = async () => {
      // Fetch total article count

      total.value = store.state.articleCount
      start.value = total.value - (props.currentPage * pageSize.value) > 0
        ? total.value - (props.currentPage * pageSize.value) - 1
        : 0
      end.value = total.value - ((props.currentPage - 1) * pageSize.value)

      // Fetch articles data
      for (let i = total.value - 1; i >= 0; i--) {
        const res: ItemArray = await http.get('/catalog/articlesData')
        items.value[i] = res[i]._id;
        const result: ArticleData = await http.get(`/catalog/articlesData/${items.value[i]}`)
        summary.value[i] = result.article.summary;
      }
    }

    // Fetch data on component mount
    onMounted(fetchData)

    // Watch for currentPage changes to refetch the data
    watch(() => props.currentPage, fetchData)

    // Handling item click navigation
    const itemClick = (n: number) => {
      const id = items.value[total.value - n - 1 - (props.currentPage - 1) * pageSize.value]
      router.push({
        path: `/articles/${id}`
      })
    }

    // Handling page change
    const handleCurrentChange = (currentPage: number) => {
      router.push({
        path: `/articleList/${currentPage}`
      })
      fetchData()
    }

    return {
      total,
      pageSize,
      start,
      end,
      summary,
      items,
      itemClick,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.text-right:hover {
  background-color: whitesmoke;
}

.text-container {
  background-color: #f9f9fb;
  border-bottom: 1px solid rgb(191, 185, 185);
  padding-left: 5px;
  height: 3em;
  line-height: 3em;
  overflow: hidden;
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
  padding-top: 20px;
}
</style>
