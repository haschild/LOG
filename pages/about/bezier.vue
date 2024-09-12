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

      <div style="width: 50%" class="relative flex w-1/2 justify-between">
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
                  (allowMultipleConnections ||
                    connectionCounts[`${item.id}`] < 1)
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
          @mousedown.left.prevent="startSelection($event)"
        >
          <rect
            v-if="isSelecting"
            :x="Math.min(selectionStart.x, selectionEnd.x)"
            :y="Math.min(selectionStart.y, selectionEnd.y)"
            :width="Math.abs(selectionEnd.x - selectionStart.x)"
            :height="Math.abs(selectionEnd.y - selectionStart.y)"
            fill="rgba(0, 0, 255, 0.3)"
            stroke="blue"
            stroke-dasharray="5,5"
          />
          <path
            v-for="(curve, index) in curves"
            :key="index"
            :d="getCurvePath(curve)"
            fill="none"
            stroke="#3498db"
            stroke-width="2"
            @click="selectCurve(index)"
            :class="{ 'selected-curve': selectedCurveIndices.includes(index) }"
          />
          <circle
            v-if="isDragging"
            :cx="dragPoint.x"
            :cy="dragPoint.y"
            r="5"
            fill="red"
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
                  (allowMultipleConnections ||
                    connectionCounts[`${item.id}`] < 1)
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
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBezier } from "~/composables/useBezier";

const {
  bgColor,
  svg,
  leftItems,
  rightItems,
  curves,
  isDragging,
  dragPoint,
  isSelecting,
  selectionStart,
  selectionEnd,
  selectedCurveIndices,
  highlightedConnector,
  getCurvePath,
  startDrag,
  stopDrag,
  onMouseMove,
  selectCurve,
  startSelection,
  updateCurvePositions,
  initializeData,
  handleKeyDown,
  isEditable,
  allowMultipleConnections,
  connectionCounts,
} = useBezier();

// 组件挂载后，初始化数据和曲线位置
onMounted(() => {
  initializeData();

  window.addEventListener("resize", updateCurvePositions);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCurvePositions);
  window.removeEventListener("keydown", handleKeyDown);
});

// 组件挂载后，初始化曲线位置
updateCurvePositions();
</script>

<style lang="scss" scoped>
.textColor {
  color: rgba(ele.$color-primary, 0.5);
  background: v-bind(bgColor);
}

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
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
  }
}

.selected-curve {
  filter: drop-shadow(0 0 3px #3498db);
}

.left,
.right {
  z-index: 1;
}
</style>
