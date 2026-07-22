const express = require('express');
const router = express.Router();
const axios = require('axios');

const JOKE_API = 'https://v2.jokeapi.dev';

// Get random joke
router.get('/random', async (req, res) => {
  try {
    const type = req.query.type || 'any';
    const response = await axios.get(`${JOKE_API}/joke/${type}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

// Get joke categories
router.get('/categories', async (req, res) => {
  try {
    const response = await axios.get(`${JOKE_API}/categories`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get joke by category
router.get('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(`${JOKE_API}/joke/${category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch joke' });
  }
});

module.exports = router;
