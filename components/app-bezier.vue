<template>
  <div
    ref="containerRef"
    style="width: 50%"
    class="relative flex w-1/2 justify-between"
    @click="handleBackgroundClick"
  >
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in leftItems"
          :key="'left' + item.id"
          :data-id="item.id"
          class="relative"
        >
          {{ item.name }}
          <div
            v-if="
              isEditable &&
              (allowMultipleConnections || connectionCounts[`${item.id}`] < 1)
            "
            class="connector right"
            :class="{ highlight: highlightedConnector === `left-${index}` }"
            @mousedown="startDrag('left', index, $event)"
          ></div>
        </li>
      </ul>
    </div>
    <svg
      class="absolute left-0 top-0 h-full w-full"
      ref="svg"
      @mousemove="onMouseMove"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @click="handleSvgClick"
    >
      <path
        v-for="(curve, index) in curves"
        :key="index"
        :d="getCurvePath(curve)"
        fill="none"
        :stroke="curve.isInitial ? '#3498db' : '#3498db'"
        :stroke-opacity="curve.isTemporary ? 0.4 : 0.8"
        :stroke-width="curve.isTemporary ? 2 : 3"
        :stroke-dasharray="curve.isInitial ? '5,5' : 'none'"
        @click.stop="selectCurve(index, $event)"
        :class="{ 'selected-curve': selectedCurveIndices.includes(index) }"
      />
    </svg>
    <div class="right">
      <ul>
        <li
          v-for="(item, index) in rightItems"
          :key="'right' + item.id"
          :data-id="item.id"
          class="relative"
        >
          <div
            v-if="
              isEditable &&
              (allowMultipleConnections || connectionCounts[`${item.id}`] < 1)
            "
            class="connector left"
            :class="{
              highlight: highlightedConnector === `right-${index}`,
            }"
            @mousedown="startDrag('right', index, $event)"
          ></div>
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useBezier } from "~/composables/useBezier.js";
import { onMounted, onUnmounted, ref } from "vue";

const containerRef = ref(null);

const emit = defineEmits(["change"]);

const {
  svg,
  leftItems,
  rightItems,
  curves,
  selectedCurveIndices,
  highlightedConnector,
  getCurvePath,
  startDrag,
  stopDrag,
  onMouseMove,
  selectCurve,
  initializeData,
  handleKeyDown,
  isEditable,
  allowMultipleConnections,
  connectionCounts,
  debouncedUpdateCurvePositions,
  handleBackgroundClick,
  handleSvgClick,
} = useBezier((event, data) => {
  if (event === "change") {
    emit("change", data);
  }
});

// 暴露初始化方法
const initialize = (element, data) => {
  initializeData(element || containerRef.value, data);
};

// 组件挂载后，初始化数据和曲线位置
onMounted(() => {
  initialize();

  window.addEventListener("resize", debouncedUpdateCurvePositions);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", debouncedUpdateCurvePositions);
  window.removeEventListener("keydown", handleKeyDown);
});

// 暴露方法给父组件
defineExpose({
  initialize,
});
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  box-shadow: 0 0 8px 2px rgba($color: #000000, $alpha: 0.1);
  padding: 20px 40px;
  margin: 20px;
  background-color: white;
  position: relative;
  user-select: none;
}

.connector {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #3498db;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: all 0.3s ease;

  &.left {
    left: -5px;
  }

  &.right {
    right: -5px;
  }

  &.highlight {
    width: 14px;
    height: 14px;
    background-color: #e74c3c;
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.8);
    z-index: 10; // 确保高亮的连接点在最上层
  }
}

.selected-curve {
  filter: drop-shadow(0 0 3px #3498db);
  stroke-width: 3 !important;
}

.left,
.right {
  z-index: 1;
}
</style>
