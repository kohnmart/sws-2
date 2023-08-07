// websocket.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const startWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  const channels = {};

  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    // Assign a unique ID to the client and send it back
    const clientId = uuidv4();
    ws.send(JSON.stringify({ type: 'clientId', clientId }));

    ws.on('message', (message) => {
      console.log('Received message:', message);

      try {
        const request = JSON.parse(message.toString());

        if (request.command === 'registerForCanvas') {
          const canvasId = request.canvasId;

          // Initialize the events array for the canvas
          channels[canvasId] = channels[canvasId] || [];

          // Register the WebSocket client for the canvas
          channels[canvasId].push(ws);

          const response = {
            canvasId: canvasId,
            eventsForCanvas: [],
          };

          ws.send(JSON.stringify(response));
        } else if (request.command === 'unregisterForCanvas') {
          const canvasId = request.canvasId;

          // Remove the WebSocket client from the canvas
          if (channels[canvasId]) {
            channels[canvasId] = channels[canvasId].filter(
              (client) => client !== ws
            );
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');

      // Remove the WebSocket client from all channels
      for (const canvasId in channels) {
        channels[canvasId] = channels[canvasId].filter(
          (client) => client !== ws
        );
      }
    });
  });

  // Broadcast changes to all connected clients for a specific canvas
  function broadcastToCanvas(canvasId, message) {
    if (channels[canvasId]) {
      channels[canvasId].forEach((client) => {
        client.send(JSON.stringify(message));
      });
    }
  }
};

export default startWebSocketServer;
