import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuctionList from './pages/AuctionList';
import AuctionDetail from './pages/AuctionDetail';
import Dashboard from './pages/Dashboard';
import JokeGenerator from './pages/JokeGenerator';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>🎭 TikTok Live + Jokes</h1>
          <nav>
            <a href="/">Auctions</a>
            <a href="/jokes">Jokes</a>
            <a href="/dashboard">Dashboard</a>
            {user ? (
              <span>{user.username}</span>
            ) : (
              <a href="/login">Login</a>
            )}
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<AuctionList />} />
          <Route path="/auction/:id" element={<AuctionDetail user={user} />} />
          <Route path="/jokes" element={<JokeGenerator />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
