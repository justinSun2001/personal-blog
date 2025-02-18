<template>
  <div class="page">
    <div class="main">
      <div class="content">
        <div class="left"></div>
        <div class="right">
          <div class="r1">
            <div 
              class="moren" 
              :class="{login: Active}" 
              @click="changeColor"
            >
              登陆
            </div> 
            <div 
              :class="{login: !Active}" 
              @click="changeColor"
            >
              注册
            </div>
          </div>
          <div class="r2">
            <Login v-if="Active" />
            <Register v-if="!Active" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'

export default defineComponent({
  name: 'User',
  components: {
    Login,
    Register,
  },
  data() {
    return {
      Active: true,
    };
  },
  methods: {
    changeColor() {
      this.Active = !this.Active;
    },
  },
})
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

.login {
  color: black;
  border-bottom: 2px solid red;
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

  .right {
    width: 40%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .r1 {
    display: flex;
    padding-left: 5%;
    padding-bottom: 5%;
    color: #cdccccd6;
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
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .r1 {
    display: flex;
    padding-left: 5%;
    padding-bottom: 5%;
    color: #cdccccd6;
  }
}
</style>
