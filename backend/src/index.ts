import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Configure Multer in memory
const upload = multer({ storage: multer.memoryStorage() });

// Image Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Convert buffer to base64 string for Cloudinary
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'threadly-chats'
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_channel', (channelId) => {
    socket.join(channelId);
  });

  socket.on('leave_channel', (channelId) => {
    socket.leave(channelId);
  });

  socket.on('send_message', (data) => {
    socket.to(data.channelId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Threadly server running on port ${PORT}`);
});
