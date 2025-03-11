<template>
  <div>
    <el-page-header @back="goBack">
      <template #title>
        <span class="header"> 返回 </span>
      </template>
      <template #content>
        <span class="header"> 作者详情 </span>
      </template>
    </el-page-header>
    <h1>{{ author.first_name }} {{ author.family_name }}</h1>
    <p>
      <el-button plain @click="deleteDialogVisible = true">
        删除
      </el-button>
      <el-dialog v-model="deleteDialogVisible" title="提示" width="500" top="54px" :before-close="handleDeleteClose">
        <dl>
          <template v-if="authorArticles.length > 0">
            <span style="color: red;">作者{{ author.first_name }} {{ author.family_name }} 下还存在文章:(请删除相关文章)</span>
            <div v-for="(article, index) in authorArticles" :key="index">
              <dt>
                <a @click="editArticle(article._id)" class="link">{{ article.title }}</a>
              </dt>
            </div>
          </template>
          <template v-else>
            <p>此作者没有发表文章</p>
            <span style="color: red;">作者{{ author.first_name }} {{ author.family_name }} 将被删除，确定吗？</span>
          </template>
        </dl>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmDelete">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </p>
    <p>
      <el-button plain @click="updateDialogVisible = true">
        更新
      </el-button>
      <el-dialog v-model="updateDialogVisible" title="更新" top="54px" :before-close="handleUpdateClose">
        <AuthorItem title="更新作者" v-model="updateData" @submit="handleUpdateSubmit" />
      </el-dialog>
    </p>
    <hr />
    <div style="margin-left:20px;margin-top:20px">
      <h4>相关文章</h4>
      <dl>
        <template v-if="authorArticles.length > 0">
          <div v-for="(article, index) in authorArticles" :key="index">
            <dt>
              <a @click="editArticle(article._id)" class="link">{{ article.title }}</a>
            </dt>
            <dd>{{ article.summary }}</dd>
          </div>
        </template>
        <template v-else>
          <p>此作者没有发表文章</p>
        </template>
      </dl>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Author } from '@/types/index';
import http from '@/services/http';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { AxiosError } from 'axios';
import AuthorItem from './AuthorItem.vue';
const route = useRoute();
const router = useRouter();

interface myArticle {
  _id: string;
  title: string;
  summary: string;
}
// 定义 authorData 的返回类型
interface AuthorData {
  author: Author;
  author_articles: myArticle[];
}
const updateDialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const author = ref<Author>({} as Author);
const authorArticles = ref<myArticle[]>([]);
const updateData = ref({
  first_name: '',
  family_name: '',
  date_of_birth: '',
  date_of_death: '',
})
// 定义异步函数获取作者数据
const getAuthorData = async () => {
  try {
    // 发送 HTTP 请求获取作者数据
    const authorData: AuthorData = await http.get('/catalog/author/' + route.params.id);
    author.value = authorData.author;
    authorArticles.value = authorData.author_articles;
    updateData.value = authorData.author;
  }
  catch (error) {
    // 处理请求错误
    console.error('获取作者数据失败:', error);
  }
}

const editArticle = (id: string) => {
  router.push(`/userdata/article/${id}`);
}

const handleDeleteClose = () => {
  deleteDialogVisible.value = false;
}
const handleUpdateClose = () => {
  updateDialogVisible.value = false;
}
const handleUpdateSubmit = async () => {
  try {
    await http.post('/catalog/author/' + author.value._id + '/update', updateData.value);
    updateDialogVisible.value = false;
    router.push('/userdata/authorlist');
    ElMessage.success('更新成功');
  }
  catch (error) {
    if (error instanceof AxiosError && error.response) {
      ElMessage.error(`更新失败: ${error.response.data}`);
    }
  }
}
const handleConfirmDelete = async () => {
  try {
    await http.post('/catalog/author/' + author.value._id + '/delete');
    router.push('/userdata/authorlist');
    ElMessage.success('删除成功');
  }
  catch (error) {
    if (error instanceof AxiosError && error.response) {
      ElMessage.error(`删除失败: ${error.response.data}`);
    } else {
      ElMessage.error('删除失败: 未知错误');
    }
  }
  finally {
    deleteDialogVisible.value = false;
  }
}
const goBack = () => {
  router.go(-1);
}
onMounted(() => {
  getAuthorData();
})
</script>

<style scoped>
.header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.link {
  color: blue;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 10px #000;
}
</style>
