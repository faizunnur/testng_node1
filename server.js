require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { pool, testConnection } = require('./db');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'testng_node1',
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to testng_node1 API' });
});

// Example database query route
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ data: result.rows });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database query failed', details: err.message });
  }
});

// Serve React frontend static files
const clientBuildPath = path.join(__dirname, 'client', 'build');
app.use(express.static(clientBuildPath));

// Catch-all route to serve React app for any non-API routes
app.get('*', (req, res) => {
  const indexFile = path.join(clientBuildPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).json({ message: 'testng_node1 is running. React build not found.' });
    }
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Health check available at http://${HOST}:${PORT}/health`);
});

module.exports = app;