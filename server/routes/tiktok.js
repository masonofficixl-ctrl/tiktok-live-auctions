const express = require('express');
const router = express.Router();
const axios = require('axios');

const TIKTOK_API_BASE = 'https://open.tiktokapis.com';

// Connect TikTok Live
router.post('/connect', async (req, res) => {
  const { accessToken, liveId } = req.body;
  try {
    const response = await axios.get(`${TIKTOK_API_BASE}/v1/live/${liveId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to TikTok Live' });
  }
});

// Get live comments
router.get('/comments/:liveId', async (req, res) => {
  const { accessToken } = req.query;
  try {
    const response = await axios.get(
      `${TIKTOK_API_BASE}/v1/live/${req.params.liveId}/comments`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Get live gift events
router.get('/gifts/:liveId', async (req, res) => {
  const { accessToken } = req.query;
  try {
    const response = await axios.get(
      `${TIKTOK_API_BASE}/v1/live/${req.params.liveId}/events`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gift events' });
  }
});

module.exports = router;
