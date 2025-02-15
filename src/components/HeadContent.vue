<template>
  <div :style="bgStyle">
    <div class="top">
      <div v-if="!change" @click="showBtn">切换背景</div>
      <template v-else>
        <button @click="setMood('warm')">暖色调</button>
        <button @click="setMood('cool')">冷色调</button>
      </template>
    </div>
    <div class="main">{{ title }}</div>
    <div class="content">{{ text }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 响应式数据
const title = ref("Lifestyle");
const text = ref("哎呀！出错啦");
const mood = ref("cool");
const change = ref(false);

// 计算背景样式
const bgStyle = computed(() => ({
  height: "200px",
  backgroundImage: mood.value === "warm"
    ? "linear-gradient(to right, red, orange)"
    : "linear-gradient(to right, cyan, gray)"
}));

// 切换按钮显示
const showBtn = () => {
  change.value = true;
};

// 切换背景
const setMood = (type) => {
  mood.value = type;
  change.value = false;
};
</script>

<style scoped>
.top {
  text-align: center;
}
.top div {
  font-size: 10px;
  cursor: pointer;
}
button {
  background-color: rgb(238, 212, 212);
  border: 0.5px solid;
  color: black;
  padding: 5px 12px;
  font-size: 10px;
  cursor: pointer;
}
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
