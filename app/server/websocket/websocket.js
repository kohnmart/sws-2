// websocket.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { CanvasEventType } from '../../canvas/client/types.js';
const startWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });
    const channels = {};
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
                            channels[request.canvasId].clientData = channels[request.canvasId].clientData.filter((channel) => channel.ws !== ws);
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
            }
            catch (error) {
                console.error('Error processing message:', error);
            }
        });
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    });
    // Broadcast changes to all connected clients for a specific canvas
    function broadcastToCanvas(canvasId, event, currentClientId) {
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
var WsEvents;
(function (WsEvents) {
    WsEvents["REGISTER_FOR_CANVAS"] = "registerForCanvas";
    WsEvents["UNREGISTER_FOR_CANVAS"] = "unregisterForCanvas";
    WsEvents["SELECT_SHAPE"] = "selectShape";
    WsEvents["UNSELECT_SHAPE"] = "unselectShape";
})(WsEvents || (WsEvents = {}));
export default startWebSocketServer;
