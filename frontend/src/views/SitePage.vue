<template>
  <div class="sitepage">
  <div class="top">
  <NavBar :inUse="inUse" @getHome="getHome" @getArticles="getArticles" @getNbadata="getNbadata" @getAbout="getAbout"
    @manageData="ManageData" @logout="logout" />
  </div>
  <div class="content">
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="['HomePage', 'ArticleLists']">
      <component
        :is="Component"
        :key="route.meta.usePathKey ? route.fullPath : undefined"
      />
    </keep-alive>
  </router-view>
  </div>  
  <div class="bottom">
    <BottomContent></BottomContent>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from 'vue'
import NavBar from "@/components/NavBar.vue";
import BottomContent from "@/components/BottomContent.vue";

const inUse = ref(localStorage.getItem("inUse") || "1");
const router = useRouter();
const ManageData = () => {
  inUse.value = "0";
  localStorage.setItem("inUse", "0");
  router.push('/userdata'); 
};
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  router.push({ name: "User" });
};

const getHome = () => {
  inUse.value = "1";
  localStorage.setItem("inUse", "1");
  router.push('/homepage'); // 跳转到 "/home"
};

const getArticles = () => {
  inUse.value = "2";
  localStorage.setItem("inUse", "2");
  router.push('/articlelists'); // 跳转到 "/home"
};

const getNbadata = () => {
  inUse.value = "3";
  localStorage.setItem("inUse", "3");
  router.push('/nbadata'); // 跳转到 "/home"
};

const getAbout = () => {
  inUse.value = "4";
  localStorage.setItem("inUse", "4");
  router.push('/about'); // 跳转到 "/home"
};
</script>

<style scoped lang="scss">
.sitepage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
}

</style>
