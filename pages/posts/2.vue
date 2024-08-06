<template>
    <div>
       id: {{id}}
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id  = ref(route.params.id);
// 当访问/posts/1时，route.params.id将为1
console.log(route.params.id)
</script>
