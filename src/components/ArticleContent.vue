<template>
  <div class="page">
    <div class="main">
      <div class="title">
        <h1>《{{ title }}》</h1>
      </div>
      <div class="date">
        --{{ date }}
      </div>
      <div class="head">
        {{ message }}
      </div>
      <div class="markdown-body" v-html="text"></div>
    </div>
    <div class="side">
      <side-content :amount="amount"></side-content>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onCreated, onUpdated } from 'vue';
import SideContent from './SideContent.vue';
import { marked } from 'marked';

export default defineComponent({
  name: 'ArticleContent',
  components: { SideContent },
  setup() {
    const title = ref('');
    const message = ref('');
    const date = ref('');
    const text = ref('');
    const amount = ref(1);

    const fetchData = () => {
      const id = this.$route.params.id;
      this.axios.get(`/catalog/articlesData/${id}`).then((result) => {
        title.value = result.data.article.title;
        message.value = result.data.article.summary;
        date.value = result.data.article.date;
        text.value = marked(result.data.article.text);
      });
    };

    onCreated(() => {
      fetchData();

      this.axios.get('/catalog/data').then((result) => {
        amount.value = result.data.article_count - 1;
      });

      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css';
      document.head.appendChild(link);
    });

    onUpdated(() => {
      fetchData();
    });

    return {
      title,
      message,
      date,
      text,
      amount,
    };
  },
});
</script>

<style scoped lang="scss">
.page {
  margin: 0 18px;
  display: flex;
  flex-direction: column;

  @media screen and (min-width: 1080px) {
    flex-direction: row;
    justify-content: space-between;

    .side {
      margin-left: 20px;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .main {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  @media screen and (max-width: 1080px) {
    .side {
      margin-left: 0;
    }
  }
}

.main {
  margin-bottom: 20px;
}

.title {
  text-align: center;
}

.date {
  text-align: right;
}

.head {
  width: 80%;
  color: brown;
  font-size: small;
  margin-bottom: 25px;
}

@import '../assets/markdown.css';
</style>
