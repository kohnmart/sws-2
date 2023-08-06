import express from 'express';
import http from 'http';
import cors from 'cors';
import startWebSocketServer from './websocket.js'; // Import the WebSocket server module

/* ROUTER */
import indexRouter from './router/index.js';
import canvasRouter from './router/canvas.js';
import { createDatabaseQuery } from './db/setup.js';

const app = express();

/* APP USE */
app.use(express.json());
app.use(cors());
app.use(express.static('./canvas'));
app.use('/api', indexRouter);
app.use('/api/canvas', canvasRouter);
const server = http.createServer(app);

startWebSocketServer(server);

// Define a route for the index page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'app/canvas' });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/* INIT DATABASE */
await createDatabaseQuery();
