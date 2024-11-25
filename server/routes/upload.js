// server/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/temp/" });

router.post("/upload/chunk", upload.single("file"), async (req, res) => {
  try {
    const { chunkIndex, totalChunks } = req.body;
    const tempPath = req.file.path;
    const finalPath = path.join("uploads", req.file.originalname);

    // 将分片写入最终文件
    await appendChunk(
      tempPath,
      finalPath,
      parseInt(chunkIndex),
      parseInt(totalChunks),
    );

    // 删除临时文件
    fs.unlinkSync(tempPath);

    res.json({ success: true });
  } catch (error) {
    console.error("Chunk upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function appendChunk(tempPath, finalPath, chunkIndex, totalChunks) {
  const data = await fs.promises.readFile(tempPath);

  if (chunkIndex === 0) {
    // 第一个分片，创建新文件
    await fs.promises.writeFile(finalPath, data);
  } else {
    // 追加到现有文件
    await fs.promises.appendFile(finalPath, data);
  }
}

export default router;
