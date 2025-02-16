<template>
  <div class="footer">
    @COPYRIGHT-JUSTIN
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BottomContent'
});
</script>

<style scoped lang="scss">
.footer {
  position: absolute;
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
}
</style>
