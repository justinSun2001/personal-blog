<template>
  <div class="r2">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
      <el-form-item prop="email">
        <el-input v-model="ruleForm.email" placeholder="邮箱/用户名"></el-input>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input type="password" v-model="ruleForm.pass" placeholder="密码" autocomplete="off"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"> 
        登陆
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
  pass: string;
}

export default defineComponent({
  name: 'Login',
  setup() {
    const ruleForm = ref<RuleForm>({
      email: '',
      pass: ''
    })
    
    const rules = {
      email: [
        { required: true, message: '请输入邮箱地址/用户名', trigger: 'blur' }
      ],
      pass: [
        { 
          validator: (rule: any, value: string, callback: Function) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            }
            callback();
          },
          trigger: 'blur' 
        }
      ]
    }

    const submitForm = (formName: string) => {
      const formRef = (formName === 'ruleForm') ? ruleForm.value : null; // get form reference
      if (formRef) {
        formRef.validate((valid: boolean) => {
          if (valid) {
            const qs = require('qs');
            if(ruleForm.value.email === 'admin' && ruleForm.value.pass === 'admin') {
              // Mock login
              this.$store.commit('setUserToken', 'admin');
              this.$router.push({ path: "/home/1" });
            }
            this.axios.post('/user/login', qs.stringify(ruleForm.value))
              .then((response: any) => {
                console.log(response);
                if(ruleForm.value.email === response.data.email && ruleForm.value.pass === response.data.password) {
                  this.$store.commit('setUserToken', response.data._id);
                  this.$router.push({ path: "/home/1" });
                } else {
                  alert('密码错误');
                }
              })
          } else {
            alert('error!!');
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
