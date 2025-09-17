<script setup lang="ts">
import { useLanguageSwitch } from './composables/useLanguageSwitch'
import { useCounter } from './composables/useCounter'
import type { HelloWorldProps } from './types'
import './assets/styles.css'

// 定义组件属性
defineProps<HelloWorldProps>()

// 使用组合函数
const { switchLang } = useLanguageSwitch({
  onSwitch: (lang) => {
    console.log(`语言已切换到: ${lang}`)
  },
})

const { count, increment } = useCounter()
</script>

<template>
  <div class="hello-world">
    <h1 class="hello-world__title">{{ msg }}</h1>

    <div class="hello-world__language-switcher">
      <el-button @click="switchLang('zh')">中文</el-button>
      <el-button @click="switchLang('en')">English</el-button>
    </div>

    <div class="hello-world__welcome">{{ $t('common.welcome') }}</div>

    <el-table class="hello-world__table" mb-1 :data="[]" />

    <div class="hello-world__counter">
      <button type="button" class="hello-world__counter-button" @click="increment()">count is {{ count }}</button>
    </div>
  </div>
</template>

<style scoped>
/* 组件级别的 scoped 样式可以在这里添加 */
</style>
