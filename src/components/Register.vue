<template>
  <div class="r2">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef" class="demo-ruleForm">
      <el-form-item prop="email">
        <el-input v-model="ruleForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="userName">
        <el-input v-model="ruleForm.userName" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" v-model="ruleForm.pass" placeholder="密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" placeholder="确认密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleFormRef')"> 
        注册
      </el-button>
    </el-form>
  </div>
  <div class="r3">
    <a href="#">忘记密码？</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElForm } from 'element-plus'

interface RuleForm {
  email: string;
  userName: string;
  pass: string;
  checkPass: string;
}

export default defineComponent({
  name: 'Register',
  setup() {
    const ruleForm = ref<RuleForm>({
      email: '',
      userName: '',
      pass: '',
      checkPass: ''
    })
    
    const rules = {
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
      ],
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      pass: [
        { 
          validator: (rule: any, value: string, callback: Function) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
              if (!pwdRegex.test(value)) {
                callback(new Error('密码必须包含字母和数字，且不少于8个字符'));
              }
              if (ruleForm.value.checkPass !== '') {
                // Trigger validation on confirm password field when password changes
                this.$refs.ruleFormRef.validateField('checkPass');
              }
            }
            callback();
          },
          trigger: 'blur'
        }
      ],
      checkPass: [
        { 
          validator: (rule: any, value: string, callback: Function) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== ruleForm.value.pass) {
              callback(new Error('密码不一致'));
            } else {
              callback();
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const submitForm = (formName: string) => {
      const formRef = (formName === 'ruleFormRef') ? ruleForm.value : null
      if (formRef) {
        formRef.validate((valid: boolean) => {
          if (valid) {
            const qs = require('qs');
            // Simulate registration request
            this.axios.post('/user/register', qs.stringify(ruleForm.value))
              .then((response: any) => {
                console.log(response);
                alert('注册成功，请登录！');
              })
              .catch(function(error) {
                if (error.response) {
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                  alert('该邮箱已被注册');
                } else if (error.request) {
                  console.log(error.request);
                } else {
                  console.log('Error', error.message);
                }
              });
          } else {
            alert('错误');
            return false;
          }
        });
      }
    }

    return {
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

.r3 {
  padding-left: 5%;
  padding-top: 10%;
}

a {
  text-decoration: none;
  color: coral;
  font-size: 8px;
}
</style>
