<template>
  <div>
    <el-dialog title="镜头输入表单" :model-value="cameraDialog" @close="closeDialog">
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-row>
          通过摄像头拍摄自动填充：
          <div class="upload-image">
            <el-button type="primary" @click="captureCamera">打开摄像头</el-button>
            <video ref="videoRef" width="640" height="480" autoplay></video>
            <el-button type="success" @click="uploadCamera">拍摄上传</el-button>
          </div>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="型号1" prop="型号1">
              <el-select v-model="formData.型号1" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('型号1')" :key="option.id" :label="option.型号1"
                  :value="option.型号1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="型号2" prop="型号2">
              <el-select v-model="formData.型号2" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('型号2')" :key="option.id" :label="option.型号2"
                  :value="option.型号2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="标识" prop="标识">
              <el-select v-model="formData.标识" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('标识')" :key="option.id" :label="option.标识"
                  :value="option.标识"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="版号" prop="版号">
              <el-select v-model="formData.版号" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('版号')" :key="option.id" :label="option.版号"
                  :value="option.版号"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="片号" prop="片号">
              <el-select v-model="formData.片号" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('片号')" :key="option.id" :label="option.片号"
                  :value="option.片号"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="检验批号" prop="检验批号">
              <el-select v-model="formData.检验批号" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('检验批号')" :key="option.id" :label="option.检验批号"
                  :value="option.检验批号"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产批号" prop="生产批号">
              <el-select v-model="formData.生产批号" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('生产批号')" :key="option.id" :label="option.生产批号"
                  :value="option.生产批号"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="备注">
          <el-select v-model="formData.备注" placeholder="" filterable allow-create clearable>
            <el-option v-for="option in getUniqueOptions('备注')" :key="option.id" :label="option.备注"
              :value="option.备注"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目检合格数" prop="目检合格数">
          <el-select v-model="formData.目检合格数" placeholder="" filterable allow-create clearable>
            <el-option v-for="option in getUniqueOptions('目检合格数')" :key="option.id" :label="option.目检合格数"
              :value="option.目检合格数"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="筛选单状态" prop="筛选单状态">
              <el-select v-model="formData.筛选单状态" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('筛选单状态')" :key="option.id" :label="option.筛选单状态"
                  :value="option.筛选单状态"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收费状态" prop="收费状态">
              <el-select v-model="formData.收费状态" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('收费状态')" :key="option.id" :label="option.收费状态"
                  :value="option.收费状态"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否合检" prop="是否合检">
              <el-select v-model="formData.是否合检" placeholder="" filterable allow-create clearable>
                <el-option v-for="option in getUniqueOptions('是否合检')" :key="option.id" :label="option.是否合检"
                  :value="option.是否合检"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleSubmitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue';


const formRef = ref<InstanceType<typeof import('element-plus')['ElForm']>>();
const videoRef = ref<HTMLVideoElement | null>(null);
const formData = ref<any>({});
const mediaStream = ref<MediaStream | null>(null);


const { cameraDialog } = defineProps(['cameraDialog'])
const emit = defineEmits(['closeDialog']);

const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');
  // 清空表单数据
  formRef.value?.resetFields();
  stopCamera();
};

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
          const response = await http.post("http://127.0.0.1:8000/api/capture", formDataObj);
          console.log('照片保存成功');
          console.log(response.data.data);
          formData.value = response.data.data;
        } catch (error) {
          console.error('保存照片失败:', error);
        }
      }
    }, 'image/jpeg');
  }
  stopCamera();
};

const handleSubmitForm = () => {
  // 关闭对话框
  emit('closeDialog');
  // 清空表单数据
  formRef.value?.resetFields();
};


onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>