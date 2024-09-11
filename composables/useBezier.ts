import { ref, onMounted, onUnmounted } from "vue";

// 将所有接口和类型定义移到这里
interface Point {
  x: number;
  y: number;
}

interface Curve {
  start: Point;
  end: Point;
}

interface Item {
  name: string;
  id: number;
}

// ... 其他接口定义 ...

export function useBezier() {
  const bgColor = ref("yellow");
  const svg = ref<SVGSVGElement | null>(null);

  const leftItems = ref<Item[]>([]);
  const rightItems = ref<Item[]>([]);

  const isDragging = ref(false);
  const dragTarget = ref<{ side: "left" | "right"; index: number } | null>(
    null,
  );
  const dragPoint = ref({ x: 0, y: 0 });

  const curves = ref<Curve[]>([]);
  const activeCurveIndex = ref<number | null>(null);
  const highlightedConnector = ref(null);

  const isSelecting = ref(false);
  const selectionStart = ref<Point>({ x: 0, y: 0 });
  const selectionEnd = ref<Point>({ x: 0, y: 0 });
  const selectedCurveIndices = ref<number[]>([]);

  const isEditable = ref(true);
  // 配置变量
  const defConfig = ref({
    // 是否可以编辑 true/false
    isEditable: true,
    // 配置连接线的颜色
    curveColor: "#3498db",
    // 设置连接点的位置 左右可以连接
    connectorPosition: "left right",
    // 设置连接点是否可以有多个连接线 true/false
    allowMultipleConnections: true,
    // 初始化数据
    initialData: {
      data: [
        { name: "1", id: 1, connectorPosition: "left" },
        { name: "2", id: 2, connectorPosition: "left" },
        { name: "3", id: 3, connectorPosition: "left" },
        { name: "1", id: 4, connectorPosition: "right" },
        { name: "2", id: 5, connectorPosition: "right" },
        { name: "3", id: 6, connectorPosition: "right" },
      ],
      // 连接线, 通过id确定连接关系
      links: ["1-6", "2-4", "3-5"],
    },
  });

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
    if (!isEditable.value) return;

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
      dragTarget.value.side === "left"
        ? ".right .connector"
        : ".left .connector",
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
        // 使用可选链操作符来避免 null 错误
        nearestId = `${dragTarget.value?.side === "left" ? "right" : "left"}-${index}`;
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

  const updateCurvePositions = () => {
    curves.value.forEach((curve, index) => {
      const leftConnector = document.querySelector(
        `.left .connector:nth-child(${index + 1})`,
      ) as HTMLElement | null;
      const rightConnector = document.querySelector(
        `.right .connector:nth-child(${index + 1})`,
      ) as HTMLElement | null;

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
  };

  const initializeData = () => {
    const { data, links } = defConfig.value.initialData;

    leftItems.value = data.filter((item) => item.connectorPosition === "left");
    rightItems.value = data.filter(
      (item) => item.connectorPosition === "right",
    );

    // 初始化连接线
    curves.value = links
      .map((link) => {
        const [leftId, rightId] = link.split("-").map(Number);
        const leftItem = leftItems.value.find((item) => item.id === leftId);
        const rightItem = rightItems.value.find((item) => item.id === rightId);

        if (leftItem && rightItem) {
          return {
            start: { x: 0, y: 0 }, // 临时坐标，稍后更新
            end: { x: 0, y: 0 }, // 临时坐标，稍后更新
          };
        }
        return null;
      })
      .filter((curve): curve is Curve => curve !== null);

    // 在下一个 tick 更新曲线位置
    nextTick(() => {
      updateCurvePositions();
    });
  };

  onMounted(() => {
    initializeData();
    window.addEventListener("resize", updateCurvePositions);
    window.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateCurvePositions);
    window.removeEventListener("keydown", handleKeyDown);
  });

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
  };
}
