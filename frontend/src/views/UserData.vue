<template>
  <div class="container">
    <div class="top">
      <TopBar />
    </div>
    <el-row class="main">
      <el-col :span="4">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#545c64"
          text-color="#fff" active-text-color="#ffd04b" height="100%" @select="handleSelect">
          <el-menu-item index="1">
            <template #title>
              <span>主页</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <span>管理</span>
            </template>
            <el-menu-item index="2-1">
              <span>文章</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <span>作者</span>
            </el-menu-item>
            <el-menu-item index="2-3">
              <span>类别</span>
            </el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <span>新建</span>
            </template>
            <el-menu-item index="3-1">
              <span>文章</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <span>作者</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <span>类别</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-col>
      <el-col :span="20" class="main-content">
        <router-view></router-view>
      </el-col>
    </el-row>
    <div class="bottom">
      <BottomContent></BottomContent>
    </div>
  </div>
</template>
<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import BottomContent from '@/components/BottomContent.vue'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore();
// 从 Vuex 中获取当前激活的菜单项 key
const activeIndex = computed(() => store.getters.getActiveMenuKey);
const handleSelect = (key: string) => {
  if (key === '1') {
    router.push('/userdata/datahome')
  } else if (key === '2-1') {
    router.push('/userdata/articlelist')
  } else if (key === '2-2') {
    router.push('/userdata/authorlist')
  } else if (key === '2-3') {
    router.push('/userdata/genrelist')
  } else if (key === '3-1') {
    router.push('/userdata/addarticle')
  } else if (key === '3-2') {
    router.push('/userdata/addauthor')
  } else if (key === '3-3') {
    router.push('/userdata/addgenre')
  }
  // 更新 Vuex 中的激活菜单项 key
  store.dispatch('updateActiveMenuKey', key);
}

</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top {
  width: 100%;
  position: fixed;
  top: 0;
  background-color: white;
  z-index: 100;
}

.main {
  margin-top: 54px;
  flex: 1;
}

.el-menu-vertical-demo {
  height: auto;
  min-height: 100%;
}

.main-content {
  padding-top: 20px;
  padding-left: 30px;
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