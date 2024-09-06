<template>
  <div>
    <h2 class="m-4 ">按钮</h2>
    <el-card>
      <el-button type="primary" class="bg-red-500 hover:bg-sky-700">
      Save changes
    </el-button>

    <button class="bg-sky-500 hover:bg-sky-700">Save changes</button>
    <LazyElButton type="warning">lazy button</LazyElButton>
    </el-card>
 <br>
 <br>

 <span>如果pdf不是在项目目录里，是从服务器获取的，那么可以使用URL.createObjectURL创建一个预览url地址，也可以实现嵌入预览pdf</span>
 <section class="flex justify-between gap-4">
  <div class="flex-1">
   <h2 class="m-4">object 预览pdf</h2>
      <el-card>
      <object data="/1_wrapper.pdf" type="application/pdf" width="100%" height="400">
        <p>
          您的浏览器无法显示 PDF，请点击此处下载：
          <a href="1_wrapper.pdf">下载 PDF</a>.
        </p>
      </object>
    </el-card>
  </div>
  
  <div class="flex-1">
    <h2 class="m-4">embed 预览pdf</h2>
    <el-card>
      <embed src="/1_wrapper.pdf" type="application/pdf" width="100%" height="400"></embed>
    </el-card>
  </div>
 </section>
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
