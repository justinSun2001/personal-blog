<template>
  <h1>{{ props.title }}</h1>
  <el-form :model="article" :rules="rules" ref="articleFormRef" label-width="auto" style="max-width: 1000px">
    <el-form-item label="标题" prop="title">
      <el-input v-model="article.title" placeholder="输入标题"></el-input>
    </el-form-item>

    <el-form-item label="作者" prop="author">
      <el-select v-model="article.author" placeholder="选择作者">
        <el-option v-for="author in article.sortedAuthors" :key="author._id"
          :label="author.first_name + ' ' + author.family_name" :value="author._id" />
      </el-select>
    </el-form-item>

    <el-form-item label="摘要" prop="summary">
      <el-input v-model="article.summary" type="textarea" placeholder="输入摘要"></el-input>
    </el-form-item>

    <el-form-item label="正文" prop="text">
      <el-input v-model="article.text" type="textarea" placeholder="输入正文(支持md语法)" :rows="10"></el-input>
    </el-form-item>

    <el-form-item label="创建日期" prop="date">
      <el-date-picker v-model="article.date" type="date" :shortcuts="shortcuts" format="YYYY/MM/DD"
        value-format="YYYY-MM-DD" placeholder="选择日期" />
    </el-form-item>

    <el-form-item label="类别" prop="genres">
      <div v-for="genre in article.genres" :key="genre._id" style="display: inline; padding-right: 10px;">
        <el-checkbox :label="genre.name" v-model="genre.checked"></el-checkbox>
      </div>
    </el-form-item>

    <el-form-item label="上传图片">
      <el-upload :file-list="article.fileList" class="upload-demo" list-type="picture-card" :auto-upload="false"
        :limit="1" :on-exceed="exceedError" :on-change="onChange" :on-remove="onRemove">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(articleFormRef)">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { UploadFile, UploadFiles } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import type { Genre } from '@/types/index';


interface RuleForm {
  title: string;
  author: string;
  summary: string;
  text: string;
  date: string;

  genres: Genre[];
}

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

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

const article = ref(props.modelValue);

const emits = defineEmits(['update:modelValue', 'submit']);

const exceedError = () => {
  alert('只能上传一张图片');
}
const onChange = (_: UploadFile, uploadFiles: UploadFiles) => {
  article.value.fileList = uploadFiles;
}
const onRemove = (_: UploadFile, uploadFiles: UploadFiles) => {
  article.value.fileList = uploadFiles;
}
const checkTitle = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (value.length < 3 || value.length > 30) {
    callback(new Error(`标题长度在 3 到 30 个字符之间，当前字符数为${value.length}`));
  } else {
    callback();
  }
}
const checkSummary = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (value.length < 20 || value.length > 250) {
    callback(new Error(`标题长度在 20 到 250 个字符之间，当前字符数为${value.length}`));
  } else {
    callback();
  }
}
const checkText = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (value.length < 50 || value.length > 350000) {
    callback(new Error(`正文长度在 50 到 35000 个字符之间，当前字符数为${value.length}`));
  } else {
    callback();
  }
}
const checkGenre = (_: unknown, value: Genre[], callback: (error?: Error) => void) => {
  if (value.some((genre: Genre) => genre['checked'] === true)) {
    callback();
  } else {
    callback(new Error('请选择至少一个类别'));
  }
}
const articleFormRef = ref<FormInstance>()
// 定义表单校验规则
const rules = reactive<FormRules<RuleForm>>({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { validator: checkTitle, trigger: 'blur' },
  ],
  author: [
    { required: true, message: '作者不能为空', trigger: 'blur' },
  ],
  summary: [
    { required: true, message: '摘要不能为空', trigger: 'blur' },
    { validator: checkSummary, trigger: 'blur' },
  ],
  text: [
    { required: true, message: '正文不能为空', trigger: 'blur' },
    { validator: checkText, trigger: 'blur' },
  ],
  date: [
    { required: true, message: '创建日期不能为空', trigger: 'blur' },
  ],
  genres: [
    { required: true, validator: checkGenre, trigger: 'change' },
  ]
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return;
  }
  // 触发表单验证
  await formEl.validate((valid) => {
    if (valid) {
      // 更新 v-model 绑定的值
      emits('update:modelValue', article.value);
      // 触发提交事件
      emits('submit');
    } else {
      ElMessage.error('请检查输入的信息是否正确');
    }
  });
};

</script>

<style scoped>
/* Add any specific styles for this component */
</style>
