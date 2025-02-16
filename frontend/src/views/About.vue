<template>
  <top-bar :inUse4="true"></top-bar>
  <div class="about">
    <h1>This is an about page!!!</h1>
    <side-content :amount="amount"></side-content>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import http from '@/services/http'
import SideContent from '@/components/SideContent.vue'
import TopBar from '@/components/TopBar.vue'

export default defineComponent({
  name: 'AboutPage',
  components: { SideContent, TopBar },
  setup() {
    // Reactive state variables
    const amount = ref(1)

    // Fetch amount on mount
    const getAmount = () => {
      http.get("/catalog/data").then((result:any) => {
        amount.value = result.data.article_count - 1
      })
    }

    // Call getAmount on component mount
    onMounted(() => {
      getAmount()
    })

    return {
      amount
    }
  }
})
</script>

<style lang="scss" scoped>
.about {
  margin: 0 8px;
}
</style>
