<template>
  <div>
    <el-dialog title="编辑表单" :model-value="props.editDialog" @close="closeDialog">
      <FormItem :data=props.data @submitData="submitData" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import FormItem from './childeren/FormItem.vue';

const props = defineProps(['data', 'editDialog'])
const emit = defineEmits(['closeDialog', 'updateData']);



const closeDialog = () => {
  // 关闭对话框
  emit('closeDialog');
};

const submitData = (formData: FormData) => {
  emit('closeDialog');
  emit('updateData', formData);
}

</script>

<style scoped>
/* 若有样式需求可在此添加 */
</style>