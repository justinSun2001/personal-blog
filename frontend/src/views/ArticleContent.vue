<template>
  <div class="top">
    <TopBar></TopBar>
  </div>
  <div class="page">
    <div class="main">
      <div class="title">
        <h1>《{{ title }}》</h1>
      </div>
      <div class="date">
        --{{ date }}
      </div>
      <div class="head">
        {{ summary }}
      </div>
      <div class="img">
        <img :src="imgUrl" alt="文章图片">
      </div>

      <div class="markdown-body" v-html="renderedMarkdown"></div>
    </div>
    <div class="side">
      <SideContent></SideContent>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import http from '@/services/http';
import SideContent from '@/components/SideContent.vue';
import MarkdownIt from 'markdown-it'
import TopBar from '@/components/TopBar.vue';
import type { ArticleData } from "@/types/index";


export default defineComponent({
  name: 'ArticleContent',
  components: { SideContent, TopBar },
  setup() {
    const route = useRoute();
    const md = new MarkdownIt();

    const title = ref('');
    const summary = ref('');
    const date = ref('');
    const text = ref('');
    const imgUrl = ref('');

    const fetchData = async () => {
      const _id = route.params.id;
      try {
        const articleData: ArticleData = await http.get(`/catalog/articlesData/${_id}`);
        title.value = articleData.article.title;
        summary.value = articleData.article.summary;
        date.value = articleData.article.date;
        text.value = articleData.article.text;
        imgUrl.value = `http://localhost:3000${articleData.article.path}`;
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const renderedMarkdown = computed(() => md.render(text.value));

    onMounted(() => {
      fetchData();

      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css';
      document.head.appendChild(link);
    });

    return {
      title,
      summary,
      date,
      imgUrl,
      renderedMarkdown
    };
  },
});
</script>

<style scoped lang="scss">
.top {
  width: 100%;
  position: fixed;
  background-color: white;
  z-index: 100;
}

.page {
  padding-top: 54px;
  margin: 0 18px;
  display: flex;
  flex-direction: column;


  @media screen and (min-width: 1080px) {
    flex-direction: row;
    justify-content: space-between;

    .side {
      margin-left: 20px;
      position: sticky;
      top: 54px;
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

.img img {
  width: 80%;
}

.head {
  width: 80%;
  color: brown;
  font-size: small;
  margin-bottom: 25px;
}

@import '@/assets/styles/markdown.css';
</style>
