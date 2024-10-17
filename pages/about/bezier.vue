<template>
  <section>
    <div class="p-5">
      <h2 class="mb-4 text-2xl font-bold">贝塞尔曲线连接组件</h2>

      <app-bezier ref="bezierRef" @change="handleBezierChange"></app-bezier>

      <div class="mt-4">
        <button @click="resetConnections" class="btn-primary mr-2">
          重置连接
        </button>
        <el-button @click="deleteAllConnections" type="danger">
          删除所有连接
        </el-button>
        <el-button @click="addConnections" type="primary">
          批量添加连接
        </el-button>
      </div>

      <AppBezierConnector></AppBezierConnector>
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

// 批量添加连接线的方法
const addConnections = () => {
  const data = {
    links: ["1-6", "2-4", "3-5"], // 示例连接关系
  };
  const options = {
    curveStyle: "solid", // 或 "solid"
    curveDirection: "leftToRight", // 方向
  };
  bezierRef.value.addBatchConnections(data, options, false); // true 表示清空当前连接
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
        links: ["1-4", "2-5", "3-6"],
      },
      {
        isEditable: true,
        allowMultipleConnections: true,
        curveStyle: "dashed",
        curveDirection: "leftToRight",
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
