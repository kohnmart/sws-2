// websocket.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { CanvasEventType, Services, } from '../../canvas/client/types/types.js';
import { getRandomColor } from '../helper/color.js';
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
                            type: Services.REGISTRATION,
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
                            channels[request.canvasId].clientData = channels[request.canvasId].clientData.filter((channel) => channel.ws !== ws);
                            const response = {
                                type: Services.UNREGISTER,
                            };
                            ws.send(JSON.stringify(response));
                        }
                        break;
                    case CanvasEventType.ADD_SHAPE:
                    case CanvasEventType.REMOVE_SHAPE_WITH_ID:
                    case CanvasEventType.SELECT_SHAPE:
                    case CanvasEventType.UNSELECT_SHAPE:
                    case CanvasEventType.UPDATE_SHAPES_ORDER:
                        broadcastToCanvas(request);
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
                    client.ws.send(JSON.stringify({ type: response.type, eventStream: [response] }));
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
