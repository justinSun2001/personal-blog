<template>
  <div :style="bgStyle" @click="toggleMood">
    <div class="main">{{ state.title }}</div>
    <div class="content">{{ state.text }}</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";

// 使用 reactive 管理多个状态
const state = reactive({
  title: "Lifestyle",
  text: "哎呀！出错啦",
  mood: "cool"
});

// 计算背景样式
const bgStyle = computed(() => ({
  height: "200px",
  backgroundImage: state.mood === "warm"
    ? "linear-gradient(to right, red, orange)"
    : "linear-gradient(to right, cyan, gray)"
}));

// 切换背景逻辑，通过点击任意位置
const toggleMood = () => {
  // 切换背景
  state.mood = state.mood === "warm" ? "cool" : "warm";
};
</script>

<style scoped>
.main {
  text-align: center;
  color: white;
  font-size: 20px;
  padding: 20px 0;
}
.content {
  text-align: center;
  padding: 0 15%;
  color: #f7fafcd3;
  font-size: 10px;
}
</style>
