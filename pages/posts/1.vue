<template>
  <div>
    {{ id }}
    <el-button type="primary" class="bg-red-500 hover:bg-sky-700">
      Save changes
    </el-button>

    <button class="bg-sky-500 hover:bg-sky-700">Save changes</button>

    <el-card>sdfsdf</el-card>

    <ClientOnly> </ClientOnly>

    <LazyElButton type="warning">lazy button</LazyElButton>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const id = ref(route.params.id);
// 当访问/posts/1时，route.params.id将为1
console.log(route.params.id);

// 判断是服务端还是客服端
if (import.meta.server) {
  console.log("server");
} else if (import.meta.client) {
  console.log("client");
}
</script>
