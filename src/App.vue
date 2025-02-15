<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style scoped lang="scss">
body {
  margin: 0;
  /* 去除 body 默认样式 */
}
</style>
