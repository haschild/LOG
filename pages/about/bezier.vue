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
        >
          <path
            v-for="(curve, index) in curves"
            :key="index"
            :d="getCurvePath(curve)"
            fill="none"
            :stroke="defConfig.curveColor"
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
import _ from "lodash";

const {
  defConfig,
  bgColor,
  svg,
  leftItems,
  rightItems,
  curves,
  isDragging,
  dragPoint,
  highlightedConnector,
  getCurvePath,
  startDrag,
  stopDrag,
  onMouseMove,
  selectCurve,
  updateCurvePositions,
  initializeData,
  handleKeyDown,
  isEditable,
  allowMultipleConnections,
  connectionCounts,
  debouncedUpdateCurvePositions,
  selectedCurveIndices, // 保留选中曲线索引
} = useBezier((event, data) => {
  console.log("Complete event:", event, data);
});

// 组件挂载后，初始化数据和曲线位置
onMounted(() => {
  initializeData();

  window.addEventListener("resize", debouncedUpdateCurvePositions);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", debouncedUpdateCurvePositions);
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style lang="scss" scoped>
.textColor {
  /* 使用 CSS 变量绑定 Vue 中的颜色 */
  color: rgba(var(--el-color-primary-rgb), 0.5);
  background: v-bind(bgColor);
}

li {
  cursor: pointer;
  box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
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