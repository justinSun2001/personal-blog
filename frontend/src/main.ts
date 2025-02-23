import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式

import store from './store'; // 引入 Vuex store
import router from './router'; // 引入 Vue Router

const app = createApp(App);

app.use(ElementPlus); // 使用 Element Plus
app.use(store); // 使用 Vuex
app.use(router); // 使用 Vue Router

app.mount('#app');
