// utils/UploadManager.js
export class UploadManager {
  constructor(maxWorkers = 3) {
    this.maxWorkers = maxWorkers;
    this.tasks = new Map();
    this.workers = new Map();
    this.queue = [];
    this.activeWorkers = 0;

    this.progressCallbacks = new Set();
    this.statusCallbacks = new Set();
  }

  addTask(task) {
    this.tasks.set(task.id, task);
    this.queue.push(task.id);
    this.processQueue();
  }

  processQueue() {
    while (this.activeWorkers < this.maxWorkers && this.queue.length > 0) {
      const taskId = this.queue.shift();
      this.startWorker(taskId);
    }
  }

  startWorker(taskId) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    // 创建上传 Worker
    const worker = new Worker(new URL("./UploadWorker.js", import.meta.url));
    this.workers.set(taskId, worker);
    this.activeWorkers++;

    // 配置 Worker
    worker.postMessage({
      type: "START",
      task: {
        id: task.id,
        file: task.file,
        chunkSize: 1024 * 1024, // 1MB chunks
      },
    });

    // 监听 Worker 消息
    worker.onmessage = (e) => {
      const { type, data } = e.data;

      switch (type) {
        case "PROGRESS":
          this.notifyProgress(taskId, data.progress);
          break;
        case "COMPLETE":
          this.completeTask(taskId);
          break;
        case "ERROR":
          this.handleError(taskId, data.error);
          break;
      }
    };
  }

  completeTask(taskId) {
    const worker = this.workers.get(taskId);
    if (worker) {
      worker.terminate();
      this.workers.delete(taskId);
      this.activeWorkers--;
      this.notifyStatus(taskId, "completed");
      this.processQueue();
    }
  }

  handleError(taskId, error) {
    console.error(`Upload error for task ${taskId}:`, error);
    this.notifyStatus(taskId, "error");
    this.completeTask(taskId);
  }

  onProgress(callback) {
    this.progressCallbacks.add(callback);
    return () => this.progressCallbacks.delete(callback);
  }

  onStatusChange(callback) {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  notifyProgress(taskId, progress) {
    this.progressCallbacks.forEach((cb) => cb(taskId, progress));
  }

  notifyStatus(taskId, status) {
    this.statusCallbacks.forEach((cb) => cb(taskId, status));
  }

  destroy() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers.clear();
    this.tasks.clear();
    this.queue = [];
    this.progressCallbacks.clear();
    this.statusCallbacks.clear();
  }
}
