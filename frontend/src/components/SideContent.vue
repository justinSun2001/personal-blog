<template>
  <div class="side">
    <div class="side1">
      <div class="sideline"></div>
      <div class="sidetext">Follow Me</div>
      <div class="side-img">
        <div v-for="(item, index) in socialLinks" :key="index" class="img-item">
          <a :href="item.link" target="_blank"><img :src="item.img" alt="social icon" /></a>
        </div>
      </div>
    </div>

    <div class="side2">
      <div class="sideline"></div>
      <div class="sidetext">Articles Letter</div>
      <div class="sidecontent">
        Get all latest content delivered a few times a week.
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" class="demo-dynamic">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="Your Email" />
        </el-form-item>
        <el-button type="primary" plain @click="submitForm(formRef)">提交</el-button>
      </el-form>
    </div>

    <div class="side3">
      <div class="sideline"></div>
      <div class="sidetext">Recent Posts</div>
      <el-divider></el-divider>
      <div v-for="(text, index) in recentPosts" :key="index" class="text">
        {{ text }}
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import http from "@/services/http";

import bilibili from "@/assets/img/bilibili.png";
import qq from "@/assets/img/qq.png";
import github from "@/assets/img/github.png";
import linkin from "@/assets/img/linkin.png";
import weibo from "@/assets/img/weibo.png";

interface SocialLink {
  img: string;
  link: string;
}
const socialLinks: SocialLink[] = [
  { img: bilibili, link: "https://space.bilibili.com/613598276" },
  { img: qq, link: "https://user.qzone.qq.com/2464334130/main" },
  { img: github, link: "https://github.com/justinSun2001?tab=repositories" },
  { img: linkin, link: "https://www.linkedin.com/in/justin-sun-744810193/" },
  { img: weibo, link: "https://weibo.com/u/7707589860" }
];

const formRef = ref<FormInstance>();
const form = reactive({ email: "" });
const rules = reactive<FormRules<typeof form>>({
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }]
});

const recentPosts = ref<string[]>([]);
const store = useStore();
const articleCount = store.getters.getArticleCount;
onMounted(async () => {
  try {
    // 获取所有文章的基本数据
    const idData = await http.get("/catalog/articlesData");  // 假设返回的是包含文章数据的数组
     // 确保 idData 是一个数组
     if (!Array.isArray(idData)) {
      throw new Error("Received data is not an array");
    }
    // 获取最新的 3 个文章的索引
    const latestIndexes = [
      articleCount - 1,  // 最新的三篇文章的索引
      articleCount - 2,
      articleCount - 3
    ].filter(index => index >= 0);  // 确保索引有效
    console.log(latestIndexes);
    // 提取文章的 ID（假设 idData 是一个文章对象数组）
    const latestIds = latestIndexes.map(value => idData[value]._id); // 通过索引获取每篇文章的 _id

    // 执行请求并获取文章数据
    const articleRequests = latestIds.map(id =>
      http.get(`/catalog/articlesData/${id}`) // 根据文章 ID 获取详细信息
    );

    // 等待所有请求完成
    const data = await Promise.all(articleRequests);
    // 处理获取到的数据并更新 recentPosts
    recentPosts.value = data.map((item: any) => {
      return `${item.article.genre[0].name}: ${item.article.title}`;  // 假设返回的数据是 article
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid:boolean) => {
    if (valid) {
      try {
        await http.post("/user/email", new URLSearchParams(form.email));
        alert("Submit Success!");
      } catch (error) {
        console.error("Submit failed", error);
      }
    } else {
      alert("Invalid Email Format!");
    }
  });
};
</script>

<style scoped lang="scss">
.side {
  display: flex;
  flex-direction: column;
}

.side1, .side2, .side3 {
  padding: 20px 0;
}

.sideline {
  width: 3px;
  height: 15px;
  background-color: rgb(64, 158, 149);
}

.sidetext {
  padding-left: 20px;
  margin-top: -20px;
}

.side-img {
  display: flex;
  flex-wrap: nowrap;
  padding-left: 30px;
  padding-top: 20px;
}

.img-item {
  padding-right: 15px;
}

img {
  width: 40px;
  height: 40px;
}

.sidecontent {
  padding: 10px;
  font-size: 14px;
  color: darkgrey;
}

.demo-dynamic {
  padding: 15px 10px;
}

.text {
  padding-left: 10px;
  line-height: 15px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  color: burlywood;
}

.el-divider--horizontal {
  margin: 18px 0;
  background: transparent;
  border-top: 1px dashed burlywood;
}
</style>
