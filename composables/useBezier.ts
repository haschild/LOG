import { ref, onMounted, onUnmounted, nextTick } from "vue";

// 定义接口
interface Point {
  x: number;
  y: number;
}

interface Curve {
  start: Point;
  end: Point;
  startKey: number | null;
  endKey: number | null;
}

interface Item {
  name: string;
  id: number;
}

interface Connector {
  point: {x: number,y: number}|null;
  id?: string|null;
  connector?: HTMLElement|null;
}

// 防抖函数
const debounce = (func: Function, wait: number) => {
  let timeout: number | undefined;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

// 使用贝塞尔曲线的组合函数
export function useBezier(emit: (event: string, ...args: any[]) => void) {
  const bgColor = ref("yellow");
  const svg = ref<SVGSVGElement | null>(null);

  const leftItems = ref<Item[]>([]);
  const rightItems = ref<Item[]>([]);

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

  // 配置变量
  const defConfig = ref({
    isEditable: true, // 是否可以编辑
    curveColor: "#3498db", // 配置连接线的颜色
    connectorPosition: "left right", // 设置连接点的位置
    allowMultipleConnections: true, // 设置连接点是否可以有多个连接线
    initialData: {
      data: [
        { name: "选项1", id: 1, connectorPosition: "left" },
        { name: "选项2", id: 2, connectorPosition: "left" },
        { name: "选项3", id: 3, connectorPosition: "left" },
        { name: "选项4", id: 4, connectorPosition: "right" },
        { name: "选项5", id: 5, connectorPosition: "right" },
        { name: "选项6", id: 6, connectorPosition: "right" },
      ],
      links: ["1-6", "2-4", "3-5","1-4"], // 连接线，通过id确定连接关系
    },
  });

  // 计数器对象，用于跟踪每个吸附点的连接曲线数量
  const connectionCounts = ref<{ [key: string]: number }>({});

  // 获取曲线路径
  const getCurvePath = (curve: Curve) => {
    const { x: startX, y: startY } = curve.start;
    const { x: endX, y: endY } = curve.end;

    const controlX1 = startX + (endX - startX) / 3;
    const controlY1 = startY;
    const controlX2 = endX - (endX - startX) / 3;
    const controlY2 = endY;

    return `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
  };

  // 触发完成事件
  const emitCompleteEvent = () => {
    const links = curves.value.map(curve => `${curve.startKey}-${curve.endKey}`);
    emit('complete', {
      startPoints: leftItems.value,
      endPoints: rightItems.value,
      links
    });
  };

  // 开始拖动
  const startDrag = (side: "left" | "right", index: number, event: MouseEvent) => {
    if (!defConfig.value.isEditable) return;

    isDragging.value = true;
    dragTarget.value = { side, index };

    const newCurveIndex = curves.value.length;
    const svgRect = svg.value!.getBoundingClientRect();
    const connectorRect = (event.target as HTMLElement).getBoundingClientRect();
    const point = {
      x: connectorRect.left + connectorRect.width / 2 - svgRect.left,
      y: connectorRect.top + connectorRect.height / 2 - svgRect.top,
    };

    let connectedCurves = 0;
    const parentElement = (event.target as HTMLElement).parentElement;
    if (parentElement) {
      const targetId = parentElement.getAttribute("data-id");
      connectedCurves = targetId ? connectionCounts.value[targetId] : 0;
    }

    if (!defConfig.value.allowMultipleConnections && connectedCurves > 0) {
      isDragging.value = false;
      return;
    }

    if (side === "left") {
      curves.value.push({ start: point, end: { x: point.x, y: point.y }, startKey: parseInt(parentElement?.getAttribute("data-id") || "0"), endKey: null });
    } else {
      curves.value.push({ start: { x: point.x, y: point.y }, end: point, startKey: null, endKey: parseInt(parentElement?.getAttribute("data-id") || "0") });
    }
    activeCurveIndex.value = newCurveIndex;
  };

  // 停止拖动
  const stopDrag = () => {
    if (isDragging.value && activeCurveIndex.value !== null) {
      const nearestConnector = findNearestConnector();
      if (nearestConnector) {
        if (dragTarget.value?.side === "left") {
          if (defConfig.value.allowMultipleConnections || !curves.value.some(curve => curve.end === nearestConnector.point)) {
            curves.value[activeCurveIndex.value].end = nearestConnector.point;
            let parentElement = (nearestConnector.connector as HTMLElement).parentElement;
            curves.value[activeCurveIndex.value].endKey = parseInt(nearestConnector.id.split("-")[1]);
            const key = `${nearestConnector.point.x}-${nearestConnector.point.y}`;
            connectionCounts.value[key] = (connectionCounts.value[key] || 0) + 1;
          } else {
            curves.value.splice(activeCurveIndex.value, 1);
          }
        } else {
          if (defConfig.value.allowMultipleConnections || !curves.value.some(curve => curve.start === nearestConnector.point)) {
            curves.value[activeCurveIndex.value].start = nearestConnector.point;
            curves.value[activeCurveIndex.value].startKey = parseInt(nearestConnector.id.split("-")[1]);
            const key = `${nearestConnector.point.x}-${nearestConnector.point.y}`;
            connectionCounts.value[key] = (connectionCounts.value[key] || 0) + 1;
          } else {
            curves.value.splice(activeCurveIndex.value, 1);
          }
        }
      } else {
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

    emitCompleteEvent();
  };

  // 鼠标移动
  const onMouseMove = (event: MouseEvent) => {
    if (isSelecting.value) {
      const svgRect = svg.value!.getBoundingClientRect();
      selectionEnd.value = {
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top,
      };
      return;
    }

    if (!isDragging.value || !svg.value || activeCurveIndex.value === null) return;

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

  // 查找最近的连接点
  const findNearestConnector = (): Connector | null => {
    if (!svg.value || !dragTarget.value) return null;

    const svgRect = svg.value.getBoundingClientRect();
    const connectors = document.querySelectorAll(
      dragTarget.value.side === "left"
        ? ".right .connector"
        : ".left .connector",
    ) as NodeListOf<HTMLElement>;
    let nearestDistance = Infinity;
    let nearestPoint = null;
    let nearestId = null;

    let connector = null;

    connectors.forEach((connector, index) =>  {
      
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
        nearestId = `${dragTarget.value?.side === "left" ? "right" : "left"}-${index}`;
        connector = connector;
      }
    });

    return nearestPoint ? { point: nearestPoint, id: nearestId,connector } : null;
  };

  // 选择曲线
  const selectCurve = (index: number) => {
    selectedCurveIndices.value = selectedCurveIndices.value.includes(index)
      ? selectedCurveIndices.value.filter((i) => i !== index)
      : [...selectedCurveIndices.value, index];
  };

  // 选择框选中的曲线
  const selectCurvesInSelection = () => {
    const { x: x1, y: y1 } = selectionStart.value;
    const { x: x2, y: y2 } = selectionEnd.value;
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.min(y1, y2);

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

  // 开始框选
  const startSelection = (event: MouseEvent) => {
    isSelecting.value = true;
    const svgRect = svg.value!.getBoundingClientRect();
    selectionStart.value = {
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    };
    selectionEnd.value = selectionStart.value;
  };

  // 处理删除键
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Delete" && selectedCurveIndices.value.length > 0) {
      selectedCurveIndices.value.forEach((index) => {
        const curve = curves.value[index];
        if (curve) {
          const startKey = `${curve.startKey}`;
          const endKey = `${curve.endKey}`;
          connectionCounts.value[startKey] = (connectionCounts.value[startKey] || 1) - 1;
          connectionCounts.value[endKey] = (connectionCounts.value[endKey] || 1) - 1;
        }
      });

      curves.value = curves.value.filter(
        (_, index) => !selectedCurveIndices.value.includes(index),
      );
      selectedCurveIndices.value = [];
      emitCompleteEvent();
    }
  };

  // 更新曲线位置
  const updateCurvePositions = () => {
    curves.value.forEach((curve, index) => {
      const { startKey, endKey } = curve;
      const startEle = document.querySelector(`.left li[data-id="${startKey}"]`);
      const endEle = document.querySelector(`.right li[data-id="${endKey}"]`);
      
      if (startEle && endEle && svg.value) {
        const svgRect = svg.value.getBoundingClientRect();
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
    });
  };

  // 初始化数据
  const initializeData = () => {
    const { data, links } = defConfig.value.initialData;

    leftItems.value = data.filter((item) => item.connectorPosition === "left");
    rightItems.value = data.filter((item) => item.connectorPosition === "right");

    const validLinks = links.filter(link => /^(\d+)-(\d+)$/.test(link));
    curves.value = validLinks
      .map((link) => {
        const [leftId, rightId] = link.split("-").map(Number);
        const leftItem = leftItems.value.find((item) => item.id === leftId);
        const rightItem = rightItems.value.find((item) => item.id === rightId);

        if (leftItem && rightItem) {
          connectionCounts.value[leftId] = (connectionCounts.value[leftId] || 0) + 1;
          connectionCounts.value[rightId] = (connectionCounts.value[rightId] || 0) + 1;

          return {
            start: { x: 0, y: 0 },
            end: { x: 0, y: 0 },
            startKey: leftId,
            endKey: rightId
          };
        }
        return null;
      })
      .filter((curve) => curve !== null);

    nextTick(() => {
      updateCurvePositions();
      emitCompleteEvent();
    });
  };

  // 防抖处理的更新曲线位置函数
  const debouncedUpdateCurvePositions = debounce(updateCurvePositions, 200);

  return {
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
    isEditable: defConfig.value.isEditable,
    allowMultipleConnections: defConfig.value.allowMultipleConnections,
    connectionCounts,
    debouncedUpdateCurvePositions
  };
}
