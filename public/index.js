import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
const app = express();
app.use(cors());
app.use(express.static('./public'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log('Received message:', message);
        // Handle received message
    });
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
        // Handle client disconnection
    });
});
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: 'public' });
});
app.get('/canvas/', function (req, res) {
    res.sendFile('canvas.html', { root: './public' });
});
app.get('/overview', function (req, res) {
    res.sendFile('overview.html', { root: 'public' });
});
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map