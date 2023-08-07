import express from 'express';
import http from 'http';
import cors from 'cors';
import startWebSocketServer from './websocket.js'; // Import the WebSocket server module
import indexRouter from './router/index.js';
import canvasRouter from './router/canvas.js';
import { createDatabaseQuery } from './db/setup.js';

const app = express();

/* APP USE */
app.use(express.json());
app.use(cors());

// Serve static files from the "canvas" directory
app.use('/api', indexRouter);
app.use('/canvas', canvasRouter);
app.use('/canvas', express.static('app/canvas'));

// Define a route for the index page
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'app/canvas' });
});

const server = http.createServer(app);

// Start the WebSocket server
startWebSocketServer(server);

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

/* INIT DATABASE */
await createDatabaseQuery();
