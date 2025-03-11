<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="about">
    <h1>This is an about page!!!</h1>
    <side-content></side-content>
  </div>
</template>

<script setup lang="ts">
import SideContent from '@/components/SideContent.vue'
</script>

<style lang="scss" scoped>
.about {
  margin: 0 8px;
}
</style>
