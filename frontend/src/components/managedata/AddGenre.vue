<template>
  <div>
    <GenreItem title="创建类别" v-model="formData" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import http from '@/services/http';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { AxiosError } from 'axios';
import GenreItem from './GenreItem.vue'
const router = useRouter()
const store = useStore();
// 定义表单数据
const formData = ref({
  name: '',
});
// 表单提交方法
const handleSubmit = () => {
  http.post('catalog/genre/create', formData.value)
    .then(() => {
      ElMessage.success('类别创建成功')
      router.push('/userdata/genrelist')
    })
    .catch((error) => {
      if (error instanceof AxiosError && error.response) {
        ElMessage.error(`创建失败: ${error.response.data}`);
      } else {
        ElMessage.error('创建失败: 未知错误');
      }
    });
};

onMounted(() => {
  store.dispatch('updateActiveMenuKey', '3-3')
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>