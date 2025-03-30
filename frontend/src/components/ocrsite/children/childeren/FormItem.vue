<template>
  <div>
    <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="型号1" prop="型号1">
            <el-input v-model="formData.型号1" placeholder="请输入型号1">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="型号2" prop="型号2">
            <el-input v-model="formData.型号2" placeholder="请输入型号2">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标识" prop="标识">
            <el-input v-model="formData.标识" placeholder="请输入标识">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="版号" prop="版号">
            <el-input v-model="formData.版号" placeholder="请输入版号">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="片号" prop="片号">
            <el-input v-model="formData.片号" placeholder="请输入片号">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="检验批号" prop="检验批号">
            <el-input v-model="formData.检验批号" placeholder="请输入检验批号">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="生产批号" prop="生产批号">
            <el-input v-model="formData.生产批号" placeholder="请输入生产批号">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="备注">
        <el-input v-model="formData.备注" placeholder="请输入备注">
        </el-input>
      </el-form-item>
      <el-form-item label="目检合格数" prop="目检合格数">
        <el-input v-model="formData.目检合格数" placeholder="请输入目检合格数">
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="筛选单状态" prop="筛选单状态">
            <el-select v-model="formData.筛选单状态" placeholder="请选择筛选单状态" filterable clearable>
              <el-option v-for="option in options1" :key="option.value" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收费状态" prop="收费状态">
            <el-select v-model="formData.收费状态" placeholder="请选择收费状态" filterable clearable>
              <el-option v-for="option in options2" :key="option.value" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否合检" prop="是否合检">
            <el-select v-model="formData.是否合检" placeholder="请选择是否合检" filterable clearable>
              <el-option v-for="option in options3" :key="option.value" :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="handleSubmitForm(ruleFormRef)">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormData } from '@/types/index'
import type { FormInstance, FormRules } from 'element-plus'
import http from '@/services/http';

const options1 = [
  { label: '拟制中', value: '拟制中' },
  { label: '未完成', value: '未完成' },
  { label: '已完成', value: '已完成' },
];
const options2 = [
  { label: '已收费', value: '已收费' },
  { label: '未收费', value: '未收费' },
]
const options3 = [
  { label: '是', value: '是' },
  { label: '否', value: '否' },
]
// 定义空表单的默认值
const emptyForm: FormData = {
  型号1: '',
  型号2: '',
  标识: '',
  版号: '',
  片号: '',
  检验批号: '',
  生产批号: '',
  备注: '',
  目检合格数: '',
  筛选单状态: '',
  收费状态: '',
  是否合检: ''
}

const props = defineProps<{
  data?: FormData | null
}>()

const emit = defineEmits(['submitData'])
const formData = ref<FormData>({ ...emptyForm })
// 监听props.data变化
watch(
  () => props.data,
  (newVal) => {
    console.log('props.data变化:', newVal);
    if (newVal) {
      formData.value = props.data as FormData;
    } else {
      formData.value = { ...emptyForm };
    }
  },
  { immediate: true }
)

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules<FormData>>({
  型号1: [{ required: true, message: '请输入型号1', trigger: 'blur' }],
  型号2: [{ required: true, message: '请输入型号2', trigger: 'blur' }],
  标识: [{ required: true, message: '请输入标识', trigger: 'blur' }],
  版号: [{ required: true, message: '请输入版号', trigger: 'blur' }],
  片号: [{ required: true, message: '请输入片号', trigger: 'blur' }],
  检验批号: [{ required: true, message: '请输入检验批号', trigger: 'blur' }],
  生产批号: [{ required: true, message: '请输入生产批号', trigger: 'blur' }],
  备注: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  目检合格数: [{ required: true, message: '请输入目检合格数', trigger: 'blur' }],
  筛选单状态: [{ required: true, message: '请选择筛选单状态', trigger: 'blur' }],
  收费状态: [{ required: true, message: '请选择收费状态', trigger: 'blur' }],
  是否合检: [{ required: true, message: '请选择是否合检', trigger: 'blur' }],
});


const handleSubmitForm = async (formEl: FormInstance | undefined) => {
  await submitForm(formEl);
  if (!isEdit.value) {
    formEl?.resetFields();
  }
};

// 计算当前是否为编辑模式
const isEdit = computed(() => !!props.data?.id) // 假设数据中有唯一标识字段id

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        // 根据模式选择不同API
        const url = isEdit.value
          ? `/ocr/update`
          : '/ocr/add';
        await http({
          url,
          method: 'post',
          data: formData.value,
          headers: { 'Content-Type': 'application/json' }
        });
        ElMessage.success(isEdit.value ? '数据更新成功' : '数据添加成功');
        emit('submitData', formData.value);
      }
      catch {
        ElMessage.error(isEdit.value ? '数据更新失败' : '数据添加失败');
      }
    } else {
      ElMessage.error('请输入正确的信息');
    }
  })
};

</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>