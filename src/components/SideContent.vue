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
        <el-button type="primary" plain @click="submitForm">提交</el-button>
      </el-form>
    </div>

    <div class="side3">
      <div class="sideline"></div>
      <div class="sidetext">Recent Posts</div>
      <el-divider></el-divider>
      <div v-for="(text, index) in recentPosts" :key="index" class="text">{{ text }}</div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElForm } from "element-plus";

interface SocialLink {
  img: string;
  link: string;
}

const socialLinks: SocialLink[] = [
  { img: "../assets/img/bilibili.png", link: "https://space.bilibili.com/613598276" },
  { img: "../assets/img/qq.png", link: "https://user.qzone.qq.com/2464334130/main" },
  { img: "../assets/img/github.png", link: "https://github.com/justinSun2001?tab=repositories" },
  { img: "../assets/img/linkin.png", link: "https://www.linkedin.com/in/justin-sun-744810193/" },
  { img: "../assets/img/weibo.png", link: "https://weibo.com/u/7707589860" }
];

const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = ref({ email: "" });
const rules = {
  email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }]
};

const recentPosts = ref<string[]>([]);
const amount = ref<number>(4);

onMounted(async () => {
  try {
    const { data } = await axios.get("/catalog/articlesData");
    recentPosts.value = data.slice(amount.value - 4, amount.value).map((item: any) => `${item.article.genre[0].name}: ${item.article.title}`);
  } catch (error) {
    console.error("Error fetching articles:", error);
  }
});

const submitForm = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await axios.post("/user/email", new URLSearchParams(form.value));
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
