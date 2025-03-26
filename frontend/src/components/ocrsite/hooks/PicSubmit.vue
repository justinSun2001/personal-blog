<template>
  <div>
    <el-dialog title="图片添加表单" :model-value="picDialog" @close="closeDialog">
      <el-row>
        通过上传图像文件自动填充:
        <el-upload ref="uploadImageRef" class="upload-image" action="http://127.0.0.1:8000/api/uploadImage"
          :auto-upload="false" :on-success="handleImageSuccess">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
        <el-button type="success" @click="uploadImage">上传</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

const { picDialog } = defineProps(['picDialog'])
const emit = defineEmits(['closeDialog']);

const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');

};

const handleSuccess = (response: any) => {
  // 处理上传成功的回调
  console.log(response);
};

const handleError = (error: any) => {
  // 处理上传失败的回调
  ElMessage({
    message: '上传失败',
    type: 'error',
  });
};
</script>

<style scoped>
/* 若有样式需求可在此添加 */
</style>