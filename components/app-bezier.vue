<template>
  <div
    ref="containerRef"
    :style="{ width: config.containerWidth }"
    class="relative flex justify-between"
  >
    <!-- 左侧列表 -->
    <div class="left">
      <ul>
        <li
          v-for="(item, index) in state.leftItems"
          :key="'left' + item.id"
          :data-id="item.id"
          class="relative"
        >
          {{ item.name }}
          <div
            v-if="connectEnable()"
            class="connector right"
            :class="{
              highlight: state.highlightedConnector === `left-${index}`,
              enable: connectEnable(),
            }"
            @mousedown="startDrag('left', index, $event)"
          ></div>
        </li>
      </ul>
    </div>
    <!-- SVG 区域 -->
    <svg
      class="absolute left-0 top-0 h-full w-full"
      ref="svgRef"
      @mousemove="onMouseMove"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="4"
        markerHeight="4"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#3498db" stroke="#3498db" />
      </marker>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3498db" stroke="#3498db" />
        </marker>
      </defs>
      <path
        v-for="(curve, index) in state.curves"
        :key="index"
        :d="getCurvePath(curve).path"
        :marker-end="
          config.curveDirection === 'leftToRight' ? 'url(#arrow)' : ''
        "
        :marker-start="
          config.curveDirection === 'rightToLeft' ? 'url(#arrow)' : ''
        "
        fill="none"
        v-bind="getCurveStyle(curve)"
        @click.stop="selectCurve(index, $event)"
        :class="{
          'selected-curve': state.selectedCurveIndices.includes(index),
        }"
      />
    </svg>

    <!-- 右侧列表 -->
    <div class="right">
      <ul>
        <li
          v-for="(item, index) in state.rightItems"
          :key="'right' + item.id"
          :data-id="item.id"
          class="relative"
        >
          <div
            v-if="connectEnable()"
            class="connector left"
            :class="{
              highlight: state.highlightedConnector === `right-${index}`,
              enable: connectEnable(),
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
const svgRef = ref(null);

const emit = defineEmits(["change"]);

const {
  state,
  config,
  getCurvePath,
  startDrag,
  stopDrag,
  onMouseMove,
  selectCurve,
  initialize,
  handleKeyDown,
  debouncedUpdateCurvePositions,
  reset,
  deleteAllConnections,
  getCurveStyle,
  addBatchConnections,
  resetConfig,
  connectEnable,
} = useBezier((event, data) => {
  if (event === "change") {
    emit("change", data);
  }
});

// 组件挂载后的处理
onMounted(() => {
  window.addEventListener("resize", debouncedUpdateCurvePositions);
  window.addEventListener("keydown", handleKeyDown);

  state.value.svg = svgRef.value;
});

onUnmounted(() => {
  window.removeEventListener("resize", debouncedUpdateCurvePositions);
  window.removeEventListener("keydown", handleKeyDown);
});

// 暴露方法给父组件
defineExpose({
  initialize,
  addBatchConnections,
  reset,
  deleteAllConnections,
  resetConfig, // Add this line
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

  &:hover {
    .connector.enable {
      opacity: 1; // 在悬停时显示连接点
    }
  }
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
  opacity: 0;

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
  z-index: 4;
}
</style>
