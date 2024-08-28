<template>
  <section>
    <p class="textColor">This should be red</p>
    <el-button type="primary">Save</el-button>

    <button class="md:hover:bg-fuchsia-600">Save changes</button>
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
