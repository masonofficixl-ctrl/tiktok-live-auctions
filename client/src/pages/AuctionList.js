import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/AuctionList.css';

function AuctionList({ socket }) {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('/api/auctions');
      setAuctions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading auctions...</div>;

  return (
    <div className="auction-list">
      <h2>Live Auctions</h2>
      <div className="auctions-grid">
        {auctions.map((auction) => (
          <Link key={auction.id} to={`/auction/${auction.id}`} className="auction-card">
            <div className="auction-header">
              <h3>{auction.title}</h3>
              <span className="status">{auction.status}</span>
            </div>
            <p>{auction.description}</p>
            <div className="auction-footer">
              <div className="price">${auction.start_price}</div>
              <div className="time">Ends: {new Date(auction.end_time).toLocaleTimeString()}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AuctionList;
