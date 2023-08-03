import express from 'express';
import http from 'http';
import cors from 'cors';
import startWebSocketServer from './websocket.js'; // Import the WebSocket server module
/* ROUTER */
import indexRouter from './router/overview.js';
const app = express();
app.use(cors());
app.use(express.static('./public'));
app.use(indexRouter);
const server = http.createServer(app);
startWebSocketServer(server);
app.get('/canvas/:id?', function (req, res) {
    res.sendFile('canvas.html', { root: 'public' });
});
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map