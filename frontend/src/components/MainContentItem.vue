<template>
  <div class="main-content-item">
    <!-- Image -->
    <div class="item-icon">
      <img :src="url" @click="imgClick" alt="无图片上传" />
    </div>

    <div class="item-container" ref="container" >
      <div class="item-title" >{{ data.title }}</div>
      <div class="item-text" ref="textContainer" :style="{ '-webkit-line-clamp': maxLines }">{{ data.message }}</div>
    </div>
    <div class="item-date">{{ data.date }}</div>
  </div>
  <el-divider></el-divider>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import defaultpic from "@/assets/img/default.svg";

export default defineComponent({
  name: 'MainContentItem',
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
  setup(props) {
    const router = useRouter();
    let url = ref(props.data.path !== undefined ? `http://localhost:3000/${props.data.path}` : defaultpic);
    const imgClick = () => {
      if (props.data.id) {
        router.push({
          path: `/articles/${props.data.id}`,
        });
      }
    };
    const container = ref<HTMLDivElement | null>(null);
    const textContainer = ref<HTMLDivElement | null>(null);
    const maxLines = ref(3); // 这个值会动态更新

    // 动态调整显示的行数
    const adjustLineClamp = () => {
      if (textContainer.value && container.value) {
        
        const textHeight = textContainer.value.offsetTop; // 获取文本的高度
        const containerHeight = container.value.offsetHeight; // 获取容器的高度
        const lineHeight = parseInt(getComputedStyle(textContainer.value).lineHeight); // 获取字体大小
        // 根据容器的高度和字体大小计算出大概的最大行数
        maxLines.value = Math.floor((containerHeight - textHeight) / lineHeight);
      }
    };

    onMounted(() => {
      adjustLineClamp(); // 页面加载后调整行数
      window.addEventListener('resize', adjustLineClamp); // 在窗口大小改变时更新行数
    });
    return {
      url,
      imgClick,
      container,
      textContainer,
      maxLines
    };
  },
});
</script>

<style scoped lang="scss">
/* Flex layout */
@media screen and (min-width: 480px) {
  .main-content-item {
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  .item-icon img {
    height: 150px;
    width: 200px;
    opacity: 0.9;
    border-radius: 10px;
    margin-right: 10px;
    cursor: pointer;
  }

  .item-icon:hover {
    opacity: 0.5;
  }

  .item-container {
    position: relative;
    height: 135px;
    max-height: 135px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .item-title {
    margin: 10px 0;
    font-size: 18px;
    line-height: 18px;
  }

  .item-text {
    font-size: 15px;
    line-height: 20px;
    color: rgb(234, 59, 24);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    // /* 设置纵向排列 */
    overflow: hidden;
    /* 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 超出部分显示省略号 */
    word-break: break-all;
    /* 在单词边界自动换行 */
  }

  .item-date {
    font-size: 15px;
    line-height: 15px;
    position: absolute;
    bottom: 0px;
    right: 0;
    color: rgb(187, 177, 168);
  }
}

@media screen and (max-width: 480px) {
  .main-content-item {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    position: relative;
  }

  .item-icon img {
    height: 80px;
    width: 100px;
    opacity: 0.9;
    border-radius: 10px;
    margin-left: 10px;
  }

  .item-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 80px;
  }

  .item-title {
    font-size: 10px;
  }

  .item-text {
    font-size: 8px;
    line-height: 10px;
    color: rgb(234, 59, 24);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }


  .item-date {
    font-size: 8px;
    position: absolute;
    bottom: 0px;
    right: 100px;
    color: rgb(187, 177, 168);
  }
}



/* Modify el-divider style */
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
}
</style>
