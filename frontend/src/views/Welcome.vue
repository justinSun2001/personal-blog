<template>
  <User />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import User from '@/components/User.vue'

export default defineComponent({
  name: 'Welcome',
  components: {
    User
  }
})
</script>

<style scoped lang="scss">
/* 在此处编写 SCSS 样式 */
</style>
