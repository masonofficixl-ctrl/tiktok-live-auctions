const express = require('express');
const router = express.Router();
const { pool } = require('../index');

// Create auction
router.post('/', async (req, res) => {
  const { title, description, startPrice, endTime, tiktokLiveUrl } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO auctions (title, description, start_price, end_time, tiktok_live_url, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, startPrice, endTime, tiktokLiveUrl, 'active']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM auctions WHERE status = \'active\' ORDER BY end_time ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auction by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM auctions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update auction
router.put('/:id', async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE auctions SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *',
      [title, description, status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
