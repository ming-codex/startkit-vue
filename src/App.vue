<script setup lang="ts">
import { useElementConfig } from '@/i18n/element-config'

const { elementConfig } = useElementConfig()
</script>

<template>
  <el-config-provider v-bind="elementConfig">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
