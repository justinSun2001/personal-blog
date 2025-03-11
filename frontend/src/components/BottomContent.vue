<template>
  <div class="bottom">
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
.bottom {
  text-align: center;
  font-size: 10px;
  width: 100%;
  line-height: 40px;
  color: black;
  background-color: rgba(0, 0, 0, 0.177);
}
</style>
