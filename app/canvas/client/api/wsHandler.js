// Use the UUID in your WebSocket connection
import { clearShapesSelection, loadStream } from '../canvas/init/canvasInit.js';
import { handleURLLocation } from '../canvas/pages/router/router.js';
import { ECanvasEventType } from '../types/eventStream.js';
import { EClient, EServices, EWebsocketEvents } from '../types/services.js';
const wsInstance = (uuid) => {
    return new WebSocket(`ws://localhost:3000/canvas/${uuid}`);
};
const wsConnection = (ws, uuid) => {
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
        const response = JSON.parse(event.data);
        //console.log('Incoming...');
        //console.log(response);
        switch (response.type) {
            case EServices.REGISTRATION:
                const clientId = response.clientId;
                localStorage.setItem(EClient.CLIENT_ID, clientId);
                localStorage.setItem(EClient.RAND_COLOR, response.markedColor);
                try {
                    loadStream(response.eventStream);
                }
                catch {
                    console.log('Cant load stream. Either error or this client (host) has closed canvas object from outside.');
                }
                break;
            case EServices.UNREGISTER:
                // clear selected shapes before disconnecting
                clearShapesSelection();
                ws.close();
                break;
            case EServices.HOST_DISCONNECT:
                // "Redirecting" to overview page
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
