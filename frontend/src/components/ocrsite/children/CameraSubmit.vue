<template>
  <div>
    <el-dialog title="镜头输入表单" :model-value="cameraDialog" @close="closeDialog">
      <el-row>
        通过摄像头拍摄自动填充：
        <div class="upload-image">
          <el-button type="primary" @click="captureCamera">打开摄像头</el-button>
          <video ref="videoRef" width="600" height="400" autoplay></video>
          <el-button type="success" @click="uploadCamera">拍摄上传</el-button>
          <img :src="resUrl" class="res-pic" />
        </div>
      </el-row>
      <FormItem :data=data @submitData="submitData" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeUnmount } from 'vue';
import FormItem from './childeren/FormItem.vue';
import type { FormData, picResponseType } from '@/types/index';
import { ElMessage } from 'element-plus';
import { uploadPic, beforeUpload } from '../hooks/uploadPic';
const data = ref<FormData | null>(null);
const { cameraDialog } = defineProps(['cameraDialog'])
const emit = defineEmits(['closeDialog', 'addData']);
const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');
  stopCamera();
};
const submitData = () => {
  emit('closeDialog');
  emit('addData');
  stopCamera();
}
const loading = ref(false)
const resUrl = ref<string>('')
const videoRef = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const captureCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    mediaStream.value = stream;
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.play();
    }
  } catch (error) {
    ElMessage.error(`请检查摄像头权限' ${error}`);
  }
};
const stopCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
    mediaStream.value = null;
  }
};
const uploadCamera = async () => {
  if (videoRef.value) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.value.videoWidth;
    canvas.height = videoRef.value.videoHeight;
    context?.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          loading.value = true;
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          if (beforeUpload(file) === false) {
            return
          }
          const response: picResponseType = await uploadPic(file);
          handleSuccess(response);
          loading.value = false;
        } catch {
          loading.value = false;
          stopCamera();
          ElMessage.error('上传失败');
        }
      } else {
        ElMessage.error('请先打开摄像头');
      }
    }, 'image/jpeg');
  } else {
    ElMessage.error('请先打开摄像头');
  }
};
// 上传成功回调
const handleSuccess = (response: picResponseType) => {
  if (response.code === 200) {
    data.value = response.data.ocrData;
    stopCamera();
    resUrl.value = response.data.url;
    ElMessage.success(response.message);
  }
};

onBeforeUnmount(() => {
  stopCamera();
})

</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}

.res-pic {
  height: 178px;
  object-fit: contain;
}
</style>