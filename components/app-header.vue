<template>
  <el-header class="flex items-center bg-[var(--el-color-primary)]">
    <div class="text-center lg:w-1/3 xl:w-1/5">
      <h4 class="text-white"><Icon name="logos:nuxt-icon" /> Nuxt Ui</h4>
      <Icon
        class="fixed bottom-0 right-0 text-white"
        name="iconoir:arrow-up-circle"
      />
    </div>
    <div class="lg:flex-1 xl:flex-1">
      <el-menu
        mode="horizontal"
        class="justify-center"
        router
        background-color="var(--el-color-primary)"
        text-color="white"
        active-text-color="white"
      >
        <el-menu-item index="/">主页</el-menu-item>
        <el-menu-item index="/website">网站</el-menu-item>
        <el-menu-item index="/posts/1">文章记录</el-menu-item>
      </el-menu>
    </div>
    <div class="flex justify-end lg:w-8 xl:w-1/5">
      <div
        @click="handleCheckBtn"
        class="item-right inline-block h-6 w-6 cursor-pointer text-2xl"
      >
        <Sunny />
      </div>
    </div>
  </el-header>
</template>
<script lang="ts" setup>
import { Sunny } from "@element-plus/icons-vue";
const color = useColorMode();
const colorMode = computed({
  get: () => color.value === "dark",
  set: () => (color.preference = color.value === "dark" ? "light" : "dark"),
});

const handleCheckBtn = () => {
  color.preference = color.value === "dark" ? "light" : "dark";
};
</script>
