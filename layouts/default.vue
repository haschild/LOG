<template>
  <el-container
    class="container-start h-full"
    style="flex-direction: column; height: 100vh"
  >
    <app-header></app-header>
    <NuxtLoadingIndicator />
    <!-- 显示加载进度条 -->
    <el-container style="height: calc(100vh - 60px)">
      <el-aside class="mt-5 h-auto overflow-auto" v-if="menuIsShow">
        <app-menu />
      </el-aside>
      <el-main :class="{ twinPeaks: menuIsShow }">
        <el-card class="box-border">
          <slot />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
// 如果是主页，不显示左侧的菜单
// 获取现在路由
const route = useRoute();
const menuIsShow = computed(() => {
  return route.path == "/" ? false : true;
});
</script>

<style lang="scss"></style>
