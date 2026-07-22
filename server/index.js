const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static('client/build'));

// Routes
const jokeRoutes = require('./routes/jokes');
const auctionRoutes = require('./routes/auctions');
const biddingRoutes = require('./routes/bidding');
const tiktokRoutes = require('./routes/tiktok');

app.use('/api/jokes', jokeRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bidding', biddingRoutes);
app.use('/api/tiktok', tiktokRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🎭 Joke Generator API ready`);
  console.log(`🔄 TikTok Auctions ready`);
});

module.exports = { app, server };
