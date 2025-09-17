/**
 * HelloWorld 组件模块统一导出
 */

// 导出主组件
export { default as HelloWorld } from './index.vue'

// 导出类型定义
export type * from './types'

// 导出组合函数（如果需要在其他地方使用）
export { useLanguageSwitch } from './composables/useLanguageSwitch'
export { useCounter } from './composables/useCounter'
