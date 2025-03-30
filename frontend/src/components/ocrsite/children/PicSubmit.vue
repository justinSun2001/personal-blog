<template>
  <div>
    <el-dialog title="图片添加表单" :model-value="picDialog" @close="closeDialog">
      <div v-loading="loading">
        <el-row style="line-height: 32px;">
          <span style="margin-right: 20px;">通过上传图像文件自动填充:</span>
          <!-- 独立上传按钮 -->
          <el-button type="primary" :disabled="!selectedFile" @click="handleManualUpload">
            确认上传
          </el-button>
        </el-row>
        <div class="upload-container">
          <!-- 上传组件（关闭自动上传） -->
          <el-upload ref="uploadRef" class="avatar-uploader" :http-request="customUpload" :auto-upload="false"
            :show-file-list="false" :on-change="handleFileChange" :before-upload="beforeUpload" accept="image/*">
            <!-- 带删除按钮的预览区域 -->
            <div v-if="previewUrl" class="preview-container">
              <img :src="previewUrl" class="avatar" />
              <div class="preview-mask" @click.stop="handlePreview">
                <el-icon :size="24" color="#fff">
                  <ZoomIn />
                </el-icon>
              </div>
            </div>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>

          <div v-if="resUrl" class="preview-container">
            <img :src="resUrl" class="res-pic" />
            <div class="preview-mask" @click.stop="dialogVisible2 = true">
              <el-icon :size="24" color="#fff">
                <ZoomIn />
              </el-icon>
            </div>
          </div>
        </div>
        <!-- 放大预览对话框 -->
        <el-dialog v-model="dialogVisible1" title="图片预览" width="80%" top="5vh">
          <img :src="previewUrl" loading="lazy" alt="预览图片" class="preview-large-image" />
        </el-dialog>
        <el-dialog v-model="dialogVisible2" title="识别结果图片预览" width="80%" top="5vh">
          <img :src="resUrl" loading="lazy" alt="识别结果预览图片" class="preview-large-image" />
        </el-dialog>

        <FormItem :data=data @submitData="submitData" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue';
import FormItem from './childeren/FormItem.vue';
import type { FormData, picResponseType } from '@/types/index'
const loading = ref(false)
const data = ref<FormData | null>(null);
const { picDialog } = defineProps(['picDialog'])
const emit = defineEmits(['closeDialog', 'addData']);
const closeDialog = () => {
  emit('closeDialog');
};
const submitData = () => {
  emit('closeDialog');
  emit('addData');
}

import { ElMessage } from 'element-plus';
import { Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile, UploadInstance, UploadRequestOptions } from 'element-plus'
import { uploadPic, beforeUpload } from '../hooks/uploadPic';
// 响应式数据
const uploadRef = ref<UploadInstance>()  // 上传组件引用
const previewUrl = ref<string>('')       // 预览图地址
const resUrl = ref<string>('')
const selectedFile = ref<File | null>(null) // 选择的文件
const dialogVisible1 = ref(false) // 控制对话框显示
const dialogVisible2 = ref(false) // 控制对话框显示
// 文件选择变化回调
const handleFileChange = (file: UploadFile) => {
  if (!file.raw) return
  previewUrl.value = URL.createObjectURL(file.raw)
  selectedFile.value = file.raw
}
// 图片预览点击处理
const handlePreview = () => {
  if (previewUrl.value) {
    dialogVisible1.value = true
  }
}
// 自定义上传逻辑
const customUpload = async (options: UploadRequestOptions) => {
  try {
    if (!options.file) {
      ElMessage.error('请选择文件');
      return;
    }
    loading.value = true;
    const response: picResponseType = await uploadPic(options.file);
    loading.value = false;
    handleSuccess(response);
  } catch {
    loading.value = false;
    ElMessage.error('上传失败');
  }
};
// 上传成功回调
const handleSuccess = (response: picResponseType) => {
  if (response.code === 200) {
    data.value = response.data.ocrData;
    resUrl.value = response.data.url;
    uploadRef.value?.clearFiles();
    selectedFile.value = null;
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
      previewUrl.value = ''
    }
    ElMessage.success(response.message);
  }
};
// 手动触发上传
const handleManualUpload = () => {
  if (!uploadRef.value || !selectedFile.value) {
    ElMessage.error('请重新选择文件');
  } else {
    uploadRef.value.submit()
  }
}
// 清理预览URL（防止内存泄漏）
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

</script>

<style scoped>
.upload-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-uploader {
  margin: 20px 0;
}

.res-pic {
  height: 178px;
  object-fit: contain;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

/* 新增样式 */
.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-mask {
  position: absolute;
  top: 0;
  right: 0px;
  width: 30px;
  height: 30px;
  background: rgba(10, 38, 224, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.preview-mask:hover {
  opacity: 0.8;
}

.preview-large-image {
  width: 100%;
  height: 70vh;
  object-fit: contain;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>