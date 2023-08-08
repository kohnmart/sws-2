// websocket.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
const startWebSocketServer = (server) => {
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
                            channels[request.canvasId] = channels[request.canvasId].filter((client) => client !== ws);
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
            }
            catch (error) {
                console.error('Error processing message:', error);
            }
        });
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            // Remove the WebSocket client from all channels
            for (const canvasId in channels) {
                channels[canvasId] = channels[canvasId].filter((client) => client !== ws);
            }
        });
    });
    // Broadcast changes to all connected clients for a specific canvas
    function broadcastToCanvas(canvasId, event) {
        if (channels[canvasId]) {
            channels[canvasId].forEach((client) => {
                eventStream[channels[canvasId]].push(event);
                client.send(JSON.stringify(event));
            });
        }
    }
};
var WsEvents;
(function (WsEvents) {
    WsEvents["REGISTER_FOR_CANVAS"] = "registerForCanvas";
    WsEvents["UNREGISTER_FOR_CANVAS"] = "unregisterForCanvas";
    WsEvents["ADD_SHAPE"] = "addShape";
    WsEvents["REMOVE_SHAPE_WITH_ID"] = "removeShapeWithId";
    WsEvents["SELECT_SHAPE"] = "selectShape";
    WsEvents["UNSELECT_SHAPE"] = "unselectShape";
})(WsEvents || (WsEvents = {}));
export default startWebSocketServer;
