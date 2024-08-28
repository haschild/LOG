<template>
  <section>
    <div class="p-5">
      1. 在css部分使用js定义的颜色变量， 用vue3 提供的v-bind方法
      <p class="textColor">This should be red</p>
      <br />
      2. 用tailwind，直接获取变量
      <p class="text-[var(--el-color-primary)]">
        text-[var(--el-color-primary)]
      </p>
      <br />
      3. 使用tailwind定义样抽象类
      <div><button class="btn-primary">Save changes</button></div>
    </div>
  </section>
</template>

<script setup lang="ts">
const bgColor = ref("yellow");
</script>

<style lang="scss">
.textColor {
  color: rgba(ele.$color-primary, 0.5);
  background: v-bind(bgColor);
}
</style>
