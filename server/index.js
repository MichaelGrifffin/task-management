const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Resolve client dist path reliably across environments
let clientDistPath = path.resolve(__dirname, '../client/dist');
if (!fs.existsSync(clientDistPath)) {
  clientDistPath = path.resolve(process.cwd(), 'client/dist');
}
if (!fs.existsSync(clientDistPath)) {
  clientDistPath = path.resolve(process.cwd(), '../client/dist');
}

console.log(`📁 Serving client dist from: ${clientDistPath} (Exists: ${fs.existsSync(clientDistPath)})`);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(500).send('Frontend build files not found. Please ensure client/dist is built.');
});

// Create HTTP & WebSocket server
const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Task Management Server listening on port ${PORT}`);
  console.log(`🔌 WebSocket service active on port ${PORT}`);
});
