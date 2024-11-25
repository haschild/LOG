<!-- FileUploader.vue -->
<template>
  <div class="uploader">
    <input type="file" multiple @change="handleFileSelect" ref="fileInput" />

    <!-- 上传列表 -->
    <div class="upload-list">
      <div v-for="file in uploadTasks" :key="file.id" class="upload-item">
        <div class="file-info">
          <span>{{ file.name }}</span>
          <span>{{ formatSize(file.size) }}</span>
          <span>{{ file.progress }}%</span>
          <span>{{ file.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { v4 as uuidv4 } from "uuid";

const uploadTasks = ref([]);
const uploadManager = ref(null);

// 初始化上传管理器
onMounted(() => {
  uploadManager.value = new UploadManager();

  // 监听上传进度
  uploadManager.value.onProgress((fileId, progress) => {
    const file = uploadTasks.value.find((f) => f.id === fileId);
    if (file) {
      file.progress = progress;
    }
  });

  // 监听状态变化
  uploadManager.value.onStatusChange((fileId, status) => {
    const file = uploadTasks.value.find((f) => f.id === fileId);
    if (file) {
      file.status = status;
    }
  });
});

onUnmounted(() => {
  uploadManager.value?.destroy();
});

// 文件选择处理
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);

  files.forEach((file) => {
    const task = {
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "pending",
    };
    uploadTasks.value.push(task);
    uploadManager.value.addTask(task);
  });
};

const formatSize = (bytes) => {
  // ... 格式化文件大小的代码
};
</script>
