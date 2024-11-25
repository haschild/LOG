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
 *    获取曲线样式
 *    @param {Object} curve - 曲线对象
 *    @returns {Object} 样式对象
 *
 * 配置选项 (options):
 * - isEditable: boolean - 是否可编辑
 * - curveColor: string - 曲线颜色
 * - allowMultipleConnections: boolean - 是否允许多重连接
 * - curveStrokeWidth: number - 曲线宽度
 * - curveOpacity: number - 曲线不透明度
 * - connectorSize: number - 连接点大小
 * - highlightedConnectorSize: number - 高亮连接点大小
 * - connectorColor: string - 连接点颜色
 * - highlightedConnectorColor: string - 高亮连接点颜色
 * - curveStyle: 'dashed' | 'solid' - 曲线样式
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

    // 所有的连接线集合
    curves: [],
    isDragging: false,
    dragTarget: null,
    dragPoint: { x: 0, y: 0 },
    activeCurveIndex: null,
    highlightedConnector: null,
    selectedCurveList: [],
    connectionCounts: {},
    initialCurves: [],
    containerElement: null,
  });

  const defaultConfig = {
    isEditable: true,
    curveColor: "#3498db",
    curveStyle: "dashed", // dashed:虚线， solid：实线
    allowMultipleConnections: true,
    curveWidth: 2,
    curveOpacity: 0.5,
    connectorSize: 10,
    curveDirection: "both", // leftToRight:从左到右，rightToLeft:从右到左，both:双向
    highlightedConnectorSize: 14,
    connectorColor: "#3498db",
    highlightedConnectorColor: "#e74c3c",
    key: null,
    // 添加 tooltip 配置
    tooltip: {
      enable: true, // 是否启用tooltip
      offset: { x: 5, y: -10 }, // tooltip 偏移量
      style: {
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        borderRadius: "4px",
        padding: "8px 12px",
      },
    },
  };

  const config = ref(defaultConfig);

  const getCurvePath = (curve) => {
    const { x: startX, y: startY } = curve.start;
    const { x: endX, y: endY } = curve.end;
    const controlX1 = startX + (endX - startX) / 3;
    const controlY1 = startY;
    const controlX2 = endX - (endX - startX) / 3;
    const controlY2 = endY;

    // 生成基本的曲线路径
    let path = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;

    // 根据 curveDirection 添加 marker
    let marker = "";
    if (curve.curveDirection === "rightToLeft") {
      marker = "url(#marketElement)"; // 向左的箭头
    } else if (curve.curveDirection === "leftToRight") {
      marker = "url(#marketElement)"; // 向右的箭头
    } // 如果是 'both'，则不添加 marker

    return {
      path,
      marker,
    };
  };

  const startDrag = (side, index, event) => {
    if (!config.value.isEditable) return;
    console.log(side, config.value.curveDirection, "000");

    // 根据方向判断，是否可以点击
    if (
      (side === "left" && config.value.curveDirection === "rightToLeft") ||
      (side === "right" && config.value.curveDirection === "leftToRight")
    ) {
      return;
    }

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
      isTemporary: true,
      curveStyle: config.value.curveStyle, // 默认取用配置
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

    // 移除 curveDirection 的逻辑
    curves[activeCurveIndex].startKey = startKey;
    curves[activeCurveIndex].endKey = endKey;

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

  const selectCurve = (curve) => {
    let key = config.value.key;
    let keys = state.value.selectedCurveList.map((item) => item[key]);
    state.value.selectedCurveList = !keys.includes(key) ? [curve] : [];
  };

  const handleKeyDown = (event) => {
    if (event.key === "Delete" && state.value.selectedCurveList.length > 0) {
      deleteCurves(state.value.selectedCurveList);
      state.value.selectedCurveList = [];
      emitChangeEvent();
    }
  };

  const deleteCurves = (indices) => {
    indices.forEach((curve) => {
      if (curve) {
        updateConnectionCountsOnDelete(curve.startKey, curve.endKey);
      }
    });
    state.value.curves = state.value.curves.filter(
      (_, index) => !indices.includes(_),
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

    const { rightItems, leftItems, links } = config.value.initialData;

    state.value.leftItems = leftItems;
    state.value.rightItems = rightItems;
    if (Array.isArray(links) && links.length > 0) {
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

              curveStyle: config.value.curveStyle, // 默认取用配置
            };
          }
          return null;
        })
        .filter((curve) => curve !== null);

      state.value.initialCurves = JSON.parse(
        JSON.stringify(state.value.curves),
      );

      nextTick(updateCurvePositions);
    }
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
    });
    nextTick(updateCurvePositions);
    emitChangeEvent();
  };

  const deleteAllConnections = () => {
    state.value.curves = [];
    state.value.selectedCurveList = [];
    state.value.connectionCounts = {};
    emitChangeEvent();
  };

  /**
   *
   * @param {Object} curve
   * @returns 返回连接线样式
   */
  const getCurveStyle = (curve) => {
    let { curveColor, curveOpacity, curveWidth } = config.value;
    return {
      stroke: curveColor,
      "stroke-dasharray": curve.curveStyle === "dashed" ? "5,2" : "none", // 控制虚或实线
      "stroke-width": curveWidth,
      "stroke-opacity": curveOpacity,
    };
  };

  const addBatchConnections = (data, options, clearExisting = false) => {
    if (clearExisting) {
      state.value.curves = []; // 清空当前所有连接线
      state.value.connectionCounts = {};
    }

    const { links } = data;

    links.forEach((link) => {
      const [startKey, endKey] = link.split("-").map(Number);
      const newCurve = {
        startKey,
        endKey,
        start: { x: 0, y: 0 }, // 初始位置
        end: { x: 0, y: 0 }, // 初始位置
        curveStyle: options.curveStyle || config.value.curveStyle,
        curveDirection: options.curveDirection || config.value.curveDirection,
      };
      state.value.curves.push(newCurve);
      updateConnectionCounts(startKey, endKey);
    });

    nextTick(updateCurvePositions);
    emitChangeEvent();
  };

  const resetConfig = (options = {}) => {
    Object.assign(config.value, defaultConfig, options);
  };

  const connectEnable = () => {
    return (
      config.value.isEditable &&
      (config.value.allowMultipleConnections ||
        state.value.connectionCounts[`${item.id}`] < 1)
    );
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
    addBatchConnections,
    resetConfig,
    connectEnable,
  };
}
