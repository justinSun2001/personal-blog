<template>
  <NavBar :inUse="inUse" @getHome="getHome" @getArticles="getArticles" @getNbadata="getNbadata" @getAbout="getAbout"
    @manageData="ManageData" @logout="logout" />
  <keep-alive>
    <component :is="componentName" />
  </keep-alive>
  <div class="bottom">
    <BottomContent></BottomContent>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { shallowRef, ref, onMounted } from 'vue'
import NavBar from "@/components/NavBar.vue";
import HomePage from '@/components/sitepage/HomePage.vue'
import ArticleLists from '@/components/sitepage/ArticleLists.vue'
import NbaData from '@/components/sitepage/NbaData.vue'
import About from '@/components/sitepage/About.vue'
import BottomContent from "@/components/BottomContent.vue";
import ManageUserData from "@/components/sitepage/ManageUserData.vue";
// 定义组件映射
const componentMap: Record<string, unknown> = {
  HomePage,
  ArticleLists,
  NbaData,
  About,
  ManageUserData,
};

// 尝试从 localStorage 获取存储的组件名称
const storedComponentName = localStorage.getItem("componentName");

const inUse = ref(1);
const componentName = shallowRef(
  storedComponentName ? componentMap[storedComponentName] : HomePage // 如果有存储的名称，则选择对应的组件
);

const router = useRouter();

// 更新组件并存储组件名称
const updateComponent = (name: string) => {
  componentName.value = componentMap[name];
  localStorage.setItem("componentName", name); // 存储组件名称
};

const ManageData = () => {
  inUse.value = 0;
  localStorage.setItem("inUse", JSON.stringify(inUse.value)); // 存储 inUse 的值
  updateComponent("ManageUserData");
  router.push('/userdata/datahome'); // 跳转到 "/home"
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  router.push({ name: "User" });
};

const getHome = () => {
  inUse.value = 1;
  localStorage.setItem("inUse", JSON.stringify(inUse.value)); // 存储 inUse 的值
  updateComponent("HomePage");
  router.push('/home'); // 跳转到 "/home"
};

const getArticles = () => {
  inUse.value = 2;
  localStorage.setItem("inUse", JSON.stringify(inUse.value)); // 存储 inUse 的值
  updateComponent("ArticleLists");
  router.push('/home'); // 跳转到 "/home"
};

const getNbadata = () => {
  inUse.value = 3;
  localStorage.setItem("inUse", JSON.stringify(inUse.value)); // 存储 inUse 的值
  updateComponent("NbaData");
  router.push('/home'); // 跳转到 "/home"
};

const getAbout = () => {
  inUse.value = 4;
  localStorage.setItem("inUse", JSON.stringify(inUse.value)); // 存储 inUse 的值
  updateComponent("About");
  router.push('/home'); // 跳转到 "/home"
};

// 可选：恢复 `inUse` 的值
onMounted(() => {
  const storedInUse = localStorage.getItem("inUse");
  if (storedInUse) {
    inUse.value = JSON.parse(storedInUse);
  }
});
</script>

<style scoped lang="scss"></style>
