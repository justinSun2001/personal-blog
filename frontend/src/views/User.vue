<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page">
    <div class="main">
      <div class="content">
        <div class="left"></div>
        <div class="right">
          <div class="r1">
            <div class="moren" :class="{ active: Active }" @click="changeColor">
              登陆
            </div>
            <div :class="{ active: !Active }" @click="changeColor">
              注册
            </div>
          </div>
          <div class="r2">
            <!-- 传递 Active 给子组件，并监听子组件的事件 -->
            <Login v-if="Active" @changeActive="changeActive" />
            <Register v-if="!Active" @changeActive="changeActive" />
          </div>
          <div class="r3">
            <a href="#">忘记密码？</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';

// 异步组件导入
const Login = defineAsyncComponent(() => import('@/components/Login.vue'));
const Register = defineAsyncComponent(() => import('@/components/Register.vue'));

// 定义 reactive 数据
const Active = ref(true);

// 定义方法
const changeColor = () => {
  Active.value = !Active.value;
};

const changeActive = () => {
  Active.value = !Active.value;
};
</script>

<style scoped lang="scss">
.page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.moren {
  margin-right: 20px;
}

.active {
  color: black;
  border-bottom: 2px solid red;
}

.right {
  width: 40%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.r1 {
  display: flex;
  flex-direction: row;
  padding-left: 5%;
  color: #cdccccd6;
}

.r3 {
  padding-left: 5%;
}

a {
  text-decoration: none;
  color: coral;
  font-size: 12px;
}

@media screen and (min-width: 960px) {
  .page {
    background: url('@/assets/img/bg3.png');
  }

  .content {
    width: 750px;
    height: 350px;
    display: flex;
  }

  .left {
    width: 60%;
    height: 100%;
    background-color: turquoise;
    opacity: 0.8;
  }
}

@media screen and (max-width: 960px) {
  .page {
    background: url('@/assets/img/bg1.png');
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
  }

  .content {
    width: 350px;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .right {
    width: 100%;
  }
}
</style>
