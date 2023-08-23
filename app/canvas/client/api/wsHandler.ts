// Use the UUID in your WebSocket connection
import { loadStream } from '../canvas/init/canvasInit.js';
import { handleURLLocation } from '../canvas/pages/router/router.js';
import { ECanvasEventType, IResponse } from '../types/eventStream.js';
import { EClient, EServices, EWebsocketEvents } from '../types/services.js';

const wsInstance = (uuid: string) => {
  return new WebSocket(`ws://localhost:3000/canvas/${uuid}`);
};

const wsConnection = (ws: WebSocket, uuid: string) => {
  // When the WebSocket connection is established, receive the client ID from the server
  ws.onopen = () => {
    console.log('WebSocket connection established');

    const requestForRegistration = {
      command: EWebsocketEvents.REGISTER_FOR_CANVAS,
      canvasId: uuid,
    };
    ws.send(JSON.stringify(requestForRegistration));
  };

  ws.onmessage = (event) => {
    const response: IResponse = JSON.parse(event.data);

    /* DEBUG INCOMING MESSAGES */

    //console.log('Incoming...');
    //console.log(response);

    switch (response.type) {
      case EServices.REGISTRATION:
        const clientId = response.clientId;
        localStorage.setItem(EClient.CLIENT_ID, clientId);
        localStorage.setItem(EClient.RAND_COLOR, response.markedColor);
        try {
          loadStream(response.eventStream);
        } catch {
          console.log(
            'Cant load stream. Either error or this client (host) has closed canvas object from overview page.'
          );
        }
        break;

      case EServices.UNREGISTER:
        ws.close();
        break;

      case EServices.HOST_DISCONNECT:
        // "Redirecting" all clients to overview page
        const newURL = `/`;
        history.pushState({}, '', newURL);
        handleURLLocation();
        break;

      case ECanvasEventType.SELECT_SHAPE:
      case ECanvasEventType.UNSELECT_SHAPE:
      case ECanvasEventType.ADD_SHAPE:
      case ECanvasEventType.REMOVE_SHAPE_WITH_ID:
      case ECanvasEventType.UPDATE_SHAPES_ORDER:
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
