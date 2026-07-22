import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard({ socket, user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startPrice, setStartPrice] = useState('');
  const [endTime, setEndTime] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auctions', {
        title,
        description,
        startPrice: parseFloat(startPrice),
        endTime,
        tiktokLiveUrl: tiktokUrl
      });
      alert('Auction created successfully!');
      setTitle('');
      setDescription('');
      setStartPrice('');
      setEndTime('');
      setTiktokUrl('');
    } catch (error) {
      alert('Error creating auction');
    }
  };

  if (!user) return <div className="loading">Please login to access dashboard</div>;

  return (
    <div className="dashboard">
      <h2>Create New Auction</h2>
      <form onSubmit={handleCreateAuction} className="auction-form">
        <input
          type="text"
          placeholder="Auction Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="number"
          placeholder="Starting Price"
          value={startPrice}
          onChange={(e) => setStartPrice(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="TikTok Live URL (optional)"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
        />
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
}

export default Dashboard;
