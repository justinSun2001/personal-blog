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
  text: "I am never alone. God and the ancestors are always near by, I AM THAT I AM 🤞🏾",
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
  color: rgb(115, 0, 247);
  font-size: 25px;
  padding: 20px 0;
}
.content {
  text-align: center;
  padding: 0 15%;
  color: #000;
  font-size: 20px;
  /* text-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3), -3px -3px 5px rgba(0, 0, 0, 0.3); */
  /* text-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), 0 3px 10px rgba(0, 0, 0, 0.3), 0 6px 15px rgba(0, 0, 0, 0.2);
  animation: blink 2s infinite alternate; */
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.5);
  animation: glow 1.5s ease-in-out infinite alternate;
  /* animation: shake 0.5s ease-in-out infinite; */
  /* animation: scroll 5s linear infinite; */
}
@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
@keyframes glow {
  0% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.5); }
  50% { text-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 1); }
  100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.5); }
}
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
