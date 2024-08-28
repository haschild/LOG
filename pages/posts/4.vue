<script setup lang="ts">
const md = `
# Nuxt 支持 Markdown 语法

::pre
1. 安装 MDC 模块
npx nuxi@latest module add mdc
::

#### 我表示很难用

`;
</script>

<template>
  <MDC :value="md" tag="article" />
</template>
