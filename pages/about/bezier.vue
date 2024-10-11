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
      <br />
      使用i18n
      <br />
      <p>{{ $t("welcome") }}</p>

      <br />
      贝塞尔曲线
      <app-bezier ref="bezierRef" @change="handleBezierChange"></app-bezier>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const bezierRef = ref(null);

const handleBezierChange = (data) => {
  console.log("Bezier change:", data);
  // 在这里处理贝塞尔曲线的变化
};

onMounted(() => {
  // 初始化贝塞尔曲线
  if (bezierRef.value) {
    bezierRef.value.initialize(null, {
      data: [
        { name: "选项1", id: 1 },
        { name: "选项2", id: 2 },
        { name: "选项3", id: 3 },
        { name: "选项4", id: 4 },
        { name: "选项5", id: 5 },
        { name: "选项6", id: 6 },
      ],
      links: ["1-6", "2-4", "3-5", "1-4"],
    });
  }
});
</script>

<style lang="scss" scoped>
.textColor {
  /* 使用 CSS 变量绑定 Vue 中的颜色 */
  color: rgba(var(--el-color-primary-rgb), 0.5);
}
</style>
