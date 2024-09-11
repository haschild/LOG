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
              :key="'left' + index"
              class="relative"
            >
              {{ item }}
              <div
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
              :key="'right' + index"
              class="relative"
            >
              <div
                class="connector left"
                :class="{
                  highlight: highlightedConnector === `right-${index}`,
                }"
                @mousedown="startDrag('right', index, $event)"
              ></div>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Point {
  x: number;
  y: number;
}

interface Curve {
  start: Point;
  end: Point;
}

const bgColor = ref("yellow");
const svg = ref<SVGSVGElement | null>(null);

const leftItems = ref(["1", "3", "2"]);
const rightItems = ref(["3", "2", "1"]);

const isDragging = ref(false);
const dragTarget = ref<{ side: "left" | "right"; index: number } | null>(null);
const dragPoint = ref({ x: 0, y: 0 });

const curves = ref<Curve[]>([]);
const activeCurveIndex = ref<number | null>(null);
const highlightedConnector = ref(null);

const isSelecting = ref(false);
const selectionStart = ref<Point>({ x: 0, y: 0 });
const selectionEnd = ref<Point>({ x: 0, y: 0 });
const selectedCurveIndices = ref<number[]>([]);

const getCurvePath = (curve: Curve) => {
  const { x: startX, y: startY } = curve.start;
  const { x: endX, y: endY } = curve.end;

  const controlX1 = startX + (endX - startX) / 3;
  const controlY1 = startY;
  const controlX2 = endX - (endX - startX) / 3;
  const controlY2 = endY;

  return `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
};

const startDrag = (
  side: "left" | "right",
  index: number,
  event: MouseEvent,
) => {
  isDragging.value = true;
  dragTarget.value = { side, index };

  const newCurveIndex = curves.value.length;
  const svgRect = svg.value!.getBoundingClientRect();
  const connectorRect = (event.target as HTMLElement).getBoundingClientRect();
  const point = {
    x: connectorRect.left + connectorRect.width / 2 - svgRect.left,
    y: connectorRect.top + connectorRect.height / 2 - svgRect.top,
  };

  if (side === "left") {
    curves.value.push({ start: point, end: { x: point.x, y: point.y } });
  } else {
    curves.value.push({ start: { x: point.x, y: point.y }, end: point });
  }
  activeCurveIndex.value = newCurveIndex;
};

const stopDrag = () => {
  if (isDragging.value && activeCurveIndex.value !== null) {
    const nearestConnector = findNearestConnector();
    if (nearestConnector) {
      if (dragTarget.value?.side === "left") {
        curves.value[activeCurveIndex.value].end = nearestConnector.point;
      } else {
        curves.value[activeCurveIndex.value].start = nearestConnector.point;
      }
    } else {
      // 如果没有找到最近的连接点，删除这条曲线
      curves.value.splice(activeCurveIndex.value, 1);
    }
  }
  isDragging.value = false;
  dragTarget.value = null;
  highlightedConnector.value = null;
  activeCurveIndex.value = null;

  if (isSelecting.value) {
    isSelecting.value = false;
    selectCurvesInSelection();
  }
};

const onMouseMove = (event: MouseEvent) => {
  if (isSelecting.value) {
    const svgRect = svg.value!.getBoundingClientRect();
    selectionEnd.value = {
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    };
    return;
  }

  if (!isDragging.value || !svg.value || activeCurveIndex.value === null)
    return;

  const svgRect = svg.value.getBoundingClientRect();
  const x = event.clientX - svgRect.left;
  const y = event.clientY - svgRect.top;

  dragPoint.value = { x, y };

  if (dragTarget.value?.side === "left") {
    curves.value[activeCurveIndex.value].end = { x, y };
  } else {
    curves.value[activeCurveIndex.value].start = { x, y };
  }

  const nearestConnector = findNearestConnector();
  highlightedConnector.value = nearestConnector ? nearestConnector.id : null;
};

const findNearestConnector = () => {
  if (!svg.value || !dragTarget.value) return null;

  const svgRect = svg.value.getBoundingClientRect();
  const connectors = document.querySelectorAll(
    dragTarget.value.side === "left" ? ".right .connector" : ".left .connector",
  ) as NodeListOf<HTMLElement>;
  let nearestDistance = Infinity;
  let nearestPoint = null;
  let nearestId = null;

  connectors.forEach((connector, index) => {
    const rect = connector.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - svgRect.left;
    const centerY = rect.top + rect.height / 2 - svgRect.top;
    const distance = Math.sqrt(
      Math.pow(centerX - dragPoint.value.x, 2) +
        Math.pow(centerY - dragPoint.value.y, 2),
    );

    if (distance < nearestDistance && distance < 50) {
      nearestDistance = distance;
      nearestPoint = { x: centerX, y: centerY };
      nearestId = `${dragTarget.value.side === "left" ? "right" : "left"}-${index}`;
    }
  });

  return nearestPoint ? { point: nearestPoint, id: nearestId } : null;
};

const selectCurve = (index: number) => {
  selectedCurveIndices.value = selectedCurveIndices.value.includes(index)
    ? selectedCurveIndices.value.filter((i) => i !== index)
    : [...selectedCurveIndices.value, index];
};

const selectCurvesInSelection = () => {
  const { x: x1, y: y1 } = selectionStart.value;
  const { x: x2, y: y2 } = selectionEnd.value;
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);

  selectedCurveIndices.value = curves.value
    .map((curve, index) => {
      const { start, end } = curve;
      if (
        (start.x >= minX &&
          start.x <= maxX &&
          start.y >= minY &&
          start.y <= maxY) ||
        (end.x >= minX && end.x <= maxX && end.y >= minY && end.y <= maxY)
      ) {
        return index;
      }
      return null;
    })
    .filter((index) => index !== null) as number[];
};

const startSelection = (event: MouseEvent) => {
  isSelecting.value = true;
  const svgRect = svg.value!.getBoundingClientRect();
  selectionStart.value = {
    x: event.clientX - svgRect.left,
    y: event.clientY - svgRect.top,
  };
  selectionEnd.value = selectionStart.value;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Delete" && selectedCurveIndices.value.length > 0) {
    curves.value = curves.value.filter(
      (_, index) => !selectedCurveIndices.value.includes(index),
    );
    selectedCurveIndices.value = [];
  }
};

onMounted(() => {
  window.addEventListener("resize", () => {
    // 在窗口大小改变时更新已存在的曲线位置
    curves.value.forEach((curve, index) => {
      const leftConnector = document.querySelector(
        `.left .connector:nth-child(${index + 1})`,
      ) as HTMLElement;
      const rightConnector = document.querySelector(
        `.right .connector:nth-child(${index + 1})`,
      ) as HTMLElement;

      if (leftConnector && rightConnector && svg.value) {
        const svgRect = svg.value.getBoundingClientRect();
        const leftRect = leftConnector.getBoundingClientRect();
        const rightRect = rightConnector.getBoundingClientRect();

        curve.start = {
          x: leftRect.right - svgRect.left,
          y: leftRect.top + leftRect.height / 2 - svgRect.top,
        };
        curve.end = {
          x: rightRect.left - svgRect.left,
          y: rightRect.top + rightRect.height / 2 - svgRect.top,
        };
      }
    });
  });

  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style lang="scss" scoped>
.textColor {
  color: rgba(ele.$color-primary, 0.5);
  background: v-bind(bgColor);
}

li {
  cursor: pointer;
  border: 1px solid #cdcdcd;
  box-shadow: 0 0 8px rgba($color: #000000, $alpha: 0.1);
  padding: 10px 8px;
  margin: 4px;
  background-color: white;
  height: 100px;
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
