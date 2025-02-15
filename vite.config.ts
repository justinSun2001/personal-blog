import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  /**
   * 配置路径解析别名
   * 在项目中可以使用 `@` 作为 `src` 目录的别名
   * 例如：`import Component from '@/components/Component.vue'`
   */
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // 配置 CSS 相关选项
  css: {
    // 配置预处理器的选项
    preprocessorOptions: {
      // 针对 SCSS 预处理器的配置
      scss: {
        // 自动引入全局样式，每次编译 SCSS 文件时都会自动包含 main.scss 文件
        additionalData: '@use "@/assets/styles/main.scss" as *;' 
      }
    }
  }
})
