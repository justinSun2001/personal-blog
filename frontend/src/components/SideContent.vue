<template>
  <div class="side">
    <div class="side1">
      <div class="sideline"></div>
      <div class="sidetext">Follow Me</div>
      <div class="side-img">
        <div v-for="(item, index) in socialLinks" :key="index" class="img-item">
          <a :href="item.link" target="_blank">
            <img :src="item.img" alt="social icon" />
          </a>
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
import { ref, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import http from "@/services/http";
import type { Genre, Article } from "@/types/index";
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
  email: [{ required: true, message: '不允许空邮箱' }, { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }]
});

const recentPosts = ref<string[]>([]);
const store = useStore();

watch(
  () => store.getters.getRecentArticles,
  (newValue: Article[]) => {
    recentPosts.value = newValue.map((item: Article) => {
      if (item.genre.length > 1) {
        const genreNames = item.genre.map((genre: Genre) => genre.name).join("/");
        return `${genreNames}: ${item.title}`;
      } else if (item.genre.length === 1) {
        return `${item.genre[0].name}: ${item.title}`;
      } else {
        return item.title;
      }
    })
  },
  { immediate: true }
)

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await http.post("/user/email", new URLSearchParams(form.email));
        alert("Submit Success!");
      } catch (error) {
        ElMessage.error(`Submit failed ${error}`);
      }
    } else {
      ElMessage.error("请检查输入");
    }
  });
};
</script>

<style scoped lang="scss">
.side {
  display: flex;
  flex-direction: column;
  margin: 0 10px;
}

.side1,
.side2,
.side3 {
  padding: 20px 0;
}

.sideline {
  width: 3px;
  height: 15px;
  background-color: rgb(64, 158, 149);
  margin-left: 8px;
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

.side-img .img-item:first-child img {
  width: 60px;
  /* 自定义宽度 */
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
