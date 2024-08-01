<template>
    <el-container style="flex-direction: column;height: 100vh;">
      <app-header></app-header>
      <el-container>
        <el-aside width="200px" style="margin-top: 20px;">
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

  
  