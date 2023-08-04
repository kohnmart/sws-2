// websocket.ts
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
const startWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log('WebSocket client connected');
        // Assign a unique ID to the client and send it back
        const clientId = uuidv4();
        ws.send(JSON.stringify({ type: 'clientId', clientId }));
        ws.on('message', (message) => {
            console.log('Received message:', message);
            // Handle received message
        });
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            // Handle client disconnection
        });
    });
};
export default startWebSocketServer;
