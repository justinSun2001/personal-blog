<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <top-bar :inUse4="true"></top-bar>
  <div class="about">
    <h1>This is an about page!!!</h1>
    <side-content></side-content>
  </div>
</template>

<script setup lang="ts">
import SideContent from '@/components/SideContent.vue'
import TopBar from '@/components/TopBar.vue'


</script>

<style lang="scss" scoped>
.about {
  margin: 0 8px;
}
</style>
