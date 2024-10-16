import { ref, watch } from "vue";

export function useBezierConnector(props) {
  // 定义响应式数据
  const leftItems = ref([]);
  const rightItems = ref([]);
  const connections = ref([]);
  const activeConnections = ref([]);
  const activeAttachPoint = ref(null);
  const tempConnection = ref(null);

  // 默认配置
  const configDefine = {
    itemKey: "id",
    lineType: "solid",
    direction: "both",
    editable: true,
    deletable: true,
    lineColor: "#007bff",
    lineWidth: 2,
    activeLineColor: "#ff0000",
    attachPointRadius: 5,
    attachPointColor: "#007bff",
    attachPointActiveColor: "#ff0000",
    curveType: "slight",
  };

  /**
   * 初始化连接器
   * @param {Object} data - 包含项目和连接数据的对象
   * @param {Object} options - 自定义配置选项
   */
  const initialize = (data, options) => {
    const config = { ...configDefine, ...options };
    console.log("Initializing with config:", config);
    console.log("Data:", data);

    // 分配左右列表项
    const allItems = data.data || [];
    leftItems.value = allItems.slice(0, Math.ceil(allItems.length / 2));
    rightItems.value = allItems.slice(Math.ceil(allItems.length / 2));

    // 初始化连接
    connections.value = (data.links || []).map((link) => {
      const [from, to] = link.split("-");
      return { from, to, curve: config.curveType };
    });

    console.log("Connections initialized:", connections.value);

    // 更新 props
    Object.assign(props, config);
  };

  /**
   * 添加新连接
   * @param {string} fromId - 起始项目 ID
   * @param {string} toId - 目标项目 ID
   * @param {string} curveType - 曲线类型
   */
  const addConnection = (fromId, toId, curveType = configDefine.curveType) => {
    if (!connections.value.some((c) => c.from === fromId && c.to === toId)) {
      connections.value.push({ from: fromId, to: toId, curve: curveType });
    }
  };

  /**
   * 移除连接
   * @param {string} fromId - 起始项目 ID
   * @param {string} toId - 目标项目 ID
   */
  const removeConnection = (fromId, toId) => {
    const index = connections.value.findIndex(
      (c) => c.from === fromId && c.to === toId,
    );
    if (index !== -1) {
      connections.value.splice(index, 1);
    }
  };

  /**
   * 更新连接曲线类型
   * @param {string} fromId - 起始项目 ID
   * @param {string} toId - 目标项目 ID
   * @param {string} newCurveType - 新的曲线类型
   */
  const updateConnectionCurve = (fromId, toId, newCurveType) => {
    const connection = connections.value.find(
      (c) => c.from === fromId && c.to === toId,
    );
    if (connection) {
      connection.curve = newCurveType;
    }
  };

  /**
   * 批量添加连接
   * @param {Array} data - 连接数据数组
   * @param {Object} options - 配置选项
   * @param {boolean} clearExisting - 是否清除现有连接
   */
  const addBatchConnections = (data, options, clearExisting = false) => {
    const config = { ...configDefine, ...options };
    if (clearExisting) {
      connections.value = [];
    }
    data.forEach((link) => {
      const [from, to] = link.split("-");
      addConnection(from, to, config.curveType);
    });
  };

  /**
   * 批量移除连接
   * @param {Array} data - 要移除的连接数据数组
   */
  const removeBatchConnections = (data) => {
    data.forEach((link) => {
      const [from, to] = link.split("-");
      removeConnection(from, to);
    });
  };

  /**
   * 获取项目的吸附点
   * @param {string} id - 项目 ID
   * @param {string} type - 项目类型（左侧或右侧）
   * @returns {Array} 吸附点坐标数组
   */
  const getAttachPoints = (id, type) => {
    const items = type === "left" ? leftItems.value : rightItems.value;
    const item = items.find((i) => i[props.itemKey] === id);
    if (!item) return [];

    return [{ x: type === "left" ? 0 : 100, y: 50 }];
  };

  /**
   * 高亮吸附点
   * @param {string} id - 项目 ID
   * @param {string} type - 项目类型（左侧或右侧）
   * @param {number} pointIndex - 吸附点索引
   */
  const highlightAttachPoint = (id, type, pointIndex) => {
    // 实现高亮逻辑
  };

  /**
   * 处理吸附点点击事件
   * @param {string} id - 项目 ID
   * @param {string} type - 项目类型（左侧或右侧）
   * @param {number} pointIndex - 吸附点索引
   */
  const handleAttachPointClick = (id, type, pointIndex) => {
    if (tempConnection.value) {
      // 如果已有临时连接线，完成连接
      if (tempConnection.value.type !== type) {
        addConnection(tempConnection.value.id, id);
      }
      tempConnection.value = null;
    } else {
      // 初始化临时连接线
      tempConnection.value = { id, type, pointIndex };
    }
  };

  /**
   * 处理鼠标移动事件
   * @param {MouseEvent} event - 鼠标事件对象
   */
  const handleMouseMove = (event) => {
    if (tempConnection.value) {
      // 更新临时连接线的终点坐标
      tempConnection.value.endX = event.clientX;
      tempConnection.value.endY = event.clientY;
    }
  };

  /**
   * 处理鼠标释放事件
   */
  const handleMouseUp = () => {
    if (tempConnection.value) {
      // 如果鼠标释放时不在有效的吸附点上，取消临时连接线
      tempConnection.value = null;
    }
  };

  /**
   * 计算临时连接线路径
   * @returns {string} SVG 路径字符串
   */
  const calculateTempPath = () => {
    if (!tempConnection.value) return "";

    const fromPoints = getAttachPoints(
      tempConnection.value.id,
      tempConnection.value.type,
    );
    if (fromPoints.length === 0) return "";

    const fromPoint = fromPoints[0];
    const toPoint = {
      x: tempConnection.value.endX,
      y: tempConnection.value.endY,
    };

    // 计算贝塞尔曲线的控制点
    const controlPointX1 = fromPoint.x + (toPoint.x - fromPoint.x) / 2;
    const controlPointY1 = fromPoint.y;
    const controlPointX2 = controlPointX1;
    const controlPointY2 = toPoint.y;

    // 返回三次贝塞尔曲线的 SVG 路径
    return `M${fromPoint.x},${fromPoint.y} C${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${toPoint.x},${toPoint.y}`;
  };

  /**
   * 处理连接点击事件
   * @param {Object} connection - 连接对象
   */
  const handleConnectionClick = (connection) => {
    const index = activeConnections.value.findIndex(
      (c) => c.from === connection.from && c.to === connection.to,
    );
    if (index === -1) {
      activeConnections.value.push(connection);
    } else {
      activeConnections.value.splice(index, 1);
    }
  };

  /**
   * 计算连接路径
   * @param {Object} connection - 连接对象
   * @returns {string} SVG 路径字符串
   */
  const calculatePath = (connection) => {
    const fromPoints = getAttachPoints(connection.from, "left");
    const toPoints = getAttachPoints(connection.to, "right");

    if (fromPoints.length === 0 || toPoints.length === 0) {
      return ""; // 返回空字符串以避免错误
    }

    const fromPoint = fromPoints[0];
    const toPoint = toPoints[0];

    if (
      !fromPoint ||
      !toPoint ||
      fromPoint.x === undefined ||
      toPoint.x === undefined
    ) {
      return ""; // 确保 x 存在
    }

    // 计算贝塞尔曲线的控制点
    const controlPointX1 = fromPoint.x + (toPoint.x - fromPoint.x) / 2;
    const controlPointY1 = fromPoint.y;
    const controlPointX2 = controlPointX1;
    const controlPointY2 = toPoint.y;

    // 返回三次贝塞尔曲线的 SVG 路径
    return `M${fromPoint.x},${fromPoint.y} C${controlPointX1},${controlPointY1} ${controlPointX2},${controlPointY2} ${toPoint.x},${toPoint.y}`;
  };

  /**
   * 检查连接是否处于活动状态
   * @param {Object} connection - 连接对象
   * @returns {boolean} 是否处于活动状态
   */
  const isConnectionActive = (connection) => {
    return activeConnections.value.some(
      (c) => c.from === connection.from && c.to === connection.to,
    );
  };

  /**
   * 检查吸附点是否处于活动状态
   * @param {string} id - 项目 ID
   * @param {string} type - 项目类型（左侧或右侧）
   * @param {number} pointIndex - 吸附点索引
   * @returns {boolean} 是否处于活动状态
   */
  const isAttachPointActive = (id, type, pointIndex) => {
    return (
      activeAttachPoint.value &&
      activeAttachPoint.value.id === id &&
      activeAttachPoint.value.type === type &&
      activeAttachPoint.value.pointIndex === pointIndex
    );
  };

  // 监听 editable 属性变化
  watch(
    () => props.editable,
    (newValue) => {
      // 实现显示/隐藏吸附点的逻辑
    },
  );

  // 返回公共 API
  return {
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
    isAttachPointActive,
    handleMouseMove,
    handleMouseUp,
    calculateTempPath,
    tempConnection,
  };
}
