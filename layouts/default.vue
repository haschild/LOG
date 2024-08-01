<template>
    <el-container style="flex-direction: column;">
      <app-header></app-header>
      <el-container>
        <el-aside width="200px">
          <app-menu/>
        </el-aside>
        <el-main>
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </template>

  
  