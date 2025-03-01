<template>
  <div>
    <h1>{{ props.title }}</h1>
    <el-form :model="author" :rules="rules" ref="authorFormRef">
      <el-form-item label="First Name" prop="first_name">
        <el-input v-model="author.first_name" placeholder="First name (Christian)"></el-input>
      </el-form-item>
      <el-form-item label="Family Name" prop="family_name">
        <el-input v-model="author.family_name" placeholder="Family name (Surname)"></el-input>
      </el-form-item>
      <el-form-item label="Date of birth">
        <el-date-picker v-model="author.date_of_birth" type="date" placeholder="Select date"></el-date-picker>
      </el-form-item>
      <el-form-item label="Date of death">
        <el-date-picker v-model="author.date_of_death" type="date" placeholder="Select date"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(authorFormRef)">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'

interface RuleForm {
  first_name: string;
  family_name: string;
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(['update:modelValue', 'submit']);
const author = ref({ ...props.modelValue });

const authorFormRef = ref<FormInstance>()
// 定义表单校验规则
const rules = reactive<FormRules<RuleForm>>({
  first_name: [
    { required: true, message: '名字不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '名字长度在 1 到 20 个字符之间', trigger: 'blur' },
  ],
  family_name: [
    { required: true, message: '姓氏不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '姓氏长度在 1 到 20 个字符之间', trigger: 'blur' },
  ],
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  // 触发表单验证
  await formEl.validate((valid) => {
    if (valid) {
      // 更新 v-model 绑定的值
      emits('update:modelValue', author.value);
      // 触发提交事件
      emits('submit');
    } else {
      ElMessage.error('请检查输入的信息是否正确');
    }
  });
};
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>