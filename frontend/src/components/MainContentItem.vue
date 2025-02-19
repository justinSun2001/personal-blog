<template>
  <div class="main-content-item">
    <!-- Image -->
    <div class="item-icon">
      <img :src="url" @click="imgClick" />
    </div>

    <div class="item-container">
      <div class="item-title">{{ data1.title }}</div>
      <div class="item-text">{{ data1.message }}</div>
      <div class="state">
        <div class="item-bottom"></div>
        <div class="item-date">{{ data1.date }}</div>
      </div>
    </div>
  </div>
  <el-divider></el-divider>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'MainContentItem',
  props: {
    data1: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    console.log(props.data1);
    const router = useRouter();
    let url = ref('');
    url = props.data1.url;
    const imgClick = () => {
      if (props.data1.id) {
        router.push({
          path: `/articles/${props.data1.id}`,
        });
      }
    };

    return {
      url,
      imgClick,
    };
  },
});
</script>

<style scoped lang="scss">
/* Flex layout */
@media screen and (min-width: 480px) {
  .main-content-item {
    display: flex;
    justify-content: space-between;
    padding-left: 25px;
  }

  .item-icon img {
    height: 150px;
    width: 200px;
    opacity: 0.9;
    border: 1px solid rgb(238, 247, 236);
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
  }

  .item-icon:hover {
    opacity: 0.5;
  }

  .item-title {
    font-size: 20px;
  }

  .item-text {
    font-size: 15px;
    color: rgb(234, 59, 24);
  }

  .state {
    display: flex;
    justify-content: space-between;
  }

  .item-date {
    color: rgb(187, 177, 168);
  }
}

@media screen and (max-width: 480px) {
  .main-content-item {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    height: 80px;
  }

  .item-icon img {
    height: 80px;
    width: 100px;
    opacity: 0.9;
    border: 1px solid rgb(238, 247, 236);
    border-radius: 10px;
    margin-left: 10px;
  }

  .item-title {
    font-size: 10px;
  }

  .item-text {
    font-size: 8px;
    color: rgb(234, 59, 24);
  }

  .state {
    display: flex;
    justify-content: space-between;
  }

  .item-date {
    font-size: 8px;
    color: rgb(187, 177, 168);
  }
}

.item-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  width: 100%;
}

/* Modify el-divider style */
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
  border-top: 1px solid #e8eaec;
}
</style>
