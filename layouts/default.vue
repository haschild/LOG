<template>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px">

          <nav>
      <ul>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/posts/1">Post 1</NuxtLink></li>
        <li><NuxtLink to="/posts/2">Post 2</NuxtLink></li>
      </ul>
    </nav>
        </el-aside>
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
  