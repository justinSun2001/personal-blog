<template>
  <el-page-header @back="goBack">
    <template #title>
      <span class="header"> 返回 </span>
    </template>
    <template #content>
      <span class="header"> 文章详情 </span>
    </template>
  </el-page-header>
  <div v-if="article.title"> <!-- 只有 article 数据加载后才渲染 -->
    <h1>{{ article.title }}</h1>
    <p>
      <el-button plain @click="deleteDialogVisible = true">
        删除
      </el-button>
      <el-dialog v-model="deleteDialogVisible" title="提示" width="500" top="54px" :before-close="handleDeleteClose">
        <span style="color: red;">文章《{{ article.title }}》将被删除，确定吗？</span>
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
      <el-button plain @click="onClickUpadte">
        更新
      </el-button>
      <el-dialog v-model="updateDialogVisible" top="54px" :before-close="handleUpdateClose">
        <ArticleItem v-if="isDataLoaded" title="更新文章" v-model="myFormData" @submit="handleSubmit" />
      </el-dialog>
    </p>
    <hr />
    <p>
      <strong>Author:</strong>
      <a class="link1" @click="editAuthor(article.author._id)">{{ article.author.first_name + ' ' +
        article.author.family_name }}</a>
    </p>
    <p>
      <strong>Summary:</strong>
      {{ article.summary }}
    </p>
    <p>
      <strong>Date:</strong>
      {{ article.date }}
    </p>
    <p>
      <strong>Genre:</strong>
      <span v-for="(val, index) in article.genre" :key="index">
        <a class="link2" @click="editGenre(val._id)">{{ val.name }}</a>
        <span v-if="index < article.genre.length - 1">,</span>
      </span>
    </p>
  </div>
  <div v-else>Loading...</div> <!-- 如果 article.title 为空，显示 loading -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import http from '@/services/http';
import type { Article, Author, Genre } from '@/types/index';
import { ElMessage } from 'element-plus';
import { AxiosError } from 'axios';
import type { UploadFile } from 'element-plus'
import ArticleItem from './ArticleItem.vue';

const route = useRoute();
const router = useRouter();
const isDataLoaded = ref(false); // 用于控制数据加载完成标志

interface InitialData {
  authors: Author[],
  genres: Genre[],
}

const deleteDialogVisible = ref(false);
const updateDialogVisible = ref(false);

const myFormData = ref({
  title: '',
  author: '',
  summary: '',
  text: '',
  date: new Date().toISOString().split('T')[0],
  sortedAuthors: [] as Author[],
  genres: [] as Genre[],
  fileList: [] as UploadFile[],
})

const path = ref('');
const article = ref({} as Article);
const selectedGenres = ref([] as Genre[]);

const getArticle = async () => {
  try {
    const result: Article = await http.get(`/catalog/articlesData/${route.params.id}`);
    article.value = result;
    myFormData.value.title = result.title;
    myFormData.value.author = result.author._id;
    myFormData.value.summary = result.summary;
    myFormData.value.text = result.text;
    myFormData.value.date = result.date;
    selectedGenres.value = result.genre;
    if (result.path) {
      const url = `http://localhost:3000${result.path}`;
      myFormData.value.fileList = [{
        uid: Date.now(),
        name: url.split('/').pop() || 'unknown',
        url,
        status: 'success',
      }];
      path.value = result.path;
    }
  } catch (error) {
    ElMessage.error(`${error}`);
  }
  // 数据加载完成后，设置标志为 true
  isDataLoaded.value = true;
};

const editAuthor = (id: string) => {
  router.push(`/userdata/author/${id}`);
}

const editGenre = (id: string) => {
  router.push(`/userdata/genre/${id}`);
}

const handleDeleteClose = () => {
  deleteDialogVisible.value = false;
}

const handleUpdateClose = () => {
  updateDialogVisible.value = false;
}

const handleConfirmDelete = async () => {
  try {
    await http.post('/catalog/article/' + article.value._id + '/delete');
    router.push('/userdata/articlelist');
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
const onClickUpadte = async () => {
  const initialData: InitialData = await http.get('catalog/article/create');
  myFormData.value.sortedAuthors = ([...initialData.authors]);
  myFormData.value.genres = ([...initialData.genres]);
  myFormData.value.genres.map(genre => {
    if (selectedGenres.value.some(genre1 => genre1._id === genre._id)) {
      genre.checked = true;
    }
  })
  updateDialogVisible.value = true;
}

const handleSubmit = () => {
  const formData = new FormData();
  formData.append('title', myFormData.value.title);
  formData.append('author', myFormData.value.author);
  formData.append('summary', myFormData.value.summary);
  formData.append('text', myFormData.value.text);
  formData.append('date', myFormData.value.date);

  const checkedGenres = myFormData.value.genres.filter(genre => genre.checked);
  const genreIds = checkedGenres.map(genre => genre._id);
  genreIds.forEach(genreId => {
    formData.append('genres', genreId);
  });

  if (myFormData.value.fileList.length > 0 && myFormData.value.fileList[0].raw) {
    formData.append('pic', myFormData.value.fileList[0].raw as Blob, myFormData.value.fileList[0].name);
  } else if (myFormData.value.fileList.length > 0 && myFormData.value.fileList[0].url) {
    formData.append('pic', path.value as string);
  } else {
    formData.append('pic', '' as string);
  }
  http.post(`catalog/article/${article.value._id}/update`, formData)
    .then(() => {
      ElMessage.success('文章更新成功')
      router.push('/userdata/articlelist')
    })
    .catch((error) => {
      if (error instanceof AxiosError && error.response) {
        ElMessage.error(`更新失败: ${error.response.data}`);
      } else {
        ElMessage.error('更新失败: 未知错误');
      }
    });
}

const goBack = () => {
  router.go(-1);
}

onMounted(() => {
  getArticle();
});
</script>

<style lang="scss" scoped>
.header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

a:hover {
  cursor: pointer;
  text-decoration: underline;
  text-shadow: 0 0 10px #000;
}

.link1 {
  color: red;
}

.link2 {
  color: rgb(255, 0, 221);
}
</style>