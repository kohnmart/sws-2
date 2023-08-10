// Use the UUID in your WebSocket connection
import { loadStream } from './init.js';
import { CanvasEventType } from './types.js';

const wsInstance = (id: string) => {
  return new WebSocket(`ws://localhost:3000/canvas/${id}`);
};

const wsConnection = (ws: WebSocket, uuid: string) => {
  // When the WebSocket connection is established, receive the client ID from the server
  ws.onopen = () => {
    console.log('WebSocket connection established');

    // sign up
    const canvasId = uuid;
    const requestForRegistration = {
      command: 'registerForCanvas',
      canvasId: canvasId,
    };
    ws.send(JSON.stringify(requestForRegistration));
  };

  ws.onmessage = (event) => {
    let response = JSON.parse(event.data);
    console.log('Incoming...');
    console.log(response);
    if (response.type === 'registration') {
      const clientId = response.clientId;
      console.log('Received client ID:', clientId);
      // Do something with the client ID, e.g.,
      // use it to identify the client on the canvas page

      localStorage.setItem('clientId', clientId);

      loadStream(response);
    }
    if (response.type === 'unregister') {
      ws.close();
      console.log('Unregister Successful');
    }

    if (response.type === CanvasEventType.ADD_SHAPE) {
      //response.eventStream[0].command = response.type;
      loadStream(response);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export default { wsInstance, wsConnection };
export { wsInstance, wsConnection };
