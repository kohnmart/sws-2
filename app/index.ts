import express from 'express';
import http from 'http';
import cors from 'cors';
import startWebSocketServer from './websocket.js'; // Import the WebSocket server module

const app = express();
app.use(cors());
app.use(express.static('./public'));

const server = http.createServer(app);

startWebSocketServer(server);

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/canvas/:id?', function (req, res) {
  res.sendFile('canvas.html', { root: 'public' });
});

app.get('/overview', function (req, res) {
  res.sendFile('overview.html', { root: 'public' });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
