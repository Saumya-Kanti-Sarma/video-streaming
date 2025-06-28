import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
const app = express();
import fs, { existsSync } from "fs";
import { ChildProcess, exec } from 'child_process';
import { stderr, stdout } from 'process';
// CORS options to allow only localhost
const corsOptions = {
  origin: ['http://localhost:8000', 'http://localhost:5173/'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

// Express middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use((req, res, next) => {
  res.header("Access-Controll-Allow-Origin", "*");
  next();
});

// multer middleware:
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
});
// multer configuration:
const uploads = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.post("/upload", uploads.single("file"), (req, res) => {
  console.log("uplaoding...");
  const lessonId = "1234lennon";
  const videoPath = req.file.path;
  const outputPath = `./uploads/cources/${lessonId}`;
  console.log("video uplaoded to ", outputPath);
  console.log("making hls");

  const hlsPath = `${outputPath}/index.m3u8`;
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true })
  };
  const command = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
    };
    console.log(`exec stdout: ${stdout}`);
    console.log(`exec stderr: ${stderr}`);
    const videoURL = `http://localhost:8000/uploads/cousces/${lessonId}/index.m3u8`;
    return res.json({
      message: "video forwarded to hls",
      videoURL: videoURL,
    })
  })

})
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
