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
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }
  res.status(200).json({
    status: 'ok',
    project: 'testng_node1',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to testng_node1 API' });
});

// Example DB route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({ success: true, time: result.rows[0].current_time });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'testng_node1 server running in development mode. React dev server runs separately.' });
  });
}

// Start server
app.listen(PORT, HOST, async () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  await testConnection();
});

module.exports = app;