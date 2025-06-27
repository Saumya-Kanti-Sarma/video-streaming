import express from "express";
import multer from "multer";
const router = express.Router();

// Initialize multer
const upload = multer({ dest: 'uploads/' })

router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }
  res.status(200).json({
    message: 'Video uploaded successfully',
    filePath: req.file.path,
    filename: req.file.filename
  });
});

export default router