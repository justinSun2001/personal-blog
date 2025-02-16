<template>
  <div class="top">
    <top-bar :inUse2="true" />
  </div>
  <div class="page">
    <!-- Directly passing currentPage as a number and adding a key to force re-rendering -->
    <articles-content :currentPage="currentPage" :key="currentPage" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import TopBar from '@/components/TopBar.vue'
import ArticlesContent from './ArticlesContent.vue'

export default defineComponent({
  name: 'ArticlePage',
  components: {
    ArticlesContent,
    TopBar,
  },
  setup() {
    const route = useRoute()
    const currentPage = computed(() => {
      return Number((route.params.id as string)) // Ensure it's always a number
    })

    return {
      currentPage
    }
  }
})
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  position: fixed;
  background-color: white;
  z-index: 100;
}

.page {
  padding-top: 54px;
  background-color: #f9f9fb;
}
</style>
