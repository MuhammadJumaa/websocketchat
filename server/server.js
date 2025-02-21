const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8081;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

// Create an HTTP server
const server = http.createServer((req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.writeHead(200);
  res.end('WebSocket server is running');
});

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ 
  server,
  verifyClient: ({ origin }) => {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') return true;
    
    // In production, check against allowed origins
    return ALLOWED_ORIGINS.includes(origin);
  }
});

// Store all connected clients
const clients = new Set();

wss.on("connection", (ws) => {
  // Add new client to the set
  clients.add(ws);
  console.log(`Client connected. Total clients: ${clients.size}`);

  ws.on("message", (message) => {
    const messageStr = message.toString();
    console.log("Received:", messageStr);
    
    // Broadcast the message to all connected clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  });

  ws.on("close", () => {
    // Remove client from the set when they disconnect
    clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clients.delete(ws);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
  console.log('Allowed origins:', ALLOWED_ORIGINS);
});
