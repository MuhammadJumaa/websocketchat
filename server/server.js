const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8081;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('WebSocket server is running');
});

// Create a WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

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
});
