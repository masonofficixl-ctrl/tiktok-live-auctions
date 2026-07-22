const express = require('express');
const router = express.Router();
const { pool, io } = require('../index');

// Place a bid
router.post('/place-bid', async (req, res) => {
  const { auctionId, userId, amount } = req.body;
  try {
    // Check if bid is valid
    const auction = await pool.query('SELECT * FROM auctions WHERE id = $1', [auctionId]);
    if (auction.rows.length === 0) {
      return res.status(404).json({ error: 'Auction not found' });
    }

    const currentBid = await pool.query(
      'SELECT MAX(amount) as max_bid FROM bids WHERE auction_id = $1',
      [auctionId]
    );

    const maxBid = currentBid.rows[0].max_bid || auction.rows[0].start_price;

    if (amount <= maxBid) {
      return res.status(400).json({ error: 'Bid must be higher than current bid' });
    }

    // Insert bid
    const result = await pool.query(
      'INSERT INTO bids (auction_id, user_id, amount) VALUES ($1, $2, $3) RETURNING *',
      [auctionId, userId, amount]
    );

    // Broadcast bid to all users in auction
    io.to(`auction-${auctionId}`).emit('bid-update', {
      userId,
      amount,
      timestamp: new Date()
    });

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bids for auction
router.get('/auction/:auctionId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM bids WHERE auction_id = $1 ORDER BY amount DESC',
      [req.params.auctionId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
