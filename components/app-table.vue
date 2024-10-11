<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>地址</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in tableData" :key="item.id">
          <tr
            :draggable="true"
            @dragstart="onDragStart(index)"
            @dragover.prevent
            @drop="onDrop(index)"
            @dragenter="onDragEnter(index)"
            :class="{ dragging: draggingIndex === index }"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.address }}</td>
          </tr>
          <tr v-if="hoverIndex === index" class="placeholder"></tr>
          <!-- 指示线 -->
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { id: 1, name: "张三", age: 28, address: "北京市" },
        { id: 2, name: "李四", age: 32, address: "上海市" },
        { id: 3, name: "王五", age: 25, address: "广州市" },
      ],
      draggingIndex: null, // 当前拖动的行索引
      hoverIndex: null, // 当前悬停的行索引
    };
  },
  methods: {
    onDragStart(index) {
      this.draggingIndex = index; // 记录开始拖动的行索引
    },
    onDragEnter(index) {
      if (this.draggingIndex !== null && this.draggingIndex !== index) {
        this.hoverIndex = index; // 更新悬停的行索引
      }
    },
    onDrop(index) {
      if (this.draggingIndex !== null) {
        // 交换行的位置
        const draggedItem = this.tableData[this.draggingIndex];
        this.tableData.splice(this.draggingIndex, 1);
        this.tableData.splice(index, 0, draggedItem);
      }
      this.resetDragState(); // 重置拖动状态
    },
    resetDragState() {
      this.draggingIndex = null; // 清除拖动状态
      this.hoverIndex = null; // 清除悬停状态
    },
  },
};
</script>

<style>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

tr.dragging {
  background-color: #f0f0f0; /* 拖动时的背景色 */
}

.placeholder {
  height: 40px; /* 行高 */
  background-color: rgba(0, 0, 255, 0.2); /* 指示线的颜色 */
  border: 1px dashed blue; /* 指示线的样式 */
}
</style>
