<template>
  <section>
    <div class="p-5">
      <h2 class="mb-4 text-2xl font-bold">贝塞尔曲线连接组件</h2>

      <el-form label-width="100px" :model="formData">
        <el-form-item label="是否允许多连接">
          <el-switch v-model="formData.allowMultipleConnections" />
        </el-form-item>
        <el-form-item label="连接线样式">
          <el-select
            v-model="formData.curveStyle"
            placeholder="请选择连接线样式"
          >
            <el-option label="实线" value="solid" />
            <el-option label="虚线" value="dashed" />
          </el-select>
        </el-form-item>
        <el-form-item label="连接线方向">
          <el-select
            v-model="formData.curveDirection"
            placeholder="请选择连接线方向"
          >
            <el-option label="左到右" value="leftToRight" />
            <el-option label="右到左" value="rightToLeft" />
            <el-option label="上下" value="both" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可编辑">
          <el-switch v-model="formData.isEditable" />
        </el-form-item>
        <el-form-item label="是否可以删除">
          <el-switch v-model="formData.isDeletable" />
        </el-form-item>
      </el-form>

      <app-bezier
        class="w-full"
        ref="bezierRef"
        @change="handleBezierChange"
      ></app-bezier>

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

        <el-button @click="addDashedConnections" type="primary">
          批量添加虚线
        </el-button>

        <!-- Updated button to reset configuration using bezierRef -->
        <el-button @click="resetConfig" type="warning"> 重置配置 </el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const formData = ref({
  isEditable: true,
  allowMultipleConnections: true,
  curveStyle: "solid",
  curveDirection: "both",
  isDeletable: true,
});

const bezierRef = ref(null);

const handleBezierChange = (data) => {
  console.log("Bezier change:", data);
  // 在这里处理贝塞尔曲线的变化
};

const resetConnections = () => {
  // bezierRef.value.reset();
  initializeBezier();
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

const addDashedConnections = () => {
  const data = {
    links: ["1-4", "2-5", "3-6"], // 示例连接关系
  };
  const options = {
    curveStyle: "dashed", // 或 "solid"
    curveDirection: "both", // 方向
  };
  bezierRef.value.addBatchConnections(data, options, false); // true 表示清空当前连接
};

const resetConfig = () => {
  bezierRef.value.resetConfig(formData.value);
};

const initializeBezier = () => {
  bezierRef.value.initialize(
    {
      leftItems: [
        { name: "选项1", id: 1 },
        { name: "选项2", id: 2 },
        { name: "选项3", id: 3 },
      ],
      rightItems: [
        { name: "选项4", id: 4 },
        { name: "选项5", id: 5 },
        { name: "选项6", id: 6 },
      ],
      // links: ["1-4", "2-5", "3-6"],
    },
    {
      isEditable: true,
      allowMultipleConnections: true,
      curveStyle: "solid",
      curveDirection: "both",
      key: "id",
    },
  );
};
onMounted(() => {
  // 初始化贝塞尔曲线
  if (bezierRef.value) {
    initializeBezier();
  }
});
</script>

<style lang="scss" scoped>
.textColor {
  /* 使用 CSS 变量绑定 Vue 中的颜色 */
  color: rgba(var(--el-color-primary-rgb), 0.5);
}
</style>
