import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import AuctionList from './pages/AuctionList';
import AuctionDetail from './pages/AuctionDetail';
import Dashboard from './pages/Dashboard';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for logged in user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>🎯 TikTok Live Auctions</h1>
          <nav>
            <a href="/">Home</a>
            <a href="/dashboard">Dashboard</a>
            {user ? (
              <span>{user.username}</span>
            ) : (
              <a href="/login">Login</a>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<AuctionList socket={socket} />} />
          <Route path="/auction/:id" element={<AuctionDetail socket={socket} user={user} />} />
          <Route path="/dashboard" element={<Dashboard socket={socket} user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
