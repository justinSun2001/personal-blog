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
      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </div>
    <div class="side">
      <SideContent></SideContent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUpdated } from 'vue';
import { useRoute } from 'vue-router';
import http from '@/services/http';
import SideContent from './SideContent.vue';
import MarkdownIt from 'markdown-it'


export default defineComponent({
  name: 'ArticleContent',
  components: { SideContent },
  setup() {
    const route = useRoute();
    const md = new MarkdownIt();

    const title = ref('');
    const message = ref('');
    const date = ref('');
    const text = ref('');

    const fetchData = () => {
      const _id = route.params.id;
      http.get(`/catalog/articlesData/${_id}`).then((result:any) => {
        title.value = result.article.title;
        message.value = result.article.summary;
        date.value = result.article.date;
        text.value = result.article.text;
      });
    };
    
    const renderedMarkdown= computed(() => md.render(text.value));

    onMounted(() => {
      fetchData();

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
      renderedMarkdown
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

@import '@/assets/styles/markdown.css';
</style>
