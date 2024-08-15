<template>
    <div class="div-animation ">
       id: {{id}}
      <img class="w-auto h-auto" src="~/assets/images/banner_my24.jpg" alt="">
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id  = ref(route.params.id);
// 当访问/posts/1时，route.params.id将为1
console.log(route.params.id)
</script>

<style>
/* 定义动画 */
@keyframes borderExpand {
  from {
    border-left-width: 0;
    border-right-width: 0;
  }
  to {
    border-left-width: 2px; /* 边框宽度可以根据需要调整 */
    border-right-width: 2px;
  }
}


</style>
