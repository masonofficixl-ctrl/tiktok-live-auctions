import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuctionDetail.css';

function AuctionDetail({ socket, user }) {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
    fetchAuction();
    fetchBids();
    
    socket.emit('join-auction', id);

    socket.on('bid-update', (data) => {
      setBids((prevBids) => [data, ...prevBids]);
    });

    socket.on('chat-message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('bid-update');
      socket.off('chat-message');
    };
  }, [id, socket]);

  const fetchAuction = async () => {
    try {
      const response = await axios.get(`/api/auctions/${id}`);
      setAuction(response.data);
    } catch (error) {
      console.error('Error fetching auction:', error);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await axios.get(`/api/bidding/auction/${id}`);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to bid');
      return;
    }
    try {
      await axios.post('/api/bidding/place-bid', {
        auctionId: id,
        userId: user.id,
        amount: parseFloat(bidAmount)
      });
      setBidAmount('');
    } catch (error) {
      alert(error.response?.data?.error || 'Error placing bid');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user) return;
    socket.emit('send-chat', {
      auctionId: id,
      userId: user.id,
      username: user.username,
      message: chatMessage
    });
    setChatMessage('');
  };

  if (!auction) return <div className="loading">Loading auction...</div>;

  return (
    <div className="auction-detail">
      <div className="auction-main">
        <div className="auction-info">
          <h2>{auction.title}</h2>
          <p>{auction.description}</p>
          {auction.tiktok_live_url && (
            <div className="tiktok-embed">
              <iframe src={auction.tiktok_live_url} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
            </div>
          )}
        </div>

        <div className="auction-sidebar">
          <div className="current-bid">
            <h3>Current Bid</h3>
            <div className="bid-amount">${bids.length > 0 ? bids[0].amount : auction.start_price}</div>
          </div>

          <form onSubmit={handlePlaceBid} className="bid-form">
            <input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={bids.length > 0 ? bids[0].amount + 1 : auction.start_price + 1}
              required
            />
            <button type="submit">Place Bid</button>
          </form>

          <div className="bid-history">
            <h4>Recent Bids</h4>
            <ul>
              {bids.slice(0, 5).map((bid, index) => (
                <li key={index}>${bid.amount} - {new Date(bid.created_at).toLocaleTimeString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="auction-chat">
        <h3>Live Chat</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="chat-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default AuctionDetail;
