<template>
    <div class="div-animation ">
       id: {{id}}


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

/* 应用动画到div */
.div-animation {
  width: 200px; /* 根据需要调整宽度 */
  height: 100px; /* 根据需要调整高度 */
  background-color: #f0f0f0; /* 背景色可以根据需要调整 */
  border-top: 2px solid #333; /* 顶部边框 */
  border-bottom: 2px solid #333; /* 底部边框 */
  overflow: hidden; /* 隐藏溢出的内容 */
  position: relative; /* 相对定位 */
}

.div-animation::before {
  content: "";
  position: absolute;
  top: -2px; /* 与顶部边框对齐 */
  left: 50%; /* 初始位置在中间 */
  width: 0; /* 初始宽度为0 */
  height: calc(100% + 4px); /* 高度包括边框 */
  background-color: #333; /* 边框颜色 */
  animation: borderExpand 2s forwards; /* 应用动画 */
}

</style>
