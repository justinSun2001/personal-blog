<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" class="demo-ruleForm">
    <el-form-item prop="email">
      <el-input v-model="ruleForm.email" placeholder="邮箱/用户名"></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="ruleForm.pass" placeholder="密码" autocomplete="off"></el-input>
    </el-form-item>
    <el-button type="primary" @click="submitForm(ruleFormRef)">
      登陆
    </el-button>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router';  // 引入 useRouter
import { encryptParam } from '@/common/encrypt.ts';
import { setRefreshTokenInLocal, setTokenInLocal } from '@/common/keyAndToken.ts';
import { login } from '@/services/user';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus'

// 定义 User 接口
interface User1 {
  email: string;
  pass: string;
}
interface User2 {
  pass: string;
  username: string;
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Login',
  setup() {
    const router = useRouter();  // 使用 useRouter 获取 router 实例

    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<User1>({
      email: localStorage.getItem('user') || '',
      pass: ''
    })
    const validPass = (_: unknown, value: string, callback: (error?: Error) => void) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const rules = reactive<FormRules<typeof ruleForm>>({
      email: [{ required: true, message: '请输入邮箱地址/用户名', trigger: 'blur' }],
      pass: [{ validator: validPass, trigger: 'blur' }]
    })
    const isEmail = (input: string) => {
      // Check if the input looks like an email address
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return regex.test(input);
    }

    const onFinish = async (values: User1 | User2) => {
      const encrypted = await encryptParam(values);  // 加密参数
      const response: AxiosResponse = await login({ encrypted });  // 发送登录请求
      const data = response.data;
      if (data.success == false) {
        ElMessage.error(data.err);
        return;
      } else {
        ElMessage.success('登录成功');
        setTokenInLocal(data.token); // 将token存储到localStorage中
        setRefreshTokenInLocal(data.refreshToken); // 将refreshToken存储到localStorage中
        // 根据类型分别处理
        if ('email' in values) {  // 判断 values 是否是 User1
          localStorage.setItem('user', values.email); // 保存用户登录名称
        } else {
          localStorage.setItem('user', values.username); // 保存用户登录名称
        }
        router.push('/home');
      }
    }
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid: boolean) => {
        if (valid) {
          let values: User1 | User2 = {} as User1 | User2;  // 显式指定 values 的类型
          if (isEmail(ruleForm.email)) {
            values = {
              email: ruleForm.email,
              pass: ruleForm.pass
            };
            onFinish(values);
          } else {
            values = {
              username: ruleForm.email,
              pass: ruleForm.pass
            };
            onFinish(values);
          }
        } else {
          ElMessage.error('输入格式不正确');
        }
      });
    }

    return {
      ruleFormRef,
      ruleForm,
      rules,
      submitForm
    }
  }
})
</script>

<style scoped lang="scss">
.el-button--primary {
  width: 80%;
  margin: 0 10%;
}

.el-form-item {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 18px;
}
</style>
