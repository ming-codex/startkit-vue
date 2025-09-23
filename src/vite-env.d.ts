/// <reference types="vite/client" />

// Vue 文件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_BASE_API: string
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: string
  readonly VITE_USE_MOCK: string
  readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
