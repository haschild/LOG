<template>
  <div>
    <el-card>
      <h2>transform</h2>
      <div class="circle"></div>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores at eius
        maxime error totam eos id optio quos similique. Velit pariatur odio
        iusto libero quo natus quia dolores quod asperiores.
      </div>
    </el-card>

    <el-button @click="handleClick">休眠</el-button>
  </div>
</template>

<script setup lang="ts">
// 点击按钮后休眠5s
const handleClick = () => {
  const start = new Date().getTime();
  while (new Date().getTime() < start + 5000);
  console.log("休眠结束");
};
</script>
<style>
.circle {
  width: 100px;
  height: 100px;
  background: #854141;
  border-radius: 50%;
  margin: 50px auto;
  animation: circleAnimation 5s ease infinite;
}

/* 关键帧 */
@keyframes circleAnimation {
  0% {
    transform: scale(0.5) translate(0);
  }
  50% {
    transform: scale(3) translate(200px, 0);
  }
  100% {
    transform: scale(0.5) translate(0);
  }
}
</style>
