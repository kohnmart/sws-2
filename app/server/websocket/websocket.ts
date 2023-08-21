// websocket.ts
import { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'http';
import { getRandomColor } from '../helper/color.js';
import { EServices, WsEvents } from '../../canvas/client/types/services.js';
import {
  ECanvasEventType,
  ICanvasEvent,
} from '../../canvas/client/types/eventStream.js';

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
              type: EServices.REGISTRATION,
              clientId: clientId,
              canvasId: request.canvasId,
              markedColor: getRandomColor(),
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
                type: EServices.UNREGISTER,
              };

              ws.send(JSON.stringify(response));
            }
            break;

          case ECanvasEventType.ADD_SHAPE:
          case ECanvasEventType.REMOVE_SHAPE_WITH_ID:
          case ECanvasEventType.SELECT_SHAPE:
          case ECanvasEventType.UNSELECT_SHAPE:
          case ECanvasEventType.UPDATE_SHAPES_ORDER:
            broadcastToCanvas(request);
            break;

          case WsEvents.HOST_DISCONNECT:
            if (channels[request.canvasId]) {
              // Iterate through all connected clients for the canvas
              channels[request.canvasId].clientData.forEach((client) => {
                const response = {
                  type: EServices.HOST_DISCONNECT,
                  canvasId: request.canvasId,
                  message: 'All client has been disconnected.',
                };
                client.ws.send(JSON.stringify(response));
                client.ws.close(); // Close each client's WebSocket connection
              });

              // Clear the clientData and eventStream for the canvas
              channels[request.canvasId].clientData = [];
              channels[request.canvasId].eventStream = [];

              // Send a response to the host indicating that clients are disconnected
              const response = {
                type: EServices.HOST_DISCONNECT,
                message: 'All clients have been disconnected.',
              };

              ws.send(JSON.stringify(response));
            }
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
  function broadcastToCanvas(request) {
    if (channels[request.canvasId]) {
      const response = {
        type: request.command,
        clientId: request.clientId,
        canvasId: request.canvasId,
        eventStream: request.eventStream,
      };

      channels[request.canvasId].eventStream.push(response);

      channels[request.canvasId].clientData.forEach((client) => {
        if (client.clientId !== request.clientId) {
          client.ws.send(
            JSON.stringify({ type: response.type, eventStream: [response] })
          );
        }
      });
    }
  }
};

interface IWSClient {
  clientId: string;
  ws: WebSocket;
}

interface IChannels {
  [canvasId: string]: {
    clientData: IWSClient[];
    eventStream: ICanvasEvent[];
  };
}

export default startWebSocketServer;
