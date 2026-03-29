import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, apiRes] = await Promise.all([
          fetch('/health'),
          fetch('/api/data')
        ]);
        const healthData = await healthRes.json();
        const apiDataResult = await apiRes.json();
        setHealth(healthData);
        setApiData(apiDataResult);
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
        <p>Full-Stack Node.js + React + PostgreSQL Application</p>
      </header>
      <main className="app-main">
        {loading && (
          <div className="card loading">
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="card error">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        )}
        {health && (
          <div className="card">
            <h2>Health Status</h2>
            <div className="status-grid">
              <div className="status-item">
                <span className="label">Status:</span>
                <span className={`value status-${health.status}`}>{health.status}</span>
              </div>
              <div className="status-item">
                <span className="label">Database:</span>
                <span className={`value db-${health.database}`}>{health.database}</span>
              </div>
              <div className="status-item">
                <span className="label">Timestamp:</span>
                <span className="value">{new Date(health.timestamp).toLocaleString()}</span>
              </div>
              <div className="status-item">
                <span className="label">Service:</span>
                <span className="value">{health.service}</span>
              </div>
            </div>
          </div>
        )}
        {apiData && (
          <div className="card">
            <h2>Database Query Result</h2>
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
          </div>
        )}
        <div className="card">
          <h2>Getting Started</h2>
          <ul>
            <li>Edit <code>client/src/App.js</code> to modify the React frontend</li>
            <li>Edit <code>server.js</code> to add new API routes</li>
            <li>Edit <code>db.js</code> to modify database logic</li>
            <li>Set environment variables in <code>.env</code> (see <code>.env.example</code>)</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;