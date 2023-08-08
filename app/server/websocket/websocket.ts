// websocket.ts
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';

const startWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  const channels = [];
  const eventStream = [];
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected');

    // Assign a unique ID to the client and send it back
    const clientId = uuidv4();
    //ws.send(JSON.stringify({ type: 'clientId', clientId }));

    ws.on('message', (message) => {
      const msg = message.toString();
      console.log('Received message:', msg);

      try {
        const request = JSON.parse(message.toString());

        switch (request.command) {
          case WsEvents.registerForCanvas:
            // init channels/eventstream array
            channels[request.canvasId] = channels[request.canvasId] || [];
            eventStream[request.canvasId] = eventStream[request.canvasId] || [];

            // register the websocket client for the canvas
            channels[request.canvasId].push(ws);

            // return current state of canvas
            const response = {
              clientId: clientId,
              canvasId: request.canvasId,
              eventStream: eventStream,
            };

            ws.send(JSON.stringify(response));
            break;

          case WsEvents.unregisterForCanvas:
            if (channels[request.canvasId]) {
              // filter client and remove from channel
              channels[request.canvasId] = channels[request.canvasId].filter(
                (client: WebSocket) => client !== ws
              );
            }
            break;

          case WsEvents.addShape:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.removeShapeWithId:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.selectShape:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.unselectShape:
            broadcastToCanvas(request.canvasId, request);
            break;
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
          (client: WebSocket) => client !== ws
        );
      }
    });
  });

  // Broadcast changes to all connected clients for a specific canvas
  function broadcastToCanvas(canvasId: string, event: string) {
    if (channels[canvasId]) {
      channels[canvasId].forEach((client: WebSocket) => {
        eventStream[channels[canvasId]].push(event);
        client.send(JSON.stringify(event));
      });
    }
  }
};

enum WsEvents {
  registerForCanvas = 'registerForCanvas',
  unregisterForCanvas = 'unregisterForCanvas',
  addShape = 'addShape',
  removeShapeWithId = 'removeShapeWithId',
  selectShape = 'selectShape',
  unselectShape = 'unselectShape',
}

export default startWebSocketServer;
