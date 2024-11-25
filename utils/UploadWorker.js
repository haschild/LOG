// utils/UploadWorker.js
class ChunkUploader {
  constructor(file, chunkSize) {
    this.file = file;
    this.chunkSize = chunkSize;
    this.chunks = Math.ceil(file.size / chunkSize);
    this.currentChunk = 0;
  }

  async uploadChunk(chunk, chunkIndex) {
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", this.chunks);

    const response = await fetch("/api/upload/chunk", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Chunk upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async start() {
    try {
      while (this.currentChunk < this.chunks) {
        const start = this.currentChunk * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        const chunk = this.file.slice(start, end);

        await this.uploadChunk(chunk, this.currentChunk);

        this.currentChunk++;
        const progress = Math.round((this.currentChunk / this.chunks) * 100);

        self.postMessage({
          type: "PROGRESS",
          data: { progress },
        });
      }

      // 完成上传
      self.postMessage({ type: "COMPLETE" });
    } catch (error) {
      self.postMessage({
        type: "ERROR",
        data: { error: error.message },
      });
    }
  }
}

// 监听主线程消息
self.onmessage = async (e) => {
  const { type, task } = e.data;

  if (type === "START") {
    const uploader = new ChunkUploader(task.file, task.chunkSize);
    await uploader.start();
  }
};
