import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [dbTest, setDbTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [healthRes, dbRes] = await Promise.all([
          axios.get('/health'),
          axios.get('/api/db-test')
        ]);
        setHealth(healthRes.data);
        setDbTest(dbRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>testng_node1</h1>
        <p>Node.js + Express + PostgreSQL + React</p>
      </header>

      <main className="app-main">
        {loading && <div className="card loading">Loading...</div>}
        {error && <div className="card error">Error: {error}</div>}

        {health && (
          <div className="card">
            <h2>Health Check</h2>
            <div className="info-grid">
              <span className="label">Status:</span>
              <span className={`value status-${health.status}`}>{health.status}</span>
              <span className="label">Database:</span>
              <span className="value">{health.database}</span>
              <span className="label">Timestamp:</span>
              <span className="value">{new Date(health.timestamp).toLocaleString()}</span>
            </div>
          </div>
        )}

        {dbTest && (
          <div className="card">
            <h2>Database Test</h2>
            <div className="info-grid">
              <span className="label">Connection:</span>
              <span className={`value ${dbTest.success ? 'success' : 'error'}`}>
                {dbTest.success ? 'Success' : 'Failed'}
              </span>
              {dbTest.time && (
                <>
                  <span className="label">Server Time:</span>
                  <span className="value">{new Date(dbTest.time).toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <h2>Project Info</h2>
          <div className="info-grid">
            <span className="label">Project:</span>
            <span className="value">testng_node1</span>
            <span className="label">Backend:</span>
            <span className="value">Node.js + Express</span>
            <span className="label">Database:</span>
            <span className="value">PostgreSQL</span>
            <span className="label">Frontend:</span>
            <span className="value">React</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;