<template>
  <ArticleItem v-if="isDataLoaded" title="创建文章" v-model="myFormData" @submit="handleSubmit" />
</template>

<script setup lang="ts">

import { ref, onMounted } from 'vue';
import type { Author, Genre } from '@/types/index';
import http from '@/services/http';
import type { UploadFile } from 'element-plus'
import ArticleItem from './ArticleItem.vue';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { AxiosError } from 'axios';
const router = useRouter()
const store = useStore();

interface InitialData {
  authors: Author[],
  genres: Genre[],
}
const isDataLoaded = ref(false); // 用于控制数据加载完成标志
const myFormData = ref({
  title: '',
  author: '',
  summary: '',
  text: '',
  date: new Date().toISOString().split('T')[0],
  sortedAuthors: [] as Author[],
  genres: [] as Genre[],
  fileList: [] as UploadFile[],
});

const getInitialData = async () => {
  const initialData: InitialData = await http.get('catalog/article/create');
  myFormData.value.sortedAuthors = initialData.authors;
  myFormData.value.genres = initialData.genres;
  // 数据加载完成后，设置标志为 true
  isDataLoaded.value = true;
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

  if (myFormData.value.fileList.length > 0) {
    formData.append('pic', myFormData.value.fileList[0].raw as Blob, myFormData.value.fileList[0].name);
  }

  http.post('catalog/article/create', formData)
    .then(() => {
      ElMessage.success('文章创建成功')
      router.push('/userdata/articlelist')
    })
    .catch((error) => {
      if (error instanceof AxiosError && error.response) {
        ElMessage.error(`创建失败: ${error.response.data}`);
      } else {
        ElMessage.error('创建失败: 未知错误');
      }
    });
}

onMounted(() => {
  getInitialData();
  store.dispatch('updateActiveMenuKey', '3-1')
});

</script>

<style scoped>
/* Add any specific styles for this component */
</style>
