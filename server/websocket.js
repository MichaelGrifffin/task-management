const WebSocket = require('ws');

let wss = null;

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket server');

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message);
        console.log('Received WebSocket message:', parsed.type);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Send welcome ping
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket real-time sync connected' }));
  });
};

const broadcast = (data) => {
  if (!wss) return;
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
};

module.exports = {
  initWebSocket,
  broadcast
};
