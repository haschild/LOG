<template>
  <div class="tree">
    <TreeNode :node="treeData" />

    <tooltip></tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeData: {
        label: "Parent node 1",
        children: [
          {
            label: "Parent node 1-1",
            children: [
              { label: "Leaf node 1-1-1" },
              { label: "Leaf node 1-1-2" },
            ],
          },
          { label: "Leaf node 1-2" },
        ],
      },
    };
  },
};
</script>

<style scoped>
.tree {
  font-family: Arial, sans-serif;
}
</style>
