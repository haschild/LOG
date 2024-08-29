<template>
  <el-container
    class="container-start h-full"
    style="flex-direction: column; height: 100vh"
  >
    <app-header></app-header>
    <NuxtLoadingIndicator />
    <!-- 显示加载进度条 -->
    <el-container style="height: calc(100vh - 60px)" v-if="menuIsShow">
      <el-aside class="mt-5 h-auto overflow-auto">
        <app-menu />
      </el-aside>
      <el-main class="twinPeaks">
        <el-card class="box-border">
          <slot />
        </el-card>
      </el-main>
    </el-container>

    <el-container v-else style="height: calc(100vh - 60px)">
      <slot />
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
// 如果是主页，不显示左侧的菜单
// 获取现在路由
const route = useRoute();
const menuIsShow = computed(() => {
  return ["/", "/website", "/login"].includes(route.path) ? false : true;
});

// 获取主题颜色
const color = useColorMode();
</script>

<style lang="scss"></style>
