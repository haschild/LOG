/**
 * useBezier - 贝塞尔曲线连接组件
 *
 * API:
 * 1. initialize(data, options)
 *    初始化组件
 *    @param {Object} data - 初始化数据，包含 data（列表项）和 links（连接）
 *    @param {Object} options - 配置选项
 *
 * 2. reset()
 *    重置连接到初始状态
 *
 * 3. deleteAllConnections()
 *    删除所有连接
 *
 * 4. getCurvePath(curve)
 *    获取曲线路径
 *    @param {Object} curve - 曲线对象
 *    @returns {string} SVG 路径字符串
 *
 * 5. getCurveStyle(curve)
 *    获取曲线样式
 *    @param {Object} curve - 曲线对象
 *    @returns {Object} 样式对象
 *
 * 配置选项 (options):
 * - isEditable: boolean - 是否可编辑
 * - curveColor: string - 曲线颜色
 * - initialCurveColor: string - 初始曲线颜色
 * - allowMultipleConnections: boolean - 是否允许多重连接
 * - curveStrokeWidth: number - 曲线宽度
 * - initialCurveStrokeWidth: number - 初始曲线宽度
 * - curveOpacity: number - 曲线不透明度
 * - initialCurveOpacity: number - 初始曲线不透明度
 * - connectorSize: number - 连接点大小
 * - highlightedConnectorSize: number - 高亮连接点大小
 * - connectorColor: string - 连接点颜色
 * - highlightedConnectorColor: string - 高亮连接点颜色
 * - containerWidth: string - 容器宽度
 * - initialCurveStyle: 'dashed' | 'solid' - 初始曲线样式
 * - modifiedCurveStyle: 'dashed' | 'solid' - 修改后曲线样式
 *
 * 事件:
 * - change: 当连接发生变化时触发，返回最新的连接数据
 *
 * 状态:
 * - state: 包含组件的所有响应式状态
 * - config: 包含组件的所有配置选项
 */

import { ref, computed, nextTick } from "vue";
import { debounce } from "lodash-es";

export function useBezier(emit) {
  const state = ref({
    svg: null,
    leftItems: [],
    rightItems: [],
    curves: [],
    isDragging: false,
    dragTarget: null,
    dragPoint: { x: 0, y: 0 },
    activeCurveIndex: null,
    highlightedConnector: null,
    selectedCurveIndices: [],
    connectionCounts: {},
    initialCurves: [],
    containerElement: null,
  });

  const defaultConfig = {
    isEditable: true,
    curveColor: "#3498db",
    initialCurveColor: "#3498db",
    allowMultipleConnections: true,
    curveStrokeWidth: 3,
    initialCurveStrokeWidth: 2,
    curveOpacity: 0.8,
    initialCurveOpacity: 0.6,
    connectorSize: 10,
    highlightedConnectorSize: 14,
    connectorColor: "#3498db",
    highlightedConnectorColor: "#e74c3c",
    containerWidth: "100%",
    initialCurveStyle: "dashed",
    modifiedCurveStyle: "solid",
  };

  const config = ref(defaultConfig);

  const getCurvePath = (curve) => {
    const { x: startX, y: startY } = curve.start;
    const { x: endX, y: endY } = curve.end;
    const controlX1 = startX + (endX - startX) / 3;
    const controlY1 = startY;
    const controlX2 = endX - (endX - startX) / 3;
    const controlY2 = endY;
    return `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
  };

  const startDrag = (side, index, event) => {
    if (!config.value.isEditable) return;
    const parentElement = event.target.parentElement;
    if (!parentElement) return;

    const id = parseInt(parentElement.getAttribute("data-id") || "0");
    state.value.isDragging = true;
    state.value.dragTarget = { side, index };
    state.value.highlightedConnector = `${side}-${index}`;

    const svgRect = state.value.svg.getBoundingClientRect();
    const connectorRect = event.target.getBoundingClientRect();
    const startPoint = {
      x: connectorRect.left + connectorRect.width / 2 - svgRect.left,
      y: connectorRect.top + connectorRect.height / 2 - svgRect.top,
    };

    const newCurve = {
      start: startPoint,
      end: startPoint,
      startKey: side === "left" ? id : null,
      endKey: side === "right" ? id : null,
      isInitial: false, // 确保新添加的曲线不是初始曲线
      isTemporary: true,
    };

    state.value.curves.push(newCurve);
    state.value.activeCurveIndex = state.value.curves.length - 1;
    onMouseMove(event);
  };

  const stopDrag = () => {
    if (state.value.isDragging && state.value.activeCurveIndex !== null) {
      const nearestConnector = findNearestConnector();
      if (nearestConnector && nearestConnector.point && nearestConnector.id) {
        updateCurveOnDragStop(nearestConnector);
      } else {
        state.value.curves.splice(state.value.activeCurveIndex, 1);
      }
    }
    resetDragState();
  };

  const updateCurveOnDragStop = (nearestConnector) => {
    const { dragTarget, curves, activeCurveIndex } = state.value;
    let startKey, endKey;

    if (dragTarget?.side === "left") {
      startKey = curves[activeCurveIndex].startKey;
      endKey = parseInt(nearestConnector.id.split("-")[1]);
    } else {
      startKey = parseInt(nearestConnector.id.split("-")[1]);
      endKey = curves[activeCurveIndex].endKey;
    }

    const existingConnectionIndex = findExistingConnectionIndex(
      startKey,
      endKey,
    );

    if (existingConnectionIndex !== -1) {
      curves.splice(activeCurveIndex, 1);
    } else {
      updateCurve(
        curves[activeCurveIndex],
        dragTarget?.side,
        nearestConnector,
        startKey,
        endKey,
      );
      emitChangeEvent();
    }
  };

  const findExistingConnectionIndex = (startKey, endKey) => {
    return state.value.curves.findIndex(
      (curve, index) =>
        index !== state.value.activeCurveIndex &&
        curve.startKey === startKey &&
        curve.endKey === endKey,
    );
  };

  const updateCurve = (curve, side, nearestConnector, startKey, endKey) => {
    if (side === "left") {
      curve.end = nearestConnector.point;
      curve.endKey = endKey;
    } else {
      curve.start = nearestConnector.point;
      curve.startKey = startKey;
    }
    curve.isTemporary = false;
    updateConnectionCounts(startKey, endKey);
  };

  const updateConnectionCounts = (startKey, endKey) => {
    state.value.connectionCounts[startKey] =
      (state.value.connectionCounts[startKey] || 0) + 1;
    state.value.connectionCounts[endKey] =
      (state.value.connectionCounts[endKey] || 0) + 1;
  };

  const resetDragState = () => {
    state.value.isDragging = false;
    state.value.dragTarget = null;
    state.value.highlightedConnector = null;
    state.value.activeCurveIndex = null;
  };

  const onMouseMove = (event) => {
    if (
      !state.value.isDragging ||
      !state.value.svg ||
      state.value.activeCurveIndex === null
    )
      return;

    const svgRect = state.value.svg.getBoundingClientRect();
    const x = event.clientX - svgRect.left;
    const y = event.clientY - svgRect.top;

    state.value.dragPoint = { x, y };

    if (state.value.dragTarget?.side === "left") {
      state.value.curves[state.value.activeCurveIndex].end = { x, y };
    } else {
      state.value.curves[state.value.activeCurveIndex].start = { x, y };
    }

    updateHighlightedConnector();
  };

  const updateHighlightedConnector = () => {
    const nearestConnector = findNearestConnector();
    state.value.highlightedConnector = nearestConnector
      ? nearestConnector.id
      : `${state.value.dragTarget.side}-${state.value.dragTarget.index}`;
  };

  const findNearestConnector = () => {
    if (!state.value.svg || !state.value.dragTarget) return null;

    const svgRect = state.value.svg.getBoundingClientRect();
    const connectors = document.querySelectorAll(
      state.value.dragTarget.side === "left"
        ? ".right .connector"
        : ".left .connector",
    );
    let nearestDistance = Infinity;
    let nearestPoint = null;
    let nearestId = null;

    let connectorElement = null;

    connectors.forEach((connector, index) => {
      const rect = connector.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - svgRect.left;
      const centerY = rect.top + rect.height / 2 - svgRect.top;
      const distance = Math.sqrt(
        Math.pow(centerX - state.value.dragPoint.x, 2) +
          Math.pow(centerY - state.value.dragPoint.y, 2),
      );

      if (distance < nearestDistance && distance < 50) {
        nearestDistance = distance;
        nearestPoint = { x: centerX, y: centerY };
        nearestId = `${
          state.value.dragTarget?.side === "left" ? "right" : "left"
        }-${index}`;
        connectorElement = connector;
      }
    });

    return nearestPoint
      ? { point: nearestPoint, id: nearestId, connector: connectorElement }
      : null;
  };

  const selectCurve = (index) => {
    state.value.selectedCurveIndices = [index];
  };

  const handleKeyDown = (event) => {
    if (event.key === "Delete" && state.value.selectedCurveIndices.length > 0) {
      deleteCurves(state.value.selectedCurveIndices);
      state.value.selectedCurveIndices = [];
      emitChangeEvent();
    }
  };

  const deleteCurves = (indices) => {
    indices.forEach((index) => {
      const curve = state.value.curves[index];
      if (curve) {
        updateConnectionCountsOnDelete(curve.startKey, curve.endKey);
      }
    });
    state.value.curves = state.value.curves.filter(
      (_, index) => !indices.includes(index),
    );
  };

  const updateConnectionCountsOnDelete = (startKey, endKey) => {
    state.value.connectionCounts[startKey] =
      (state.value.connectionCounts[startKey] || 1) - 1;
    state.value.connectionCounts[endKey] =
      (state.value.connectionCounts[endKey] || 1) - 1;
  };

  const updateCurvePositions = () => {
    state.value.curves.forEach(updateCurvePosition);
  };

  const updateCurvePosition = (curve) => {
    const { startKey, endKey } = curve;
    const startEle = document.querySelector(`.left li[data-id="${startKey}"]`);
    const endEle = document.querySelector(`.right li[data-id="${endKey}"]`);

    if (startEle && endEle && state.value.svg) {
      const svgRect = state.value.svg.getBoundingClientRect();
      const leftRect = startEle.getBoundingClientRect();
      const rightRect = endEle.getBoundingClientRect();

      curve.start = {
        x: leftRect.right - svgRect.left,
        y: leftRect.top + leftRect.height / 2 - svgRect.top,
      };
      curve.end = {
        x: rightRect.left - svgRect.left,
        y: rightRect.top + rightRect.height / 2 - svgRect.top,
      };
    }
  };

  const initializeData = (data) => {
    if (data) {
      config.value.initialData = data;
    }

    const { data: itemsData, links } = config.value.initialData;
    const leftIds = new Set(
      links.map((link) => link.split("-")[0]).map(Number),
    );

    state.value.leftItems = itemsData.filter((item) => leftIds.has(item.id));
    state.value.rightItems = itemsData.filter((item) => !leftIds.has(item.id));

    state.value.curves = links
      .filter((link) => /^(\d+)-(\d+)$/.test(link))
      .map((link) => {
        const [leftId, rightId] = link.split("-").map(Number);
        const leftItem = state.value.leftItems.find(
          (item) => item.id === leftId,
        );
        const rightItem = state.value.rightItems.find(
          (item) => item.id === rightId,
        );

        if (leftItem && rightItem) {
          updateConnectionCounts(leftId, rightId);
          return {
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
            startKey: leftId,
            endKey: rightId,
            isInitial: true, // 确保这里设置为 true
          };
        }
        return null;
      })
      .filter((curve) => curve !== null);

    state.value.initialCurves = JSON.parse(JSON.stringify(state.value.curves));

    nextTick(updateCurvePositions);
  };

  const debouncedUpdateCurvePositions = debounce(updateCurvePositions, 200);

  const emitChangeEvent = () => {
    const links = state.value.curves.map(
      (curve) => `${curve.startKey}-${curve.endKey}`,
    );
    emit("change", {
      startPoints: state.value.leftItems,
      endPoints: state.value.rightItems,
      links,
    });
  };

  const initialize = (data, options = {}) => {
    // 合并用户提供的选项
    Object.assign(config.value, options);

    initializeData(data);
    nextTick(updateCurvePositions);
  };

  const reset = () => {
    state.value.curves = JSON.parse(JSON.stringify(state.value.initialCurves));
    state.value.connectionCounts = {};
    state.value.curves.forEach((curve) => {
      updateConnectionCounts(curve.startKey, curve.endKey);
      curve.isInitial = true; // 确保重置时所有曲线都被标记为初始曲线
    });
    nextTick(updateCurvePositions);
    emitChangeEvent();
  };

  const deleteAllConnections = () => {
    state.value.curves = [];
    state.value.connectionCounts = {};
    emitChangeEvent();
  };

  const getCurveStyle = (curve) => {
    const isInitial = curve.isInitial;
    const style = isInitial
      ? config.value.initialCurveStyle
      : config.value.modifiedCurveStyle;
    const baseStyle = {
      strokeWidth: isInitial
        ? config.value.initialCurveStrokeWidth
        : config.value.curveStrokeWidth,
      strokeOpacity: isInitial
        ? config.value.initialCurveOpacity
        : config.value.curveOpacity,
    };

    return {
      stroke: isInitial
        ? config.value.initialCurveColor
        : config.value.curveColor,
      strokeDasharray: style === "dashed" ? "5,5" : "none",
      ...baseStyle,
    };
  };

  return {
    state,
    config,
    getCurvePath,
    startDrag,
    stopDrag,
    onMouseMove,
    selectCurve,
    updateCurvePositions,
    handleKeyDown,
    debouncedUpdateCurvePositions,
    emitChangeEvent,
    initialize,
    reset,
    deleteAllConnections,
    getCurveStyle,
  };
}
