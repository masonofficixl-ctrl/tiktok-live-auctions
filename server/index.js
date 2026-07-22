const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/auctions'
});

// Routes
const auctionRoutes = require('./routes/auctions');
const tiktokRoutes = require('./routes/tiktok');
const biddingRoutes = require('./routes/bidding');

app.use('/api/auctions', auctionRoutes);
app.use('/api/tiktok', tiktokRoutes);
app.use('/api/bidding', biddingRoutes);

// Socket.io events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join-auction', (auctionId) => {
    socket.join(`auction-${auctionId}`);
    socket.emit('auction-joined', { auctionId });
  });

  socket.on('place-bid', (data) => {
    io.to(`auction-${data.auctionId}`).emit('bid-placed', {
      userId: data.userId,
      amount: data.amount,
      timestamp: new Date()
    });
  });

  socket.on('send-chat', (data) => {
    io.to(`auction-${data.auctionId}`).emit('chat-message', {
      userId: data.userId,
      username: data.username,
      message: data.message,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io, pool };
