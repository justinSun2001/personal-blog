<template>
  <div>
    <AuthorItem title="创建作者" v-model="formData" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import http from '@/services/http';
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { AxiosError } from 'axios';
import AuthorItem from './AuthorItem.vue'
const router = useRouter()
const store = useStore();
// 定义表单数据
const formData = ref({
  first_name: '',
  family_name: '',
  date_of_birth: '',
  date_of_death: ''
});

// 表单提交方法
const handleSubmit = () => {
  http.post('catalog/author/create', formData.value)
    .then(() => {
      ElMessage.success('作者创建成功')
      router.push('/userdata/authorlist')
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
  store.dispatch('updateActiveMenuKey', '3-2')
})
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>