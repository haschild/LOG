# AppBezierConnector 组件 API 文档

## 概述
`AppBezierConnector` 是一个用于创建和显示两列项目之间贝塞尔曲线连接的 Vue 组件。它允许用户可视化和管理项目之间的关系。

## Props

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| itemKey | String | 'id' | 用于唯一标识每个项目的键名 |
| lineType | String | 'solid' | 连接线类型，可选值：'solid'（实线）或 'dashed'（虚线） |
| direction | String | 'both' | 连接线方向，可选值：'leftToRight'（从左到右，右端添加箭头）、'rightToLeft'（从右到左，左端添加箭头）或 'both'（双向，无箭头） |
| editable | Boolean | true | 是否允许编辑连接。当为 false 时，吸附点不会显示，且无法创建或编辑连接线。 |
| deletable | Boolean | true | 是否允许删除连接 |
| lineColor | String | '#007bff' | 连接线颜色 |
| lineWidth | Number | 2 | 连接线宽度（单位：像素） |
| activeLineColor | String | '#ff0000' | 点击连接线后的颜色 |
| itemHoverContent | Function | null | 自定义项目悬停内容的函数，接收 (id, type) 作为参数，返回HTML字符串 |

## 事件

| 名称 | 参数 | 描述 |
|------|------|------|
| connection-added | { from, to, curve } | 当新的连接被添加时触发 |
| connection-removed | { from, to } | 当连接被移除时触发 |
| connection-updated | { from, to, curve } | 当连接的曲线类型被更新时触发 |
| change | Array | 当连接线发生任何变化时触发，返回新的连接线数组 |
| item-click | { id, type: 'left' \| 'right' } | 当项目被点击时触发 |
| connection-click | { from, to } | 当连接线被点击时触发 |
| highlight-change | { items: Array, connections: Array } | 当高亮状态发生变化时触发 |
| item-hover | { id, type: 'left' \| 'right', event: MouseEvent } | 当鼠标悬停在项目上时触发 |

## 插槽

| 名称 | 描述 |
|------|------|
| left-item | 自定义左侧项目的渲染 |
| right-item | 自定义右侧项目的渲染 |

## 方法

| 名称 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| initialize | (data, options) | void | 初始化组件，根据传入的数据和选项生成连接线 |
| addConnection | (fromId, toId, curveType) | void | 添加新的连接 |
| removeConnection | (fromId, toId) | void | 移除指定的连接 |
| updateConnectionCurve | (fromId, toId, newCurveType) | void | 更新指定连接的曲线类型 |
| addBatchConnections | (data, options, clearExisting = false) | void | 批量添加连接线 |
| removeBatchConnections | (data) | void | 批量删除连接线 |

### initialize(data, options)
初始化组件，根据传入的数据和选项生成连接线。这个方法会内部处理 leftItems、rightItems 和 connections 的设置。

- 参数：
  - data: Object - 包含项目数据和连接关系的对象
    - data.data: Array - 项目数组，每个项目应包含 name 和 id
    - data.links: Array - 连接关系数组，格式为 ["fromId-toId"]
  - options: Object - 可选的配置选项，可以包含 Props 中定义的任何属性

示例：

### addConnection(fromId, toId, curveType)
添加新的连接。

- 参数：
  - fromId: String - 连接起始项目的 id
  - toId: String - 连接终止项目的 id
  - curveType: String - 曲线类型，可选值：'straight'、'slight'、'deep'

示例：

### removeConnection(fromId, toId)
移除指定的连接。

- 参数：
  - fromId: String - 连接起始项目的 id
  - toId: String - 连接终止项目的 id

示例：

### updateConnectionCurve(fromId, toId, newCurveType)
更新指定连接的曲线类型。

- 参数：
  - fromId: String - 连接起始项目的 id
  - toId: String - 连接终止项目的 id
  - newCurveType: String - 新的曲线类型，可选值：'straight'、'slight'、'deep'

示例：

### addBatchConnections(data, options, clearExisting = false)
批量添加连接线。

- 参数：
  - data: Array - 连接关系数组，格式为 ["fromId-toId"]
  - options: Object - 可选的配置选项，可以设置连接线格式
    - lineType: String - 连接线类型，可选值：'solid'（实线）或 'dashed'（虚线）
    - lineColor: String - 连接线颜色
    - lineWidth: Number - 连接线宽度
    - curveType: String - 曲线类型，可选值：'straight'、'slight'、'deep'
  - clearExisting: Boolean - 是否在添加新连接线之前清空现有的连接线，默认为 false

示例：

### removeBatchConnections(data)
批量删除连接线。

- 参数：
  - data: Array - 要删除的连接关系数组，格为 ["fromId-toId"]

示例：

## 功能描述

### 高亮效果

1. 点击效果：
   - 当用户点击左侧或右侧的项目模块时，该模块会高亮显示。
   - 同时，与被点击模块通过连接线相连的所有其他模块也会高亮显示。
   - 连接被高亮模块的所有连接线也会高亮显示。

2. 连接线点击：
   - 当用户点击某个连接线时，该连接线会高亮显示。
   - 连接线两端的模块也会同时高亮显示。

3. 高亮样式：
   - 模块高亮：可以通过改变背景色、边框颜色或添加阴影等方式实现。
   - 连接线高亮：使用 `activeLineColor` 属性定义的颜色。

4. 取消高亮：
   - 点击已高亮的模块或连接线，或点击空白区域可以取消高亮效果。

### 交互行为

1. 模块点击：
   - 触发高亮效果。
   - 可以通过 `item-click` 事件获取被点击的模块信息。

2. 连接线点击：
   - 触发高亮效果。
   - 可以通过 `connection-click` 事件获取被点击的连接线信息。
   - 点击后会显示删除选项。

3. 删除连接线：
   - 当用户选择删除连接线时，该连接线会被移除。
   - 与该连接线相关的所有高亮效果（包括连接的模块和其他相关连接线）都会被取消。
   - 触发 `connection-removed` 事件。
   - 触发 `highlight-change` 事件，反映高亮状态的变化。

4. 高亮状态：
   - 组件内部维护当前高亮状态。
   - 可以通过 `highlight-change` 事件获取高亮状态的变化。
   - 删除连接线后，相关的高亮状态会被更新。

5. 取消高亮：
   - 点击已高亮的模块或连接线，或点击空白区域可以取消高亮效果。
   - 删除高亮的连接线会自动取消相关的高亮效果。

6. 吸附点交互：
   - 只有在 `editable` 为 true 时，吸附点才会显示。
   - 每个可编辑的项目（左侧和右侧）都有一个或多个吸附点。
   - 点击吸附点时，该吸附点会高亮显示。
   - 高亮的吸附点表示连接线的起点。
   - 在移动鼠标创建连接线的过程中：
     - 靠近其他项目的吸附点时，该吸附点会自动高亮。
     - 如果鼠标在高亮的吸附点附近释放，将自动生成连接到该吸附点的连接线。
   - 生成新的连接线后，触发 `connection-added` 事件。

7. 连接线创建：
   - 只有在 `editable` 为 true 时，才能创建新的连接线。
   - 用户可以通过点击一个项目的吸附点，然后拖动到另一个项目的吸附点来创建连接线。
   - 在拖动过程中，显示一条临时的连接线，跟随鼠标移动。
   - 释放鼠标时，如果位于有效的目标吸附点上，则创建永久连接线。
   - 如果释放时不在有效的吸附点上，则取消连接线创建。

8. 吸附点高亮：
   - 只有在 `editable` 为 true 时，吸附点才会有高亮效果。
   - 当鼠标悬停在吸附点上时，该吸附点会有视觉反馈（如颜色变化或尺寸增大）。
   - 在拖动连接线时，靠近的有效目标吸附点会自动高亮，提示用户可以在此处释放以创建连接。

## 新增Props

| 名称 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| attachPointRadius | Number | 5 | 吸附点的半径（单位：像素）。只在 editable 为 true 时有效。 |
| attachPointColor | String | '#007bff' | 吸附点的颜色。只在 editable 为 true 时有效。 |
| attachPointActiveColor | String | '#ff0000' | 吸附点激活时的颜色。只在 editable 为 true 时有效。 |

## 新增事件

| 名称 | 参数 | 描述 |
|------|------|------|
| attach-point-click | { id, type: 'left' \| 'right', pointIndex: Number } | 当吸附点被点击时触发 |
| connection-start | { id, type: 'left' \| 'right', pointIndex: Number } | 当开始创建新连接时触发 |
| connection-end | { from: { id, type, pointIndex }, to: { id, type, pointIndex } } | 当成功创建新连接时触发 |
| connection-cancel | void | 当取消连接创建时触发 |

## 新增方法

| 名称 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| getAttachPoints | (id: String, type: 'left' \| 'right') | Array<{x: Number, y: Number}> | 获取指定项目的所有吸附点坐标。只在 editable 为 true 时返回有效值，否则返回空数组。 |
| highlightAttachPoint | (id: String, type: 'left' \| 'right', pointIndex: Number) | void | 高亮指定的吸附点。只在 editable 为 true 时有效。 |
