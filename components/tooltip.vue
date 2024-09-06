<template>
  <div class="top-box">
    <div class="box">显示内容</div>
  </div>
</template>

<style lang="scss">
$color: rgba(0, 0, 0, 0.5);
.box {
  position: relative;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
  background: $color;
  color: white;
  z-index: 2;
}

.box::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 0; /* 调整这些值来改变三角形的大小 */
  border-color: $color transparent transparent transparent; /* 黑色 透明 透明 透明 */
  bottom: -3px;
  left: 5px;
  transform: rotate(225deg); /* 旋转角度 */
}
</style>
