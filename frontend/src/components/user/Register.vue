<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" class="demo-ruleForm">
    <el-form-item prop="email">
      <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="ruleForm.pass" placeholder="密码" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" placeholder="确认密码" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-col :span="16">
        <el-input type="text" v-model="ruleForm.code" placeholder="验证码" autocomplete="off"></el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="sendCode">获取</el-button>
      </el-col>
    </el-form-item>
    <el-button type="primary" @click="submitForm(ruleFormRef)">
      注册
    </el-button>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { encryptParam } from '@/common/encrypt.ts';
import { register, getCode } from '@/services/user';
import type { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus'


interface RegisterForm {
  email: string;
  username: string;
  pass: string;
  checkPass: string;
  code?: string;
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  setup(_, { emit }) {  // 这里通过 destructuring 获取 emit
    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<RegisterForm>({
      email: '',
      username: '',
      pass: '',
      checkPass: '',
      code: ''
    })
    const validPass = (_: unknown, value: string, callback: (error?: Error) => void) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
        if (!pwdRegex.test(value)) {
          callback(new Error('密码必须包含字母和数字，且不少于8个字符'));
        }
        if (ruleForm.checkPass !== '') {
          if (!ruleFormRef.value) return
          ruleFormRef.value.validateField('checkPass')
        }
        callback()
      }
    }
    const checkPass = (_: unknown, value: string, callback: (error?: Error) => void) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== ruleForm.pass) {
        callback(new Error('密码不一致'));
      } else {
        callback();
      }
    }
    const rules = reactive<FormRules<typeof ruleForm>>({
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      pass: [
        {
          validator: validPass,
          trigger: 'blur'
        }
      ],
      checkPass: [
        {
          validator: checkPass,
          trigger: 'blur'
        }
      ],
      code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ]
    })
    const sendCode = async () => {
      if (ruleForm.email === '') {
        ElMessage.error('请输入邮箱地址');
        return;
      }
      try {
        const response: AxiosResponse = await getCode({ email: ruleForm.email });  // 发送登录请求
        if (response.data.success == true) {
          ElMessage.success(response.data.message);
        } else {
          ElMessage.error(response.data.err);
        }
      }
      catch (err) {
        ElMessage.error(err.response.data.data.err);
      }
    }
    const onFinish = async (values: RegisterForm) => {
      try {
        const encrypted = await encryptParam(values);  // 加密参数
        const response: AxiosResponse = await register({ encrypted, code: ruleForm.code });  // 发送登录请求
        const data = response.data;
        if (data.success == false) {
          ElMessage.error(data.err);
          return;
        } else if (data.success == true) {
          ElMessage.success(data.message);
          localStorage.setItem('user', values.email); // 保存用户登录名称
          emit('changeActive');
        }
      }
      catch (err) {
        ElMessage.error(err.response.data.data.err);
      }

    }
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      if (formEl) {
        formEl.validate((valid: boolean) => {
          if (valid) {
            const values = {
              email: ruleForm.email,
              username: ruleForm.username,
              pass: ruleForm.pass,
              checkPass: ruleForm.checkPass,
            }
            onFinish(values);
          } else {
            ElMessage.error("输入表单数据有误，请检查");
          }
        });
      }
    }

    return {
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      sendCode
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
