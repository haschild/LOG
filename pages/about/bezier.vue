<template>
  <section>
    <div class="p-5">
      <h2 class="mb-4 text-2xl font-bold">贝塞尔曲线连接组件</h2>

      <app-bezier ref="bezierRef" @change="handleBezierChange"></app-bezier>

      <div class="mt-4">
        <button @click="resetConnections" class="btn-primary mr-2">
          重置连接
        </button>
        <button @click="deleteAllConnections" class="btn-secondary">
          删除所有连接
        </button>
      </div>
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

const resetConnections = () => {
  bezierRef.value.reset();
};

const deleteAllConnections = () => {
  bezierRef.value.deleteAllConnections();
};

onMounted(() => {
  // 初始化贝塞尔曲线
  if (bezierRef.value) {
    bezierRef.value.initialize(
      {
        data: [
          { name: "选项1", id: 1 },
          { name: "选项2", id: 2 },
          { name: "选项3", id: 3 },
          { name: "选项4", id: 4 },
          { name: "选项5", id: 5 },
          { name: "选项6", id: 6 },
        ],
        links: ["1-6", "2-4", "3-5", "1-4"],
      },
      {
        isEditable: true,
        curveColor: "#2ecc71",
        initialCurveColor: "#3498db",
        allowMultipleConnections: true,
        containerWidth: "80%",
        initialCurveStyle: "dashed",
        modifiedCurveStyle: "solid",
      },
    );
  }
});
</script>

<style lang="scss" scoped>
.textColor {
  /* 使用 CSS 变量绑定 Vue 中的颜色 */
  color: rgba(var(--el-color-primary-rgb), 0.5);
}
</style>
