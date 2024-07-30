<template>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <slot />
      </el-container>
    </el-container>
  </template>

  
<style lang="scss">
html,body{
  margin: 0;
  padding:0;
}
.el-container{
  height: 100vh;
}
</style>
  