<template>
  <div class="tree-node">
    <div class="node-label">
      <span @click="toggle" class="toggle-btn">
        <template v-if="hasChildren">
          <span v-if="isOpen">-</span>
          <span v-else>+</span>
        </template>
      </span>
      <input type="checkbox" />
      {{ node.label }}
      <span v-if="!hasChildren" class="actions">
        <button @click="addNode">+</button>
        <button @click="removeNode">🗑️</button>
      </span>
    </div>
    <div v-if="isOpen" class="children">
      <TreeNode
        v-for="(child, index) in node.children"
        :key="index"
        :node="child"
        @remove="removeChild(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    node: Object,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0;
    },
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    },
    addNode() {
      if (!this.node.children) {
        this.$set(this.node, "children", []);
      }
      this.node.children.push({ label: "New node" });
    },
    removeNode() {
      this.$emit("remove");
    },
    removeChild(index) {
      this.node.children.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.tree-node {
  position: relative;
  margin-left: 20px;
}

.node-label {
  display: flex;
  align-items: center;
}

.toggle-btn {
  cursor: pointer;
  margin-right: 5px;
}

.actions {
  margin-left: auto;
}

.children {
  margin-left: 20px;
  position: relative;
}

.children::before {
  content: "";
  position: absolute;
  top: 0;
  left: -10px;
  bottom: 0;
  border-left: 1px dashed red;
}

.tree-node::before {
  content: "";
  position: absolute;
  top: 0;
  left: -20px;
  width: 10px;
  height: 1em;
  border-bottom: 1px dashed red;
}
</style>
