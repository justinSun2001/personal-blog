<template>
  <div class="main-content-item">
    <!-- Image -->
    <div class="item-icon">
      <img :src="url" @click="imgClick" />
    </div>

    <div class="item-container">
      <div class="item-title">{{ title }}</div>
      <div class="item-text">{{ message }}</div>
      <div class="state">
        <div class="item-bottom"></div>
        <div class="item-date">{{ date }}</div>
      </div>
    </div>
  </div>
  <el-divider></el-divider>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from 'vue';

export default defineComponent({
  name: 'MainContentItem',
  props: {
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const title = ref('无');
    const message = ref('');
    const date = ref('');
    const url = ref('');
    const id = ref('');

    const fetchArticleData = () => {
      axios
        .get('/catalog/articlesData')
        .then((result) => {
          const article = result.data[props.index];
          id.value = article._id;
          axios
            .get(`/catalog/articlesData/${id.value}`)
            .then((res) => {
              const articleData = res.data.article;
              title.value = articleData.title;
              message.value = articleData.summary;
              date.value = articleData.date;
              url.value = `http://localhost:3000${articleData.path}`;
            });
        });
    };

    onMounted(fetchArticleData); // Fetch data when the component is mounted

    // Watch for index changes and refetch data if necessary
    watchEffect(() => {
      if (props.index >= 0) {
        fetchArticleData();
      }
    });

    const imgClick = () => {
      if (id.value) {
        this.$router.push({
          path: `/articles/${id.value}`,
        });
      }
    };

    return {
      title,
      message,
      date,
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
