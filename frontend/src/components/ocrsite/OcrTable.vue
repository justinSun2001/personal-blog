<template>
  <el-card class="box-card">

    <!-- 头部的标签 -->
    <el-tabs type="card">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('添加')">
            <el-icon>
              <EditPen />
            </el-icon>
            手动添加
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('Excel文件添加')">
            <el-icon>
              <FolderOpened />
            </el-icon>
            Excel文件添加
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('批量照片上传添加')">
            <el-icon>
              <PictureFilled />
            </el-icon>
            照片上传添加
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('镜头拍摄添加')">
            <el-icon>
              <VideoCamera />
            </el-icon>
            镜头拍摄添加
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('编辑')">
            <el-icon>
              <Edit />
            </el-icon>
            编辑
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('删除')">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleTabClick('导出')">
            <el-icon>
              <Document />
            </el-icon>
            导出
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label" @click="handleExportAll">
            <el-icon>
              <Files />
            </el-icon>
            全部数据导出
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 表格显示主体 -->
    <el-table :data="data" style="width: 100%" :selection="selection" @selection-change="handleSelectionChange"
      row-key="id">
      <el-table-column type="selection" reserve-selection width="50" />
      <el-table-column type="index" :index="getIndex" width="100" />
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
      <el-table-column fixed="right" label="操作" header-align="center" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="primary" size="small" @click="handleDelete([scope.row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
      :page-sizes="pageSizes" :page-size="pageSize" layout="sizes, prev, pager, next, jumper" :total="total"
      style="margin-top: 20px">
    </el-pagination>
  </el-card>

  <!-- 项目添加对话框、项目编辑对话框 -->
  <AddItem :addDialog="Dialog.addDialog" @closeDialog="handleCloseAddDialog" @addData="addData" />
  <EditItem :data="selectedData" :editDialog="Dialog.editDialog" @closeDialog="handleCloseEditDialog"
    @updateData="updateData" />
  <ExcelSubmit :excelDialog="Dialog.excelDialog" @closeDialog="handleCloseExcelDialog" />
  <PicSubmit :picDialog="Dialog.picDialog" @closeDialog="handleClosePicDialog" />
  <CameraSubmit :cameraDialog="Dialog.cameraDialog" @closeDialog="handleCloseCameraDialog" @addData="addData" />
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import AddItem from './children/AddItem.vue';
import EditItem from './children/EditItem.vue';
import ExcelSubmit from './children/ExcelSubmit.vue';
import PicSubmit from './children/PicSubmit.vue';
import CameraSubmit from './children/CameraSubmit.vue';
import { EditPen, FolderOpened, PictureFilled, VideoCamera, Edit, Delete, Document, Files } from '@element-plus/icons-vue';
import http from '@/services/http';
import type { FormData } from '@/types/index'

// 对话框状态管理
const Dialog = reactive({
  addDialog: false,
  editDialog: false,
  cameraDialog: false,
  excelDialog: false,
  picDialog: false
})
const handleCloseEditDialog = () => {
  Dialog.editDialog = false;
}
const handleCloseExcelDialog = () => {
  Dialog.excelDialog = false;
}
const handleClosePicDialog = () => {
  Dialog.picDialog = false;
}
const handleCloseCameraDialog = () => {
  Dialog.cameraDialog = false;
}
const handleCloseAddDialog = () => {
  Dialog.addDialog = false;
}
const addData = () => {
  getData();
}
const updateData = (formData: FormData) => {
  // 找到指定 id 的数据并更新
  const index = data.value.findIndex(item => item.id === formData.id);
  if (index !== -1) {
    // 这里必须使用解构赋值来触发响应性，不然的话data无法监听到，因为只是引用变了，值没变(错误）)
    // data.value[index] = { ...formData };
    // 引用地址变了就会触发响应性，所以这里可以直接赋值
    data.value[index] = formData;
  }
}

// 表格数据管理
const data = ref<FormData[]>([]);
const selection = ref<FormData[]>([]);
const handleSelectionChange = (val: FormData[]) => {
  selection.value = val;
};
const getIndex = computed(() => {
  return (index: number) => {
    return (currentPage.value - 1) * pageSize.value + index + 1;
  };
});

// 分页数据管理
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(10);
const pageSizes = ref([10, 20, 50]);
// 分页数据变化
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage;
};

// 编辑
const selectedData = ref<FormData | null>(null);
const handleEdit = (row: FormData) => {
  //这里对row的数据进行解构，断开响应性，避免修改时，data也会变化
  selectedData.value = { ...row };
  Dialog.editDialog = true;
};

// 删除
const handleDelete = async (ids: number[]) => {
  try {
    const result: { message: string, deletedCount: string } = await http.post('/ocr/delete', {
      ids
    });
    // 过滤掉指定 id 的数据
    data.value = data.value.filter(item => !ids.includes(item.id as number));
    ElMessage({
      message: `${result.message}: ${result.deletedCount} 条`,
      type: 'success',
    });
  } catch {
    ElMessage({
      message: '删除失败',
      type: 'error',
    });
  }
};

// 表头管理
const idsToDelete = ref<number[]>([]);
const idsToExport = ref<number[]>([]);
const handleTabClick = (name: string) => {
  switch (name) {
    case '添加':
      Dialog.addDialog = true;
      break;
    case 'Excel文件添加':
      Dialog.excelDialog = true;
      break;
    case '批量照片上传添加':
      Dialog.picDialog = true;
      break;
    case '镜头拍摄添加':
      Dialog.cameraDialog = true;
      break;
    case '编辑':
      if (selection.value.length === 0) {
        ElMessage({
          message: '编辑项不能为空',
          type: 'warning',
        });
      } else if (selection.value.length > 1) {
        ElMessage({
          message: '不能同时编辑多项',
          type: 'warning',
        });
      } else {
        selectedData.value = selection.value[0];
        Dialog.editDialog = true;
      }
      break;
    case '删除':
      if (selection.value.length > 0) {
        idsToDelete.value = selection.value.map(item => item.id as number);
        handleDelete(idsToDelete.value);
      } else {
        ElMessage({
          message: '删除项不能为空',
          type: 'warning',
        });
      }
      break;
    case '导出':
      if (selection.value.length > 0) {
        idsToExport.value = selection.value.map(item => item.id as number);
        handleExport(idsToExport.value);
      } else {
        ElMessage({
          message: '导出项不能为空',
          type: 'warning',
        });
      }
      break;
  }
};
// 导出
const handleExport = async (ids: number[]) => {
  try {
    const start_time = Date.now();
    const resData: Blob = await http.post('/ocr/export', {
      ids
    }, {
      responseType: 'blob'
    });
    const blob = new Blob([resData]);
    const filename = 'export_data.xlsx';
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    console.log(Date.now() - start_time);
    ElMessage({
      message: '导出成功',
      type: 'success',
    });
  } catch {
    ElMessage({
      message: '导出失败',
      type: 'error',
    });
  }
};
// 全部数据导出（流式）
import createWriteStream from 'streamsaver';
const handleExportAll = async () => {
  try {
    const start_time = performance.now();
    const response = await fetch('http://localhost:3000/ocr/exportAll', {
      method: 'get',
    });
    if (!response.ok) throw new Error('请求失败');
    // 检查 response.body 是否为 null
    if (response.body === null) {
      throw new Error('响应体为空');
    }
    // 使用 StreamSaver 创建可写流
    const fileStream = createWriteStream('export_data.xlsx');
    const writer = fileStream.getWriter();
    // 获取响应流并写入文件
    const reader = response.body.getReader();
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) {
        writer.close();
        return;
      }
      await writer.write(value);
      pump(); // 递归调用保持流式处理
    };
    await pump();
    console.log(performance.now() - start_time);
  } catch {
    ElMessage.error('导出失败')
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

//获取制定页数据
const getData = async () => {
  try {
    total.value = await http.get('/ocr/sum');
    data.value = await http.post('/ocr/get', { pageSize: pageSize.value, page: currentPage.value });
  } catch {
    ElMessage({
      message: '获取数据失败',
      type: 'error',
    });
  }
};

watch([currentPage, pageSize], () => {
  getData();
}, { immediate: true });

</script>

<style scoped>
.box-card {
  margin: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-tabs__item) {
  color: #409eff;
}

:deep(.el-pagination__editor.el-input) {
  width: 66px;
}
</style>