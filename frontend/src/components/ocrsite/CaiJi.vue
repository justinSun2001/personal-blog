<template>
  <div class="container">
    <div class="dialog-container">
      <div class="header">
        型号：
        <el-tooltip content="相机型号" placement="top">
          <el-input v-model="input1" disabled class="input" />
        </el-tooltip>
        SN：
        <el-tooltip content="相机SN号" placement="top">
          <el-input v-model="input2" disabled class="input" />
        </el-tooltip>
        UserID：
        <el-tooltip content="相机UserID" placement="top">
          <el-input v-model="input3" disabled class="input" />
        </el-tooltip>
      </div>
      <div class="main">
        <div class="image-container">
          <!-- 文本添加到图像容器的左上角 -->
          <div style="position: absolute; top: -20px; left: -10px;">相机1</div>
          <img v-if="isHandImg1" :src="videoStreamUrl1" @error="defaultSrc1" class="image-with-border" />
          <div class="image-border" :style="borderStyles1"></div> <!-- 用于画边框的容器 -->
        </div>
      </div>
      <div class="footer">
        <div class="f1">
          <div class="g1">
            曝光时间：
            <el-tooltip content="曝光时间参数范围300 - 10000" placement="top">
              <el-input-number class="input" v-model="exposureTime1" :precision="2" :step="50" :min="300" :max="10000"
                controls-position="right" />
            </el-tooltip>
            增益：
            <el-tooltip content="增益参数范围0 - 10" placement="top">
              <el-input-number class="input" v-model="gain1" :precision="2" :step="0.1" :min="0" :max="10"
                controls-position="right" />
            </el-tooltip>
          </div>
          <div class="g2">
            最小面积占比：
            <el-tooltip content="最小面积占比参数范围0.1 - 0.5" placement="left">
              <el-input-number class="input" v-model="minAreaRatio1" :precision="2" :step="0.01" :min="0.1" :max="0.5"
                controls-position="right" />
            </el-tooltip>
            最大面积占比：
            <el-tooltip content="最大面积占比参数范围0.5 - 1.0" placement="left">
              <el-input-number class="input" v-model="maxAreaRatio1" :precision="2" :step="0.01" :min="0.5" :max="1.0"
                controls-position="right" />
            </el-tooltip>
          </div>
          <div class="g3">
            ROI占比：
            <el-tooltip content="ROI占比参数范围0.6 - 1.0" placement="bottom">
              <el-input-number class="input" v-model="roiRatio1" :precision="2" :step="0.01" :min="0.6" :max="1.0"
                controls-position="right" @change="handleChange5" />
            </el-tooltip>
            清晰度阈值：
            <el-tooltip content="清晰度阈值参数范围80 - 150" placement="bottom">
              <el-input-number class="input" v-model="minGradientValue1" :precision="2" :step="1" :min="80" :max="150"
                controls-position="right" />
            </el-tooltip>
          </div>
        </div>
        <div class="f2">
          <div class="left">
            <el-radio-group v-model="executeMode1" class="vertical-radio-group">
              <el-radio :label="1">关闭帧触发</el-radio>
              <el-radio :label="2">设置帧软触发</el-radio>
              <el-radio :label="3">设置帧硬触发</el-radio>
            </el-radio-group>
          </div>
          <div class="right">
            <el-row class="g1">
              <el-button color="#626aef" @click="startOpenCamera1" :disabled="disableOpenCamera1">打开相机</el-button>
              <el-button color="#626aef" @click="startCloseCamera1" :disabled="disableCloseCamera1">关闭相机</el-button>
            </el-row>
            <el-row class="g1">
              <el-button v-if="executeMode1 === 1" color="#626aef" @click="startContinuousCapture1"
                :disabled="disableContinuousCapture1">连续采集</el-button>
              <el-button v-if="executeMode1 === 1" color="#626aef" @click="startSingleCapture1"
                :disabled="disableSingleCapture1">单张采集</el-button>
            </el-row>
            <el-row class="g1">
              <el-button v-if="executeMode1 === 1" color="#626aef" @click="stopCapture1"
                :disabled="disableStopCapture1">停止连续采集</el-button>
              <el-button v-if="executeMode1 === 2" color="#626aef" @click="startFrameSoftTrigger1"
                :disabled="disableFrameSoftTrigger1">执行帧软触发</el-button>
            </el-row>
          </div>
        </div>

      </div>
    </div>
    <div class="dialog-container">
      <div class="header">
        型号：
        <el-tooltip content="相机型号" placement="top">
          <el-input v-model="input4" disabled class="input" />
        </el-tooltip>
        SN：
        <el-tooltip content="相机SN号" placement="top">
          <el-input v-model="input5" disabled class="input" />
        </el-tooltip>
        UserID：
        <el-tooltip content="相机UserID" placement="top">
          <el-input v-model="input6" disabled class="input" />
        </el-tooltip>
      </div>
      <div class="main">
        <div class="image-container">
          <!-- 文本添加到图像容器的左上角 -->
          <div style="position: absolute; top: -20px; left: -10px;">相机2</div>
          <img v-if="isHandImg2" :src="videoStreamUrl2" @error="defaultSrc2" class="image-with-border" />
          <div class="image-border" :style="borderStyles2"></div> <!-- 用于画边框的容器 -->
        </div>
      </div>
      <div class="footer">
        <div class="f1">
          <div class="g1">
            曝光时间：
            <el-tooltip content="曝光时间参数范围300 - 10000" placement="top">
              <el-input-number class="input" v-model="exposureTime2" :precision="2" :step="50" :min="300" :max="10000"
                controls-position="right" @change="handleChange7" />
            </el-tooltip>
            增益：
            <el-tooltip content="增益参数范围0 - 10" placement="top">
              <el-input-number class="input" v-model="gain2" :precision="2" :step="0.1" :min="0" :max="10"
                controls-position="right" @change="handleChange8" />
            </el-tooltip>
          </div>
          <div class="g2">
            最小面积占比：
            <el-tooltip content="最小面积占比参数范围0.1 - 0.5" placement="left">
              <el-input-number class="input" v-model="minAreaRatio2" :precision="2" :step="0.01" :min="0.1" :max="0.5"
                controls-position="right" @change="handleChange9" />
            </el-tooltip>
            最大面积占比：
            <el-tooltip content="最大面积占比参数范围0.5 - 1.0" placement="left">
              <el-input-number class="input" v-model="maxAreaRatio2" :precision="2" :step="0.01" :min="0.5" :max="1.0"
                controls-position="right" @change="handleChange10" />
            </el-tooltip>
          </div>
          <div class="g3">
            ROI占比：
            <el-tooltip content="ROI占比参数范围0.6 - 1.0" placement="bottom">
              <el-input-number class="input" v-model="roiRatio2" :precision="2" :step="0.01" :min="0.6" :max="1.0"
                controls-position="right" @change="handleChange11" />
            </el-tooltip>
            清晰度阈值：
            <el-tooltip content="清晰度阈值参数范围80 - 150" placement="bottom">
              <el-input-number class="input" v-model="minGradientValue2" :precision="2" :step="1" :min="80" :max="150"
                controls-position="right" @change="handleChange12" />
            </el-tooltip>
          </div>
        </div>
        <div class="f2">
          <div class="left">
            <el-radio-group v-model="executeMode2" class="vertical-radio-group">
              <el-radio :label="1">关闭帧触发</el-radio>
              <el-radio :label="2">设置帧软触发</el-radio>
              <el-radio :label="3">设置帧硬触发</el-radio>
            </el-radio-group>
          </div>
          <div class="right">
            <el-row class="g1">
              <el-button color="#626aef" @click="startOpenCamera2" :disabled="disableOpenCamera2">打开相机</el-button>
              <el-button color="#626aef" @click="startCloseCamera2" :disabled="disableCloseCamera2">关闭相机</el-button>
            </el-row>
            <el-row class="g1">
              <el-button v-if="executeMode2 === 1" color="#626aef" @click="startContinuousCapture2"
                :disabled="disableContinuousCapture2">连续采集</el-button>
              <el-button v-if="executeMode2 === 1" color="#626aef" @click="startSingleCapture2"
                :disabled="disableSingleCapture2">单张采集</el-button>
            </el-row>
            <el-row class="g1">
              <el-button v-if="executeMode2 === 1" color="#626aef" @click="stopCapture2"
                :disabled="disableStopCapture2">停止连续采集</el-button>
              <el-button v-if="executeMode2 === 2" color="#626aef" @click="startFrameSoftTrigger2"
                :disabled="disableFrameSoftTrigger2">执行帧软触发</el-button>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; justify-content: center; margin-top: -100px;">
    <el-button-group>
      <el-button type="primary" @click="r2l"><el-icon class="el-icon--left">
          <ArrowLeft />
        </el-icon>向左赋值</el-button>
      <el-button type="primary" @click="l2r">向右赋值<el-icon class="el-icon--right">
          <ArrowRight />
        </el-icon></el-button>
    </el-button-group>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

// 定义响应式数据
const receivedMessages = ref<number[]>([11, 11, 11]);
const input1 = ref<string>('');
const input2 = ref<string>('');
const input3 = ref<string>('');
const input4 = ref<string>('');
const input5 = ref<string>('');
const input6 = ref<string>('');
const isHandImg1 = ref<boolean>(true);
const isHandImg2 = ref<boolean>(true);
const videoStreamUrl1 = ref<string>('');
const videoStreamUrl2 = ref<string>('');
const executeMode1 = ref<number>(1);
const executeMode2 = ref<number>(1);
const disableOpenCamera1 = ref<boolean>(false);
const disableCloseCamera1 = ref<boolean>(true);
const disableContinuousCapture1 = ref<boolean>(true);
const disableSingleCapture1 = ref<boolean>(true);
const disableStopCapture1 = ref<boolean>(true);
const disableFrameSoftTrigger1 = ref<boolean>(true);
const disableOpenCamera2 = ref<boolean>(false);
const disableCloseCamera2 = ref<boolean>(true);
const disableContinuousCapture2 = ref<boolean>(true);
const disableSingleCapture2 = ref<boolean>(true);
const disableStopCapture2 = ref<boolean>(true);
const disableFrameSoftTrigger2 = ref<boolean>(true);
const exposureTime1 = ref<number>(3000);
const gain1 = ref<number>(0);
const minAreaRatio1 = ref<number>(0.4);
const maxAreaRatio1 = ref<number>(0.8);
const roiRatio1 = ref<number>(0.8);
const minGradientValue1 = ref<number>(100);
const exposureTime2 = ref<number>(3000);
const gain2 = ref<number>(0);
const minAreaRatio2 = ref<number>(0.4);
const maxAreaRatio2 = ref<number>(0.8);
const roiRatio2 = ref<number>(0.8);
const minGradientValue2 = ref<number>(100);
const distance1 = ref<string>('10%');
const size1 = ref<string>('80%');
const distance2 = ref<string>('10%');
const size2 = ref<string>('80%');

// 计算属性
const borderStyles1 = computed(() => {
  return {
    top: distance1.value,
    left: distance1.value,
    right: distance1.value,
    bottom: distance1.value,
    width: size1.value,
    height: size1.value
  };
});

const borderStyles2 = computed(() => {
  return {
    top: distance2.value,
    left: distance2.value,
    right: distance2.value,
    bottom: distance2.value,
    width: size2.value,
    height: size2.value
  };
});

// 监听数据变化
watch(exposureTime1, (newValue, oldValue) => {
  handleChange1();
});

watch(gain1, (newValue, oldValue) => {
  handleChange2();
});

watch(minAreaRatio1, (newValue, oldValue) => {
  handleChange3();
});

watch(maxAreaRatio1, (newValue, oldValue) => {
  handleChange4();
});

watch(roiRatio1, (newValue, oldValue) => {
  handleChange5();
});

watch(minGradientValue1, (newValue, oldValue) => {
  handleChange6();
});

watch(exposureTime2, (newValue, oldValue) => {
  handleChange7();
});

watch(gain2, (newValue, oldValue) => {
  handleChange8();
});

watch(minAreaRatio2, (newValue, oldValue) => {
  handleChange9();
});

watch(maxAreaRatio2, (newValue, oldValue) => {
  handleChange10();
});

watch(roiRatio2, (newValue, oldValue) => {
  handleChange11();
});

watch(minGradientValue2, (newValue, oldValue) => {
  handleChange12();
});

// 方法
const showNotification = (message: string) => {
  ElMessage({
    title: '新消息',
    message,
    type: 'success',
    duration: 2000
  });
};

const defaultSrc1 = () => {
  isHandImg1.value = false;
};

const defaultSrc2 = () => {
  isHandImg2.value = false;
};

const l2r = () => {
  exposureTime2.value = exposureTime1.value;
  gain2.value = gain1.value;
  minAreaRatio2.value = minAreaRatio1.value;
  maxAreaRatio2.value = maxAreaRatio1.value;
  roiRatio2.value = roiRatio1.value;
  minGradientValue2.value = minGradientValue1.value;
};

const r2l = () => {
  exposureTime1.value = exposureTime2.value;
  gain1.value = gain2.value;
  minAreaRatio1.value = minAreaRatio2.value;
  maxAreaRatio1.value = maxAreaRatio2.value;
  roiRatio1.value = roiRatio2.value;
  minGradientValue1.value = minGradientValue2.value;
};

const startOpenCamera1 = async () => {
  disableOpenCamera1.value = true;
  disableCloseCamera1.value = false;
  disableContinuousCapture1.value = false;
  disableSingleCapture1.value = false;
  disableFrameSoftTrigger1.value = false;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji1/openCamera');
    input1.value = response.data.model_name;
    input2.value = response.data.serial_number;
    input3.value = response.data.device_user_id;
    exposureTime1.value = response.data.exposure_time;
    gain1.value = response.data.gain;
    maxAreaRatio1.value = response.data.maxAreaRatio;
    minAreaRatio1.value = response.data.minAreaRatio;
    roiRatio1.value = response.data.roiRatio;
    minGradientValue1.value = response.data.minGradientValue;
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startCloseCamera1 = async () => {
  disableOpenCamera1.value = false;
  disableCloseCamera1.value = true;
  disableContinuousCapture1.value = true;
  disableSingleCapture1.value = true;
  disableFrameSoftTrigger1.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji1/closeCamera');
    console.log(response.data.data);
    ElMessage({
      message: response.data.data,
      type: 'success'
    });
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startContinuousCapture1 = () => {
  disableCloseCamera1.value = true;
  disableContinuousCapture1.value = true;
  disableSingleCapture1.value = true;
  disableStopCapture1.value = false;
  disableFrameSoftTrigger1.value = true;
  isHandImg1.value = true;
  videoStreamUrl1.value = `http://127.0.0.1:8000/api/caiji1/startGrabbing?timestamp=${new Date().getTime()}`;
};

const startSingleCapture1 = () => {
  isHandImg1.value = true;
  videoStreamUrl1.value = `http://127.0.0.1:8000/api/caiji1/grabOne?timestamp=${new Date().getTime()}`;
};

const stopCapture1 = async () => {
  disableCloseCamera1.value = false;
  disableContinuousCapture1.value = false;
  disableSingleCapture1.value = false;
  disableStopCapture1.value = true;
  disableFrameSoftTrigger1.value = false;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji1/stopGrabbing');
    console.log(response.data.data);
    ElMessage({
      message: response.data.data,
      type: 'success'
    });
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startFrameSoftTrigger1 = () => {
  // 处理帧软触发逻辑
  // 启用/禁用按钮状态
};

const handleChange1 = async () => {
  const formData = new FormData();
  formData.append('exposureTime', exposureTime1.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/exposureTime', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange2 = async () => {
  const formData = new FormData();
  formData.append('gain', gain1.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/gain', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange3 = async () => {
  const formData = new FormData();
  formData.append('minAreaRatio', minAreaRatio1.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/minAreaRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange4 = async () => {
  const formData = new FormData();
  formData.append('maxAreaRatio', maxAreaRatio1.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/maxAreaRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange5 = async () => {
  const formData = new FormData();
  formData.append('roiRatio', roiRatio1.value.toString());
  const roi1 = ((1 - roiRatio1.value) / 2.0 * 100) + '%';
  const roi2 = roiRatio1.value * 100 + '%';
  console.log(roi1, roi2);
  distance1.value = roi1;
  size1.value = roi2;
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/roiRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange6 = async () => {
  const formData = new FormData();
  formData.append('minGradientValue', minGradientValue1.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji1/minGradientValue', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startOpenCamera2 = async () => {
  disableOpenCamera2.value = true;
  disableCloseCamera2.value = false;
  disableContinuousCapture2.value = false;
  disableSingleCapture2.value = false;
  disableFrameSoftTrigger2.value = false;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji2/openCamera');
    input4.value = response.data.model_name;
    input5.value = response.data.serial_number;
    input6.value = response.data.device_user_id;
    exposureTime2.value = response.data.exposure_time;
    gain2.value = response.data.gain;
    maxAreaRatio2.value = response.data.maxAreaRatio;
    minAreaRatio2.value = response.data.minAreaRatio;
    roiRatio2.value = response.data.roiRatio;
    minGradientValue2.value = response.data.minGradientValue;
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startCloseCamera2 = async () => {
  disableOpenCamera2.value = false;
  disableCloseCamera2.value = true;
  disableContinuousCapture2.value = true;
  disableSingleCapture2.value = true;
  disableFrameSoftTrigger2.value = true;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji2/closeCamera');
    console.log(response.data.data);
    ElMessage({
      message: response.data.data,
      type: 'success'
    });
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startContinuousCapture2 = () => {
  disableCloseCamera2.value = true;
  disableContinuousCapture2.value = true;
  disableSingleCapture2.value = true;
  disableStopCapture2.value = false;
  disableFrameSoftTrigger2.value = true;
  isHandImg2.value = true;
  videoStreamUrl2.value = `http://127.0.0.1:8000/api/caiji2/startGrabbing?timestamp=${new Date().getTime()}`;
};

const startSingleCapture2 = () => {
  isHandImg2.value = true;
  videoStreamUrl2.value = `http://127.0.0.1:8000/api/caiji2/grabOne?timestamp=${new Date().getTime()}`;
};

const stopCapture2 = async () => {
  disableCloseCamera2.value = false;
  disableContinuousCapture2.value = false;
  disableSingleCapture2.value = false;
  disableStopCapture2.value = true;
  disableFrameSoftTrigger2.value = false;
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/caiji2/stopGrabbing');
    console.log(response.data.data);
    ElMessage({
      message: response.data.data,
      type: 'success'
    });
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const startFrameSoftTrigger2 = () => {
  // 处理帧软触发逻辑
  // 启用/禁用按钮状态
};

const handleChange7 = async () => {
  const formData = new FormData();
  formData.append('exposureTime', exposureTime2.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/exposureTime', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange8 = async () => {
  const formData = new FormData();
  formData.append('gain', gain2.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/gain', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange9 = async () => {
  const formData = new FormData();
  formData.append('minAreaRatio', minAreaRatio2.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/minAreaRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange10 = async () => {
  const formData = new FormData();
  formData.append('maxAreaRatio', maxAreaRatio2.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/maxAreaRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange11 = async () => {
  const formData = new FormData();
  formData.append('roiRatio', roiRatio2.value.toString());
  const roi1 = ((1 - roiRatio2.value) / 2.0 * 100) + '%';
  const roi2 = roiRatio2.value * 100 + '%';
  console.log(roi1, roi2);
  distance2.value = roi1;
  size2.value = roi2;
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/roiRatio', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

const handleChange12 = async () => {
  const formData = new FormData();
  formData.append('minGradientValue', minGradientValue2.value.toString());
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/caiji2/minGradientValue', formData);
    console.log(response.data.data);
  } catch (error) {
    console.error('请求失败:', error);
  }
};

// 生命周期钩子
let websocket: WebSocket;
onMounted(() => {
  // 创建 WebSocket 连接
  websocket = new WebSocket('ws://localhost:8765');

  // 当 WebSocket 连接打开时触发
  websocket.onopen = (event) => {
    console.log('WebSocket connection established.');
  };

  // 当收到 WebSocket 消息时触发
  websocket.onmessage = (event) => {
    const receivedData = event.data;
    console.log('Received from server: ' + receivedData);
    // 弹出 Element Plus 通知
    showNotification(receivedData);
  };

  // 当 WebSocket 连接关闭时触发
  websocket.onclose = (event) => {
    if (event.wasClean) {
      console.log('WebSocket connection closed cleanly, code=' + event.code + ', reason=' + event.reason);
    } else {
      console.error('WebSocket connection abruptly closed');
    }
  };

  // 当 WebSocket 发生错误时触发
  websocket.onerror = (error) => {
    console.error('WebSocket error: ' + error.message);
  };
});

onUnmounted(() => {
  // 在组件销毁前关闭 WebSocket 连接
  websocket.close();
  console.log('WebSocket connection closed');
});
</script>

<style scoped>
.container {
  display: flex;
  position: relative;
}

.dialog-container {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
}

.header {
  width: 100%;
  padding: 10px 10px 20px 0;
}

.header .input {
  width: 20%;
  padding: 0 10px;
}

.main {
  width: 100%;
  padding: 10px;
}

.main .image-container {
  width: 100%;
  /* 你的图像宽度 */
  height: 0;
  position: relative;
  /* 使内部元素相对于此容器定位 */
  padding-top: 75%;
}

.main .image-container img {
  width: 100%;
  /* 图像宽度为100%以充满容器 */
  height: 100%;
  /* 图像高度为100%以充满容器 */
  display: block;
  position: absolute;
  left: 0;
  top: 0;
}

.main .image-border {
  position: absolute;
  top: 10%;
  /* 调整边框距离上方的距离 */
  left: 10%;
  /* 调整边框距离左侧的距离 */
  right: 10%;
  /* 调整边框距离右侧的距离 */
  bottom: 10%;
  /* 调整边框距离下方的距离 */
  border: 2px solid red;
  /* 边框样式 */
  box-sizing: border-box;
  width: 80%;
  /* 调整边框宽度 */
  height: 80%;
  /* 调整边框高度 */
}

.footer {
  display: flex;
  flex-direction: column;
  /* 使子项在容器内均匀分布 */
  align-items: center;
  /* 垂直居中对齐 */
  padding: 10px;
}

.footer .f1 {
  position: relative;
}

.footer .f1 .g1 {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}

.footer .f1 .g2 {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}

.footer .f1 .g3 {
  display: flex;
  justify-content: space-between;

}

.footer .f1 .input {
  margin-right: 10px;
}

.footer .f2 {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 10px;
}

.footer .f2 .left .vertical-radio-group {
  display: flex;
  flex-direction: column;
  /* 设置为垂直排列 */
  align-items: flex-start;
}

.footer .f2 .right .g1 {
  padding: 0px 10px 10px 0;
}
</style>