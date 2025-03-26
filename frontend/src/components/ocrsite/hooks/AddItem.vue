<template>
  <div>
    <el-dialog title="输入表单" :model-value="addDialog" @close="closeDialog">
      <FormItem @submitData="submitData" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import FormItem from './FormItem.vue';

const { addDialog } = defineProps(['addDialog'])
const emit = defineEmits(['closeDialog', 'addData']);
const closeDialog = () => {
  emit('closeDialog');
};

const submitData = () => {
  emit('closeDialog');
  emit('addData');
}

</script>

<style scoped>
.upload-image {
  padding-right: 20px;
  padding-bottom: 10px;
}
</style>