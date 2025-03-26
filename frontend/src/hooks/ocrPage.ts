import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import http from '@/services/http';

// 定义表单数据的类型
interface FormData {
  型号1: string;
  型号2: string;
  标识: string;
  版号: string;
  片号: string;
  检验批号: string;
  生产批号: string;
  备注: string;
  目检合格数: string;
  筛选单状态: string;
  收费状态: string;
  是否合检: string;
}

// 定义表单 Mixin
export const formMixin = {
  setup() {
    const formData = ref<FormData>({
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
      是否合检: '',
    });

    const getUniqueOptions = (property: keyof FormData, data: any[]) => {
      const uniqueOptionsMap: Record<string, any> = {};
      data.forEach((option) => {
        const propertyValue = option[property];
        if (propertyValue != null) {
          if (!uniqueOptionsMap[propertyValue]) {
            uniqueOptionsMap[propertyValue] = option;
          }
        }
      });
      return Object.values(uniqueOptionsMap);
    };

    const submitForm = async () => {
      try {
        const data = formData;
        console.log(data);
        const response = await http.post('http://127.0.0.1:8000/api/upload', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Request succeeded');
        ElMessage({
          message: '提交成功',
          type: 'success',
        });
      } catch (error) {
        console.error('Request failed:', error);
        ElMessage({
          message: '提交失败',
          type: 'error',
        });
      } finally {
        setTimeout(() => {
          emit('childEvent');
        }, 1000);
      }
    };

    return {
      formData,
      getUniqueOptions,
      submitForm,
    };
  },
};

// 定义表格 Mixin
export const tableMixin = {
  setup() {
    const selection = ref<any[]>([]);
    const selectedData = ref<any[]>([]);

    const handleChildEvent = async (data: any[], total: number, pageSizes: number[], updateDisplayData: () => void) => {
      try {
        const response = await http.get('http://127.0.0.1:8000/api/data');
        for (let i = 0; i < response.data.data.length; i++) {
          data[i] = response.data.data[i];
          data[i].产品负责人 = '孙纽佳';
          data[i].联系电话 = '1910';
        }
        total = response.data.data.length;
        pageSizes.length = 0;
        pageSizes.push(10, 20, total);
        updateDisplayData();
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const handleSelectionChange = (newSelection: any[]) => {
      selection.value = newSelection;
      if (newSelection.length > 0) {
        console.log('Selected Data:', newSelection);
        selectedData.value = newSelection;
      }
    };

    const handleTypeChange = (value: string, row: FormData) => {
      return row.型号1 === value;
    };

    const handleNameChange = (value: string, row: FormData) => {
      return row.型号2 === value;
    };

    const handleFilterChange = (value: string, row: FormData) => {
      return row.筛选单状态 === value;
    };

    const handleChargeChange = (value: string, row: FormData) => {
      return row.收费状态 === value;
    };

    const handleCheckChange = (value: string, row: FormData) => {
      return row.是否合检 === value;
    };

    const getUniqueOptions = (property: string, data: FormData[]) => {
      const uniqueOptionsMap: Record<string, FormData> = {};
      data.forEach((option: FormData) => {
        const propertyValue = option[property];
        if (propertyValue != null) {
          if (!uniqueOptionsMap[propertyValue]) {
            uniqueOptionsMap[propertyValue] = option;
          }
        }
      });
      const uniqueOptions = Object.values(uniqueOptionsMap);
      if (property === '型号1' || property === '型号2') {
        return uniqueOptions.map((option) => ({ text: option[property], value: option[property] }));
      }
      return uniqueOptions;
    };

    return {
      selection,
      selectedData,
      handleChildEvent,
      handleSelectionChange,
      handleTypeChange,
      handleNameChange,
      handleFilterChange,
      handleChargeChange,
      handleCheckChange,
      getUniqueOptions,
    };
  },
};
