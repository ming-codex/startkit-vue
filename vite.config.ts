import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// 开发工具
import vueDevTools from 'vite-plugin-vue-devtools'

// element-plus按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 自动生成 i18n 类型文件
import I18nTypesPlugin from './plugins/vite-plugin-i18n-types'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 设置默认的环境变量
  const defaultEnv = {
    VITE_BASE_API: env.VITE_BASE_API || (mode === 'development' ? 'http://localhost:3000/api' : '/api'),
    VITE_APP_TITLE: env.VITE_APP_TITLE || 'startkit-vue',
    VITE_PORT: env.VITE_PORT || '5173',
    VITE_USE_MOCK: env.VITE_USE_MOCK || (mode === 'development' ? 'true' : 'false'),
  }

  return {
    // 设置基础路径为相对路径，生成的静态资源路径将以 './' 开头
    base: mode === 'development' ? '/' : './',

    // 定义全局常量替换
    define: {
      __APP_ENV__: JSON.stringify(defaultEnv),
    },

    plugins: [
      vue(),
      vueDevTools(),
      I18nTypesPlugin(),

      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],

    resolve: {
      // 路径别名
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // 开发服务器配置
    server: {
      port: parseInt(defaultEnv.VITE_PORT),
      open: true,
      proxy: {
        // 代理 API 请求
        '/api': {
          target: defaultEnv.VITE_BASE_API.replace('/api', ''),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },

    build: {
      // 打包配置
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // 其他第三方库
              return 'vendor'
            }
          },
        },
      },
      // 启用代码压缩
      minify: 'esbuild',
      // 设置chunk大小警告限制
      chunkSizeWarningLimit: 1000,
    },
  }
})
