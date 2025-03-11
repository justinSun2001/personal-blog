<template>
  <div class="level1container">
    <div class="main">
      <div class="left">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#545c64"
          text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
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
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
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
onMounted(() => {
  handleSelect(activeIndex.value)
})
</script>
<style lang="scss" scoped>
.level1container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.left {
  width: 20%;
}

.el-menu-vertical-demo {
  height: 100%;
  min-height: 100%;
}

.main-content {
  width: 80%;
  height: 100%;
  padding-left: 30px;
}
</style>