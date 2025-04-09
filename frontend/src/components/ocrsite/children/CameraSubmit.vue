<template>
  <div>
    <el-dialog title="镜头输入表单" :model-value="cameraDialog" @close="closeDialog">
      <el-row>
        <div class="btn">
          通过摄像头拍摄自动填充：
          <el-button type="primary" @click="captureCamera" :disabled=disableBtn>打开摄像头</el-button>
          <el-button type="primary" @click="stopCamera" :disabled=!disableBtn>关闭摄像头</el-button>
          <el-button type="success" @click="uploadCamera">拍摄上传</el-button>
        </div>
        <div class="upload-image" v-loading="loading">
          <div class="video-container">
            <video ref="videoRef" autoplay></video>
          </div>
          <div class="img-container">
            <img ref="imgRef" :src="imgUrl" />
          </div>
          <div class="res-container">
            <img :src="resUrl" />
          </div>
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
}

const loading = ref(false)
const disableBtn = ref<boolean>(false)
const imgUrl = ref<string>('')
const resUrl = ref<string>('')
const imgRef = ref<HTMLVideoElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const mediaStream = ref<MediaStream | null>(null);
const captureCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
    mediaStream.value = stream;
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream.value;
      videoRef.value.play();
      disableBtn.value = true
    }
  } catch (error) {
    ElMessage.error(`请检查摄像头权限' ${error}`);
    disableBtn.value = false
  }
};
const stopCamera = () => {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
    mediaStream.value = null;
  }
  disableBtn.value = false
};
const uploadCamera = async () => {
  stopCamera()

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
          const url = URL.createObjectURL(blob)
          imgUrl.value = url
          if (imgRef.value) {
            imgRef.value.onload = () => URL.revokeObjectURL(url);
          }
          const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
          if (beforeUpload(file) === false) {
            return
          }
          const response: picResponseType = await uploadPic(file);
          handleSuccess(response);
        }
        catch (err) {
          ElMessage.error(err.response.data.message);
        }
        finally {
          loading.value = false;
        }
      } else {
        ElMessage.error('请先打开摄像头1');
      }
    }, 'image/jpeg');
  }
  else {
    ElMessage.error('请先打开摄像头2');
  }
};
// 上传成功回调
const handleSuccess = (response: picResponseType) => {
  if (response.code === 200) {
    data.value = response.data.ocrData;
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
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.video-container {
  width: 25%;
  aspect-ratio: 1;
  border: 1px solid black;
  margin: 0 2px;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;

}

.img-container {
  width: 25%;
  border: 1px solid black;
  margin: 0 2px;
}

.res-container {
  width: 50%;
  border: 1px solid black;
  margin: 0 2px;
}

img {
  background-color: antiquewhite;
  object-fit: contain;
  width: 100%;
  height: 100%;
}
</style>