<template>
  <div>
    <h1>贝塞尔曲线连接器示例</h1>
    <AppBezierConnector ref="bezierConnector" />
  </div>
</template>

<script setup>
import AppBezierConnector from "@/components/AppBezierConnector/index.vue";
import { ref, onMounted } from "vue";
const bezierConnector = ref(null);

onMounted(() => {
  const data = {
    data: [
      { name: "选项1", id: 1 },
      { name: "选项2", id: 2 },
      { name: "选项3", id: 3 },
      { name: "选项4", id: 4 },
      { name: "选项5", id: 5 },
      { name: "选项6", id: 6 },
    ],
    links: ["1-6", "2-4", "3-5", "1-4"],
  };

  const options = {
    lineType: "solid",
    direction: "both",
    lineColor: "#007bff",
    lineWidth: 2,
    editable: true,
    deletable: true,
  };

  bezierConnector.value.initialize(data, options);
});
</script>
