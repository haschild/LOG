<template>
  <div>
    <!-- 其他内容 -->
    <AppBezierConnector ref="connector" :data="connectorData">
      <template #left-item="{ item }">
        <div class="custom-left-item">
          <h3>{{ item.name }}</h3>
          <p>ID: {{ item.id }}</p>
        </div>
      </template>
      <template #right-item="{ item }">
        <div class="custom-right-item">
          <h3>{{ item.name }}</h3>
          <p>ID: {{ item.id }}</p>
        </div>
      </template>
    </AppBezierConnector>
  </div>
</template>

<script>
import AppBezierConnector from "@/components/AppBezierConnector.vue";

export default {
  components: {
    AppBezierConnector,
  },
  data() {
    return {
      connectorData: {
        leftItems: [
          { id: "1", name: "Project Alpha" },
          { id: "2", name: "Project Beta" },
        ],
        rightItems: [
          { id: "3", name: "Project Gamma" },
          { id: "4", name: "Project Delta" },
        ],
        connections: [
          { from: "1", to: "3", curve: "straight" },
          { from: "2", to: "4", curve: "slight" },
        ],
      },
    };
  },
  mounted() {
    // Initialize the connector with the provided data
    this.$refs.connector.initialize(this.connectorData, {
      lineType: "solid",
      direction: "both",
      editable: true,
      deletable: true,
    });
  },
};
</script>

<style scoped>
.custom-left-item,
.custom-right-item {
  background-color: #f0f8ff; /* Light blue background */
  border: 1px solid #007bff; /* Blue border */
  border-radius: 8px; /* Rounded corners */
  padding: 10px; /* Padding for spacing */
  margin: 10px; /* Margin for spacing */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.custom-left-item h3,
.custom-right-item h3 {
  margin: 0; /* Remove default margin */
  color: #007bff; /* Blue text color */
}

.custom-left-item p,
.custom-right-item p {
  margin: 5px 0 0; /* Margin for spacing */
  color: #555; /* Darker text color */
}
</style>
