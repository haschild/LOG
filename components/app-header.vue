<template>
<el-header>
<el-col :span="12"></el-col>
<el-col :span="12" class="right">
    <!-- <el-switch  v-model="colorMode" inline-prompt active-text="dark" inactive-text="light" size="large"></el-switch> -->
    <el-icon  @click="handleCheckBtn" style="font-size:1.5rem"><Sunny /></el-icon>
</el-col>

</el-header>
</template>
<script lang="ts" setup>
 import {
    Sunny,
  } from '@element-plus/icons-vue'
const color = useColorMode();
const colorMode = computed({
  get: () => color.value === 'dark',
  set: () => (color.preference = (color.value === 'dark' ? 'light' : 'dark')),
});

const handleCheckBtn = () => {
  color.preference = (color.value === 'dark' ? 'light' : 'dark');
};
</script>
<style lang="scss">
    .el-header {
        background-color: ele.$color-primary;
        display: flex;
        align-items: center;
    }
    .right{
        text-align: right;
        .el-icon{
            cursor: pointer;
            user-select: none;
        }
    }
</style>