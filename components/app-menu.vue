<template>
        <el-menu 
          :default-active="activeName"
          class="el-menu-vertical-demo"
          :router=true
          @open="handleOpen"
          @close="handleClose"
        >
          <el-sub-menu index="/about">
            <template #title>
              <el-icon><location /></el-icon>
              <span>About</span>
              {{activeName}}
            </template>
              <el-menu-item index="/about">
                About
              </el-menu-item>
             
          </el-sub-menu>
          <el-sub-menu index="/posts">
            <template #title>
              <el-icon><location /></el-icon>
              <span>Post</span>
            </template>

            <el-menu-item index="/posts/1"> post 1</el-menu-item>
              <el-menu-item index="/posts/2">post 2</el-menu-item>
          </el-sub-menu>
        </el-menu>
  </template>
  
  <script lang="ts" setup>
  import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
  } from '@element-plus/icons-vue'
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  };
  
  const route = useRoute();
  const activeName = computed(() => {
    return route.path
  })

  


  </script>

  <style lang="scss">
  .el-aside{
    ul{
      border: 0;
    }
  }
</style>