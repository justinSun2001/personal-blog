<template>
  <div>
    <el-dialog title="镜头输入表单" :model-value="cameraDialog" @close="closeDialog">
      <el-row>
        通过摄像头拍摄自动填充：
        <div class="upload-image">
          <el-button type="primary" @click="captureCamera">打开摄像头</el-button>
          <video ref="videoRef" width="600" height="400" autoplay></video>
          <el-button type="success" @click="uploadCamera">拍摄上传</el-button>
        </div>
      </el-row>
      <FormItem :data=data @submitData="submitData" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import FormItem from './FormItem.vue';
import type { FormData } from '@/types/index'
import http from '@/services/http';

const videoRef = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
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
const captureCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    mediaStream.value = stream;
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      videoRef.value.play();
    }
  } catch (error) {
    console.error('获取摄像头权限失败:', error);
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
        const formDataObj = new FormData();
        formDataObj.append('photo', blob, 'captured_image.jpg');
        try {
          const response = await http.post("/ocr/uploadPic", formDataObj);
          console.log('照片保存成功');
          console.log(response.data.data);
          data.value = response.data.data;
        } catch (error) {
          console.error('保存照片失败:', error);
        }
      }
    }, 'image/jpeg');
  }
  stopCamera();
};


</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>