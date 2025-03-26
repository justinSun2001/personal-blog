<template>
  <div class="level1container">
    <div class="main">
      <div class="left">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" background-color="#545c64"
          text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
          <el-menu-item index="1">
            <template #title>
              <span>表格管理</span>
            </template>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <span>采集管理</span>
            </template>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore();
const activeIndex = ref('1');

const handleSelect = (key: string) => {
  if (key === '1') {
    router.push('/ocrsite/table')
  } else if (key === '2') {
    router.push('/ocrsite/caiji')
  }
}

onMounted(() => {
  // handleSelect(activeIndex.value)
  store.commit('setInUse', '0');
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