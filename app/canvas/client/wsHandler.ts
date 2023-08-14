// Use the UUID in your WebSocket connection
import { loadStream } from './init.js';
import { CanvasEventType, IResponse, Services } from './types.js';

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
    const response: IResponse = JSON.parse(event.data);
    console.log('Incoming...');
    console.log(response);

    switch (response.type) {
      case Services.REGISTRATION:
        const clientId = response.clientId;
        localStorage.setItem('clientId', clientId);
        localStorage.setItem('randColor', response.markedColor);
        loadStream(response.eventStream);
        break;

      case Services.UNREGISTER:
        ws.close();
        break;

      case CanvasEventType.SELECT_SHAPE:
      case CanvasEventType.UNSELECT_SHAPE:
      case CanvasEventType.ADD_SHAPE:
      case CanvasEventType.REMOVE_SHAPE_WITH_ID:
      case CanvasEventType.UPDATE_SHAPES_ORDER:
        loadStream(response.eventStream);
        break;
      default:
        break;
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export default { wsInstance, wsConnection };
export { wsInstance, wsConnection };
