<template>
  <el-menu
    :default-active="activeName"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-menu-item
      v-for="menu of menuList"
      :key="menu.path"
      :index="`/${menu.path}`"
    >
      <span>{{ menu.groupName }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import websiteJSON from "~/server/data/website.json.js";

let menuList = computed(() => websiteJSON);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const activeName = ref("");
</script>

<style lang="scss"></style>
