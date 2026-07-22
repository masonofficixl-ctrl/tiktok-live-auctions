import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JokeGenerator.css';

function JokeGenerator() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('any');
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCategories();
    loadHistory();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/jokes/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchJoke = async (selectedCategory = 'any') => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/jokes/${selectedCategory}`);
      setJoke(response.data);
      addToHistory(response.data);
    } catch (error) {
      console.error('Error fetching joke:', error);
      setJoke({ error: 'Failed to load joke. Try again!' });
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (jokeData) => {
    setHistory((prev) => [
      { ...jokeData, id: Date.now() },
      ...prev.slice(0, 9)
    ]);
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('jokeHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  };

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('jokeHistory', JSON.stringify(history));
    }
  }, [history]);

  const copyToClipboard = () => {
    if (!joke) return;
    const text = joke.type === 'twopart'
      ? `${joke.setup}\n${joke.delivery}`
      : joke.joke;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
  };

  const handleGetJoke = () => {
    fetchJoke(category);
  };

  const shareJoke = () => {
    if (!joke) return;
    const text = joke.type === 'twopart'
      ? `${joke.setup}\n${joke.delivery}`
      : joke.joke;
    if (navigator.share) {
      navigator.share({
        title: '😂 Check out this joke!',
        text: text
      });
    }
  };

  return (
    <div className="joke-container">
      <div className="joke-header">
        <h1>😂 Joke Generator</h1>
        <p>Get random jokes powered by JokeAPI</p>
      </div>

      <div className="joke-controls">
        <div className="category-select">
          <label htmlFor="category">Category:</label>
          <select id="category" value={category} onChange={handleCategoryChange}>
            <option value="any">Any Category</option>
            <option value="programming">Programming</option>
            <option value="knock-knock">Knock-Knock</option>
            <option value="general">General</option>
          </select>
        </div>
        <button 
          className="btn-get-joke" 
          onClick={handleGetJoke}
          disabled={loading}
        >
          {loading ? 'Loading...' : '🎲 Get Joke'}
        </button>
      </div>

      {joke && (
        <div className="joke-display">
          <div className="joke-content">
            {joke.type === 'twopart' ? (
              <>
                <p className="setup">{joke.setup}</p>
                <p className="delivery">{joke.delivery}</p>
              </>
            ) : (
              <p className="single">{joke.joke}</p>
            )}
          </div>
          <div className="joke-actions">
            <button className="btn-copy" onClick={copyToClipboard}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
            <button className="btn-share" onClick={shareJoke}>
              📤 Share
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="joke-history">
          <h3>📜 Recent Jokes</h3>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <p>
                  {item.type === 'twopart'
                    ? `${item.setup.substring(0, 50)}...`
                    : item.joke.substring(0, 50)}...
                </p>
                <button
                  className="history-btn"
                  onClick={() => setJoke(item)}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default JokeGenerator;
