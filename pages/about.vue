<template>
    <section>
      <p class="text">此页面将显示在 /about 路由。</p>
      <button @click="handleClickBack">回退首页</button>
    </section>
  </template>



<script setup lang="ts">
const handleClickBack = ()=>{
    const route = useRouter();

    // 当访问/posts/1时，route.params.id将为1
    console.log(route.params);
    
}
</script>

<style lang="scss">
  .text{
    color: $primary;
  }
</style>
