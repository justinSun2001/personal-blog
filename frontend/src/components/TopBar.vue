<template>
  <div class="top_container">
    <div class="left">
      <el-dropdown>
        <span class="user">
          <img src="../assets/img/user.png" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="ManageData()">管理数据</el-dropdown-item>
            <el-dropdown-item @click="logout()">登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <ul class="nav">
      <li><a :class="{ a1: inUse1 }" @click="getHome"> HOME </a></li>
      <li><a :class="{ a1: inUse2 }" @click="getArticles"> ARTICLES </a></li>
      <li><a :class="{ a1: inUse3 }" @click="getNbadata"> NBAData </a></li>
      <li><a :class="{ a1: inUse4 }" @click="getAbout"> ABOUT </a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// 定义组件的 Props
defineProps<{
  inUse1?: boolean;
  inUse2?: boolean;
  inUse3?: boolean;
  inUse4?: boolean;
}>();

const router = useRouter();
const ManageData = () => {
  router.push(`/userdata/datahome`);
}
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  router.push({ name: "User" });
}

const getHome = () => {
  router.push(`/home`);
};

const getArticles = () => {
  router.push(`/articlelist`);
};

const getNbadata = () => {
  router.push(`/nbadata`);
};

const getAbout = () => {
  router.push(`/about`);
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
</style>
