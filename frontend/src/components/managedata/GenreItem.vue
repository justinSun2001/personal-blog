<template>
  <div>
    <h1>{{ props.title }}</h1>
    <el-form :model="genre" :rules="rules" ref="genreFormRef">
      <el-form-item label="类别名称" prop="name">
        <el-input v-model="genre.name" placeholder="输入类别名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(genreFormRef)">
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
  name: string;
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
const genre = ref({ ...props.modelValue });


const genreFormRef = ref<FormInstance>()
// 定义表单校验规则
const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '类别名称不能为空', trigger: 'blur' },
    { min: 2, max: 20, message: '类别名称长度在 2 到 20 个字符之间', trigger: 'blur' },
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
      emits('update:modelValue', genre.value);
      // 触发提交事件
      emits('submit');
    } else {
      ElMessage.error('请检查输入的信息是否正确');
    }
  });
};
</script>