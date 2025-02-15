<template>
  <div class="r2">
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
  </div>
  <div class="r3">
    <a href="#">忘记密码？</a>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useStore } from 'vuex';  // 引入 useStore
import { useRouter } from 'vue-router';  // 引入 useRouter
import http from '../services/http.ts';

interface RuleForm {
  email: string;
  pass: string;
}

export default defineComponent({
  name: 'Login',
  setup() {
    const store = useStore();  // 使用 useStore 获取 store 实例
    const router = useRouter();  // 使用 useRouter 获取 router 实例

    const ruleFormRef = ref<FormInstance>()
    const ruleForm = reactive<RuleForm>({
      email: '',
      pass: ''
    })
    const validPass = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('Please input the password'))
      } else {
        callback()
      }
    }
    const rules = reactive<FormRules<typeof ruleForm>>({
      email: [{ required: true, message: '请输入邮箱地址/用户名', trigger: 'blur' }],
      pass: [{ validator: validPass, trigger: 'blur' }]
    })
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid: boolean) => {
          if (valid) {
            if(ruleForm.email === 'admin' && ruleForm.pass === 'admin') {
              // Mock login
              store.commit('setUserToken', 'admin');
              router.push({ path: "/home/1" });
            }
            // 创建 FormData 对象
            const formData = new FormData();
            formData.append('email', ruleForm.email);
            formData.append('pass', ruleForm.pass);
            http.post('/user/login', formData)
              .then((response: any) => {
                console.log(response);
                if(ruleForm.email === response.data.email && ruleForm.pass === response.data.password) {
                  store.commit('setUserToken', response.data._id);
                  router.push({ path: "/home/1" });
                } else {
                  alert('密码错误');
                }
              })
          } else {
            alert('error!!');
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
