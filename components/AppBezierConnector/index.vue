<template>
  <div
    class="bezier-connector"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <ul class="left-column">
      <li v-for="item in leftItems" :key="item[itemKey]" class="item left-item">
        <slot name="left-item" :item="item">
          {{ item.name }}
        </slot>
        <div v-if="props.editable" class="attach-points">
          <div
            v-for="(point, index) in getAttachPoints(item[itemKey], 'left')"
            :key="index"
            :class="[
              'attach-point',
              { active: isAttachPointActive(item[itemKey], 'left', index) },
            ]"
            @click="handleAttachPointClick(item[itemKey], 'left', index)"
          ></div>
        </div>
      </li>
    </ul>
    <svg class="connections">
      <path
        v-for="connection in connections"
        :key="`${connection.from}-${connection.to}`"
        :d="calculatePath(connection)"
        :class="['connection', { active: isConnectionActive(connection) }]"
        @click="handleConnectionClick(connection)"
      ></path>
      <path
        v-if="tempConnection"
        :d="calculateTempPath()"
        class="connection temp"
        stroke-dasharray="5,5"
      ></path>
    </svg>
    <ul class="right-column">
      <li
        v-for="item in rightItems"
        :key="item[itemKey]"
        class="item right-item"
      >
        <slot name="right-item" :item="item">
          {{ item.name }}
        </slot>
        <div v-if="props.editable" class="attach-points">
          <div
            v-for="(point, index) in getAttachPoints(item[itemKey], 'right')"
            :key="index"
            :class="[
              'attach-point',
              { active: isAttachPointActive(item[itemKey], 'right', index) },
            ]"
            @click="handleAttachPointClick(item[itemKey], 'right', index)"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useBezierConnector } from "./bezier.js";
import "./basic.css";

const props = defineProps({
  itemKey: { type: String, default: "id" },
  lineType: { type: String, default: "solid" },
  direction: { type: String, default: "both" },
  editable: { type: Boolean, default: true },
  deletable: { type: Boolean, default: true },
  lineColor: { type: String, default: "#007bff" },
  lineWidth: { type: Number, default: 2 },
  activeLineColor: { type: String, default: "#ff0000" },
  itemHoverContent: { type: Function, default: null },
  attachPointRadius: { type: Number, default: 5 },
  attachPointColor: { type: String, default: "#007bff" },
  attachPointActiveColor: { type: String, default: "#ff0000" },
});

const {
  leftItems,
  rightItems,
  connections,
  initialize,
  addConnection,
  removeConnection,
  updateConnectionCurve,
  addBatchConnections,
  removeBatchConnections,
  getAttachPoints,
  highlightAttachPoint,
  handleAttachPointClick,
  handleConnectionClick,
  calculatePath,
  isConnectionActive,
  isAttachPointActive, // New function to check if an attach point is active
  handleMouseMove,
  handleMouseUp,
  calculateTempPath,
  tempConnection,
} = useBezierConnector(props);

defineExpose({
  initialize,
  addConnection,
  removeConnection,
  updateConnectionCurve,
  addBatchConnections,
  removeBatchConnections,
  getAttachPoints,
  highlightAttachPoint,
});
</script>
