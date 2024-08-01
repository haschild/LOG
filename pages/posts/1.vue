<template>
    <div>
        {{id}}
        <el-button type="primary" class="bg-red-500 hover:bg-sky-700">
            Save changes
        </el-button>

        <button class="bg-sky-500 hover:bg-sky-700">
            Save changes
        </button>

        <el-card>sdfsdf</el-card>

        <ClientOnly>
    <el-switch v-model="colorMode" inline-prompt active-text="dark" inactive-text="light" size="large"></el-switch>
  </ClientOnly>


        <LazyElButton type="warning">lazy button</LazyElButton>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id  = ref(route.params.id);
// 当访问/posts/1时，route.params.id将为1
console.log(route.params.id)

const color = useColorMode();
const colorMode = computed({
  get: () => color.value === 'dark',
  set: () => (color.preference = (color.value === 'dark' ? 'light' : 'dark')),
});
</script>
