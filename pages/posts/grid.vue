<template>
  <div>
    <h2>Grid 布局</h2>

    <el-card>
      <div>常见布局</div>
      <div class="grid-box">
        <div class="num-box">1</div>
        <div class="num-box">2</div>
        <div class="num-box">3</div>
        <div class="num-box">4</div>
        <div class="num-box">5</div>
        <div class="num-box">6</div>
        <div class="num-box">7</div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss">
$bg-colors: (
  rgba(red, 1),
  rgba(green, 1),
  rgba(blue, 1),
  rgba(cyan, 1),
  rgba(magenta, 1),
  rgba(silver, 1),
  rgba(maroon, 1),
  rgba(olive, 1),
  rgba(teal, 1)
);

@for $i from 1 through length($bg-colors) {
  .num-box:nth-child(#{$i}) {
    background-color: nth($bg-colors, $i);
  }
}

.grid-box {
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
  line-height: 50px;
  gap: 10px;
}

.num-box {
  color: #fff;
  text-align: center;
}
</style>
