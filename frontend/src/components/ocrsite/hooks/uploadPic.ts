import type { picResponseType } from '@/types/index';
import http from '@/services/http';
import { ElMessage } from 'element-plus';
// 上传图片
export const uploadPic = async (file: File) => {
  const formData = new FormData();
  formData.append('pic', file); // 字段名需与后端一致
  formData.append('type', file.type); // 字段名需与后端一致
  const response: picResponseType = await http.post('/ocr/uploadPic', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 100000,
  });
  return response;
};
// 上传前校验
export const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!');
    return false;
  }
  return true;
};
