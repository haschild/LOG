<template>
<el-header class="flex items-center bg-[var(--el-color-primary)]">
<div class="xl:w-1/5 lg:w-1/3 text-center " >
 <h4 class="text-white"><Icon name="logos:nuxt-icon" /> Nuxt Ui </h4>
 <Icon class="text-white fixed right-0 bottom-0" name="iconoir:arrow-up-circle" />
</div>
<div class="xl:flex-1 lg:flex-1">
  <el-menu  mode="horizontal" class="justify-center"  router  background-color="var(--el-color-primary)" text-color="white" active-text-color="white">
    <el-menu-item  index="/">Home</el-menu-item>
    <el-menu-item index="/about">About</el-menu-item>
    <el-menu-item index="/posts/1">Post</el-menu-item>
  </el-menu>
</div>
<div class="xl:w-1/5 lg:w-8 flex  justify-end">
    <div @click="handleCheckBtn" class="item-right text-2xl w-6 h-6 inline-block cursor-pointer"><Sunny /></div>
</div>

</el-header>
</template>
<script lang="ts" setup>
 import {
    Sunny,
  } from '@element-plus/icons-vue'
const color = useColorMode();
const colorMode = computed({
  get: () => color.value === 'dark',
  set: () => (color.preference = (color.value === 'dark' ? 'light' : 'dark')),
});

const handleCheckBtn = () => {
  color.preference = (color.value === 'dark' ? 'light' : 'dark');
};
</script>
