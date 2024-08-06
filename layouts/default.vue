<template>
    <el-container class="container-start h-full" style="flex-direction: column; height: 100vh;">
      <app-header></app-header>
      <NuxtLoadingIndicator /> <!-- 显示加载进度条 -->
      <el-container>
        <el-aside style="margin-top: 20px;" v-if="menuIsShow">
            <app-menu/>
        </el-aside>
        <el-main>
          <el-card style="height: 100%;box-sizing: border-box;">
            <slot />
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </template>

<script  lang="ts" setup>
// 如果是主页，不显示左侧的菜单
  // 获取现在路由
  const route = useRoute();
  const menuIsShow  = computed(()=>{
    return route.path == '/' ? false:true;
  });


</script>

<style>
/* 旋转动画样式 */
.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.4s;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate3d(1, 1, 1, 15deg);
}

/**
 * 淡入淡出动画样式
 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

  
  