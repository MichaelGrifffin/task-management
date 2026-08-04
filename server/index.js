const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const { initWebSocket } = require('./websocket');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Task Management API is running', timestamp: new Date().toISOString() });
});

// Serve static frontend build files for Render deployment
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Frontend build not found. Please build the client first.');
    }
  });
});

// Create HTTP & WebSocket server
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Task Management Server listening on port ${PORT}`);
  console.log(`🔌 WebSocket service active on port ${PORT}`);
});
