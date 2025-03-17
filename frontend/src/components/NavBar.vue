<template>
  <div class="top_container">
    <div class="left">
      <el-dropdown>
        <span class="user" :class="{ a1: inUse === '0' }">
          <img src="../assets/img/user.png" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onManageData()">管理数据</el-dropdown-item>
            <el-dropdown-item @click="onLogout()">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <ul class="nav">
      <li><a :class="{ a1: inUse === '1' }" @click="onGetHome"> HOME </a></li>
      <li><a :class="{ a1: inUse === '2' }" @click="onGetArticles"> ARTICLES </a></li>
      <li><a :class="{ a1: inUse === '3' }" @click="onGetNbadata"> NBAData </a></li>
      <li><a :class="{ a1: inUse === '4' }" @click="onGetAbout"> ABOUT </a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// 定义传入的 props
defineProps<{
  inUse?: string;
}>();

// 定义事件
const emit = defineEmits(['getHome', 'getArticles', 'getNbadata', 'getAbout', 'manageData', 'logout']);


const onManageData = () => {
  emit('manageData');
};

const onLogout = () => {
  emit('logout');
};

const onGetHome = () => {
  emit('getHome');
};

const onGetArticles = () => {
  emit('getArticles');
};

const onGetNbadata = () => {
  emit('getNbadata');
};

const onGetAbout = () => {
  emit('getAbout');
};
</script>

<style scoped lang="scss">
.top_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 54px;
  background-color: #29c0e2;
  font-size: 12px;
}

.left {
  display: flex;
  justify-content: flex-start;

  .user {
    padding: 12px 10px;

    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
  }
}

.nav {
  display: flex;
  justify-content: flex-start;
  margin-right: 10px;

  li {
    line-height: 54px;
    padding: 0px 10px;
  }
}

.a1 {
  border-bottom: 2px solid red;
}

a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: rgb(141, 138, 141);
  }
}

.bottom {
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
  color: black;
  background-color: rgba(0, 0, 0, 0.177);
}
</style>
