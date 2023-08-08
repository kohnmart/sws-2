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
          case WsEvents.REGISTER_FOR_CANVAS:
            // init channels/eventstream array
            channels[request.canvasId] = channels[request.canvasId] || [];
            eventStream[request.canvasId] = eventStream[request.canvasId] || [];

            // register the websocket client for the canvas
            channels[request.canvasId].push(ws);

            // return current state of canvas
            const response = {
              type: 'registration',
              clientId: clientId,
              canvasId: request.canvasId,
              eventStream: eventStream,
            };

            ws.send(JSON.stringify(response));
            break;

          case WsEvents.UNREGISTER_FOR_CANVAS:
            if (channels[request.canvasId]) {
              // filter client and remove from channel
              channels[request.canvasId] = channels[request.canvasId].filter(
                (client: WebSocket) => client !== ws
              );
            }
            break;

          case WsEvents.ADD_SHAPE:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.REMOVE_SHAPE_WITH_ID:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.SELECT_SHAPE:
            broadcastToCanvas(request.canvasId, request);
            break;

          case WsEvents.UNSELECT_SHAPE:
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
  REGISTER_FOR_CANVAS = 'registerForCanvas',
  UNREGISTER_FOR_CANVAS = 'unregisterForCanvas',
  ADD_SHAPE = 'addShape',
  REMOVE_SHAPE_WITH_ID = 'removeShapeWithId',
  SELECT_SHAPE = 'selectShape',
  UNSELECT_SHAPE = 'unselectShape',
}

export default startWebSocketServer;
