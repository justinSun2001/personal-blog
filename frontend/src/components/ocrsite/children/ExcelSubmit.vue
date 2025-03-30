<template>
  <div>
    <el-dialog title="文件添加表单" width="75%" :model-value="excelDialog" @close="closeDialog">
      <el-row style="line-height: 32px;">
        <span style="margin-right: 20px;">通过上传Excel文件自动填充:</span>
        <el-upload ref="uploadExcelRef" class="upload-image" :http-request="customUpload" :auto-upload="false"
          :before-upload="beforeUpload" :limit="1" :on-exceed="handleExceed" :on-remove="handleRemove"
          accept="application/*">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
        <el-button type="success" @click="uploadExcel">上传</el-button>
      </el-row>
      <!-- 表格显示主体 -->
      <el-table :data="data" style="width: 100%" :selection="selection" @selection-change="handleSelectionChange"
        row-key="id">
        <el-table-column type="selection" reserve-selection width="50" />
        <el-table-column label="快递单信息" header-align="center">
          <el-table-column prop="型号1" label="型号1" />
          <el-table-column prop="型号2" label="型号2" />
          <el-table-column prop="标识" label="标识" />
          <el-table-column prop="版号" label="版号" />
          <el-table-column prop="片号" label="片号" />
          <el-table-column prop="检验批号" label="检验批号" />
          <el-table-column prop="生产批号" label="生产批号" />
          <el-table-column prop="备注" label="备注" />
          <el-table-column prop="目检合格数" label="目检合格数" />
        </el-table-column>
        <el-table-column label="快递单状态" header-align="center">
          <el-table-column prop="筛选单状态" label="筛选单状态" :filters="[
            { text: '拟制中', value: '拟制中' },
            { text: '未完成', value: '未完成' },
            { text: '已完成', value: '已完成' },
          ]" :filter-method="handleFilterChange" />
          <el-table-column prop="收费状态" label="收费状态" :filters="[
            { text: '未收费', value: '未收费' },
            { text: '已收费', value: '已收费' },
          ]" :filter-method="handleChargeChange" />
          <el-table-column prop="是否合检" label="是否合检" :filters="[
            { text: '是', value: '是' },
            { text: '否', value: '否' },
          ]" :filter-method="handleCheckChange" />
        </el-table-column>
      </el-table>
      <el-divider />
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormData } from '@/types/index'
import http from '@/services/http';

const uploadExcelRef = ref<InstanceType<typeof import('element-plus')['ElUpload']>>();
const { excelDialog } = defineProps(['excelDialog'])
const emit = defineEmits(['closeDialog']);
const data = ref<FormData[]>([]);
const selection = ref<FormData[]>([]);
const handleSelectionChange = (val: FormData[]) => {
  selection.value = val;
};
const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');
};

// 上传前校验
const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('Excel 文件大小不能超过 5MB!');
    return false;
  }
  return true;
};

const uploadExcel = () => {
  if (!uploadExcelRef.value) return
  // 触发文件上传
  uploadExcelRef.value.submit();
};
// 自定义上传逻辑
const customUpload = async (options) => {
  try {
    const formData = new FormData();
    formData.append('excel', options.file); // 字段名需与后端一致
    formData.append('type', options.file.type); // 字段名需与后端一致
    // 发送Axios请求
    const response = await http.post(
      '/ocr/uploadExcel',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }
    );
    // 手动触发成功回调
    if (options.onSuccess) {
      handleSuccess(response);
    }
  } catch (error) {
    // 手动触发失败回调
    if (options.onError) {
      options.onError(error);
    }
    ElMessage.error('上传失败: ' + error.message);
  }
};

// 上传成功回调
const handleSuccess = (response) => {
  if (response.code === 200) {
    ElMessage.success(response.message);
    data.value = response.data[0].data;
  }
};

const handleExceed = () => {
  ElMessage.warning(`当前限制选择 1 个文件，请删除后重新选择！`);
};
const handleRemove = () => {
  uploadExcelRef.value?.clearFiles();
  // 清空表格数据
  data.value = [];
  selection.value = [];
  ElMessage.success('已删除上传文件');
}

const submitForm = async () => {
  if (selection.value.length > 0) {
    try {
      const res = await http.post('/ocr/multipleAdd',
        selection.value,
      );
      // 关闭对话框
      emit('closeDialog');
      // 清空表格数据
      data.value = [];
      selection.value = [];
      // 清空文件数据
      uploadExcelRef.value?.clearFiles();
      ElMessage({
        message: `${res.count}条${res.message}`,
        type: 'success',
      });
    } catch {
      ElMessage({
        message: '提交失败',
        type: 'error',
      });
    }
  } else {
    ElMessage({
      message: '提交项不能为空',
      type: 'warning',
    });
  }
};

// 筛选
const handleFilterChange = (value: string, row: FormData) => {
  return row.筛选单状态 === value;
};
const handleChargeChange = (value: string, row: FormData) => {
  return row.收费状态 === value;
};
const handleCheckChange = (value: string, row: FormData) => {
  return row.是否合检 === value;
};
</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>