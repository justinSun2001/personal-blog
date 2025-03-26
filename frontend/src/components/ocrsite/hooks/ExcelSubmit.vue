<template>
  <div>
    <el-dialog title="文件添加表单" :model-value="excelDialog" @close="closeDialog">
      <el-row>
        通过上传Excel文件自动填充：
        <el-upload ref="uploadExcelRef" class="upload-image" action="http://127.0.0.1:8000/api/uploadExcel"
          :auto-upload="false" :on-success="handleExcelSuccess">
          <template #trigger>
            <el-button type="primary">选择文件</el-button>
          </template>
        </el-upload>
        <el-button type="success" @click="uploadExcel">上传</el-button>
      </el-row>
      <!-- 表格显示主体 -->
      <el-table :data="data" style="width: 100%" :selection="selection" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" width="50" />
        <el-table-column label="">
          <el-table-column prop="型号1" label="产品型号" :filters="getUniqueOptions('型号1')"
            :filter-method="handleTypeChange" />
          <el-table-column prop="型号2" label="产品名称" :filters="getUniqueOptions('型号2')"
            :filter-method="handleNameChange" />
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
        <el-table-column label="申请单信息" header-align="center">
          <el-table-column prop="产品负责人" label="产品负责人" />
          <el-table-column prop="联系电话" label="联系电话" />
          <el-table-column prop="生产批号" label="生产批号" />
          <el-table-column prop="检验批号" label="检验批号" />
        </el-table-column>
      </el-table>
      <el-divider />
      <el-button type="primary" @click="submitForm">提交</el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';


const uploadExcelRef = ref<InstanceType<typeof import('element-plus')['ElUpload']>>();
const { excelDialog } = defineProps(['excelDialog'])
const emit = defineEmits(['closeDialog']);

const data = ref<any[]>([]);
const selection = ref<any[]>([]);
const idsToSubmit = ref<any[]>([]);


const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');
  // 清空表格数据
  data.value = [];
  // 清空文件数据
  uploadExcelRef.value?.clearFiles();
};

const uploadExcel = () => {
  // 触发文件上传
  uploadExcelRef.value?.submit();
};

const handleExcelSuccess = (response: any) => {
  // 处理上传成功的响应
  console.log(response);
  data.value = response.data;
};

const submitForm = async () => {
  if (selection.value.length > 0) {
    idsToSubmit.value = selection.value;
    try {
      await http.post('http://127.0.0.1:8000/api/submit', {
        ids: idsToSubmit.value,
      });
      ElMessage({
        message: '提交成功',
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
  // 关闭对话框
  emit('closeDialog');
  // 清空表格数据
  data.value = [];
  // 清空文件数据
  uploadExcelRef.value?.clearFiles();
};

const handleSelectionChange = (val: any[]) => {
  selection.value = val;
};

const getUniqueOptions = (field: string) => {
  // 这里需要根据实际情况实现获取唯一选项的逻辑
  return [];
};

const handleTypeChange = (value: any, row: any) => {
  return row.型号1 === value;
};

const handleNameChange = (value: any, row: any) => {
  return row.型号2 === value;
};

const handleFilterChange = (value: any, row: any) => {
  return row.筛选单状态 === value;
};

const handleChargeChange = (value: any, row: any) => {
  return row.收费状态 === value;
};

const handleCheckChange = (value: any, row: any) => {
  return row.是否合检 === value;
};
</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>