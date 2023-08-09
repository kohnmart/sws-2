// websocket.ts
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';
import { CanvasEvent, CanvasEventType } from '../../canvas/client/types.js';

const startWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  const channels: IChannels = {};

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      const msg = message.toString();
      console.log('Received message:', msg);

      try {
        const request = JSON.parse(message.toString());

        switch (request.command) {
          case WsEvents.REGISTER_FOR_CANVAS:
            // Generate UUID
            const clientId = uuidv4();

            // Initialize channels[request.canvasId] if not already
            if (!channels[request.canvasId]) {
              channels[request.canvasId] = {
                clientData: [],
                eventStream: [],
              };
            }

            // Register the websocket client for the canvas
            channels[request.canvasId].clientData.push({
              clientId,
              ws,
            });

            // Return current state of canvas
            const response = {
              type: 'registration',
              clientId: clientId,
              canvasId: request.canvasId,
              eventStream: channels[request.canvasId].eventStream,
            };

            ws.send(JSON.stringify(response));
            break;

          case WsEvents.UNREGISTER_FOR_CANVAS:
            if (channels[request.canvasId]) {
              // Filter client and remove from channel
              channels[request.canvasId].clientData = channels[
                request.canvasId
              ].clientData.filter((channel: IWSClient) => channel.ws !== ws);

              const response = {
                type: 'unregister',
              };

              ws.send(JSON.stringify(response));
            }
            break;

          case CanvasEventType.ADD_SHAPE:
          case CanvasEventType.REMOVE_SHAPE_WITH_ID:
          case WsEvents.SELECT_SHAPE:
          case WsEvents.UNSELECT_SHAPE:
            broadcastToCanvas(request.canvasId, request, request.clientId);
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast changes to all connected clients for a specific canvas
  function broadcastToCanvas(
    canvasId: string,
    event: CanvasEvent,
    currentClientId: string
  ) {
    if (channels[canvasId]) {
      // add to eventStream
      channels[canvasId].eventStream.push(event);
      // broadcast to all clients excluding acting client
      channels[canvasId].clientData.forEach((client) => {
        if (client.clientId !== currentClientId) {
          client.ws.send(JSON.stringify(event));
        }
      });
    }
  }
};

enum WsEvents {
  REGISTER_FOR_CANVAS = 'registerForCanvas',
  UNREGISTER_FOR_CANVAS = 'unregisterForCanvas',
  SELECT_SHAPE = 'selectShape',
  UNSELECT_SHAPE = 'unselectShape',
}

interface IChannels {
  [canvasId: string]: {
    clientData: IWSClient[];
    eventStream: CanvasEvent[];
  };
}

interface IWSClient {
  clientId: string;
  ws: WebSocket;
}

export default startWebSocketServer;
