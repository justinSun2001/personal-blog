<template>
  <KeepAlive>
    <router-view />
  </KeepAlive>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {

  }
})
</script>

<style lang="scss">
body {
  margin: 0;
  /* 去除 body 默认样式 */
}
</style>
