import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 设置项目根路径为当前目录(相对于项目根目录)。默认是 '/'（绝对路径）。
  plugins: [vue()],
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
  },
  build: {
    outDir: 'dist',  // 打包输出目录
    assetsDir: 'assets', // 资源目录
    // 代码压缩配置
    terserOptions: {
      // 生产环境移除console
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,  // 启用 CSS 代码分割
    // 控制代码分割的行为
    rollupOptions: {
      input: '/index.html', // 指定入口文件
      // 拆分单独的依赖库和公共模块
      output: {
        manualChunks: (id) => {
          // 根据模块路径来分割
          if (id.includes('node_modules')) {
            // 将第三方库单独打包
            return 'vendor'
          }
        },
        // 添加哈希后缀的文件名，提升缓存效率
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      
      }
    }
  },
})
