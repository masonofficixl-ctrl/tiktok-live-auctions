const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

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
app.use(express.static('client/build'));

// Joke API
const JOKE_API = 'https://v2.jokeapi.dev';

// Get random joke
app.get('/api/jokes/random', async (req, res) => {
  try {
    const type = req.query.type || 'any';
    const url = `${JOKE_API}/joke/${type}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Get jokes by category
app.get('/api/jokes/categories', async (req, res) => {
  try {
    const response = await axios.get(`${JOKE_API}/categories`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get joke by specific category
app.get('/api/jokes/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(`${JOKE_API}/joke/${category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🎭 Joke Generator API ready`);
});
