import express from 'express';
import cors from 'cors';
import downloadRoute from './routes/download.js';
import uploadRoute from './routes/upload.js';

const app = express();

// CORS options to allow only localhost
const corsOptions = {
  origin: 'http://localhost:8008/',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});


app.use("/api/downlaod", (req, res) => {
  res.send("this is downloads")
})
app.use("/api", uploadRoute)