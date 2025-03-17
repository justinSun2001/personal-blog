<template>
  <div v-if="title" class="page">
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
      <!-- 标题目录 -->
      <div class="table-of-contents" @wheel.prevent.stop="handleTocScroll">
        <h2>目录</h2>
        <el-tree :data="treeData" :props="treeProps" default-expand-all :expand-on-click-node="false"
          @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
  </div>
  <div v-else>
    loading...
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import http from '@/services/http';
import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor';
import type { Article } from "@/types/index";
// Using ES6 import syntax
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';

// Then register the languages you need
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
const route = useRoute();
const md = new MarkdownIt({
  linkify: true,
  breaks: true,
});
// 使用 markdown-it-anchor 插件，为标题生成锚点
md.use(markdownItAnchor, {
  permalink: false, // 自动为每个标题添加锚点
  permalinkClass: 'header-anchor',
  permalinkSymbol: '', // 添加一个符号
});
const title = ref('');
const summary = ref('');
const date = ref('');
const text = ref('');
const imgUrl = ref('');

const fetchData = async () => {
  const _id = route.params.id;
  try {
    const articleData: Article = await http.get(`/catalog/articlesData/${_id}`);
    title.value = articleData.title;
    summary.value = articleData.summary;
    date.value = articleData.date;
    text.value = articleData.text;
    imgUrl.value = `http://localhost:3000${articleData.path}`;
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
};

const renderedMarkdown = computed(() => md.render(text.value));

interface Heading {
  id: string;
  text: string;
  level: number;
}
interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}
// 定义栈中元素的类型
interface StackItem extends Heading {
  children: TreeNode[];
}
// 明确 headings 的类型
const headings = ref<Heading[]>([]);

// 提取标题信息
const extractHeadings = () => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(renderedMarkdown.value, 'text/html');
  const headingElements = htmlDoc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.value = Array.from(headingElements).map((element) => {
    // const firstChild = element.firstChild; 
    let text = '';
    if (element && (element as HTMLElement).textContent) {
      text = (element as HTMLElement)?.textContent?.trim() || '';
    }
    const level = parseInt(element.tagName.slice(1), 10);
    return {
      id: element.id,
      text,
      level
    };
  });
};

// 将标题数据转换为 el-tree 格式
const convertToTreeData = (headings: Heading[]) => {
  const tree: TreeNode[] = [];
  const stack: StackItem[] = [];

  headings.forEach((heading: Heading) => {
    const node = {
      id: heading.id,
      label: heading.text,
      children: []
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push({ ...heading, children: node.children });
  });

  return tree;
};

// 生成 el-tree 数据
const treeData = computed(() => convertToTreeData(headings.value));

// el-tree 配置
const treeProps = {
  label: 'label',
  children: 'children'
};

// 处理节点点击事件
const handleNodeClick = (node: TreeNode) => {
  const id = node.id;
  // 滚动到标题上方
  const offset = 54;
  const targetElement = document.getElementById(id);
  if (targetElement) {
    // 获取目标元素相对于文档顶部的位置
    const targetOffsetTop = targetElement.offsetTop;
    // 计算目标滚动位置
    const scrollTarget = targetOffsetTop - offset;
    // 滚动到目标位置
    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth'
    });
  }
};

const handleTocScroll = (event: WheelEvent) => {
  // 可以在这里添加自定义滚动逻辑，例如控制滚动速度等
  const toc = event.currentTarget as HTMLElement;
  const deltaY = event.deltaY;
  toc.scrollTop += deltaY;
};

onMounted(async () => {
  //动态加载CSS文件
  import('@/assets/styles/markdown.css').then(() => {
    console.log('CSS加载成功');
  }).catch((err) => {
    console.error('CSS加载失败', err);
  });
  await fetchData();
  extractHeadings();
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el as HTMLElement);
  });
});

</script>

<style scoped lang="scss">
.page {
  margin: 0 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

.img {
  width: 80%;
  margin: 20px auto;

  img {
    width: 100%;
  }
}

.head {
  width: 80%;
  color: brown;
  font-size: 20px;
}

.side {
  position: relative;
}

@media screen and (max-width: 768px) {
  .table-of-contents {
    display: none;
  }
}

.table-of-contents {
  margin: 0 20px;
  position: sticky;
  top: 54px;
  max-height: calc(100vh - 54px);
  /* 计算最大高度，减去顶部的偏移量 */
  overflow-y: auto;
  /* 当内容超出高度时显示垂直滚动条 */
}

.table-of-contents ul {
  list-style-type: none;
  padding: 0;
}

.table-of-contents li {
  margin-bottom: 5px;
}

.heading-1 {
  padding-left: 0;
}

.heading-2 {
  padding-left: 20px;
}

.heading-3 {
  padding-left: 40px;
}

.heading-4 {
  padding-left: 60px;
}
</style>
