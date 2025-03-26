<template>
  <div class="sitepage">
    <div class="top">
      <NavBar :inUse="inUse" @getHome="getHome" @getArticles="getArticles" @getNbadata="getNbadata" @getAbout="getAbout"
        @manageData="ManageData" @manageOCRData="ManageOCRData" @logout="logout" />
    </div>
    <div class="content">
      <router-view v-slot="{ Component, route }">
        <keep-alive :include="['HomePage', 'ArticleLists']">
          <component :is="Component" :key="route.meta.usePathKey ? route.fullPath : undefined" />
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
import { useStore } from 'vuex';
import { ref, watch } from 'vue'
import NavBar from "@/components/NavBar.vue";
import BottomContent from "@/components/BottomContent.vue";

const inUse = ref(localStorage.getItem("inUse") || "1");
const router = useRouter();
const store = useStore();

watch(() => store.getters.getInUse, (newVal) => {
  inUse.value = newVal;
}, { immediate: true });

const ManageData = () => {
  router.push('/userdata');
};
const ManageOCRData = () => {
  router.push('/ocrsite');
}
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  router.push({ name: "User" });
};

const getHome = () => {
  router.push('/homepage'); // 跳转到 "/home"
};

const getArticles = () => {
  router.push('/articlelists'); // 跳转到 "/home"
};

const getNbadata = () => {
  router.push('/nbadata'); // 跳转到 "/home"
};

const getAbout = () => {
  router.push('/about'); // 跳转到 "/home"
};
</script>

<style scoped lang="scss">
.sitepage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.top {
  position: fixed;
  width: 100%;
  z-index: 100;
}

.content {
  margin-top: 54px;
  flex: 1;
}
</style>
