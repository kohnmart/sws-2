// Use the UUID in your WebSocket connection
import { clearShapesSelection, loadStream } from '../canvas/init/canvasInit.js';
import { CanvasEventType, Services } from '../types/types.js';
const wsInstance = (uuid) => {
    return new WebSocket(`ws://localhost:3000/canvas/${uuid}`);
};
const wsConnection = (ws, uuid) => {
    // When the WebSocket connection is established, receive the client ID from the server
    ws.onopen = () => {
        console.log('WebSocket connection established');
        const requestForRegistration = {
            command: 'registerForCanvas',
            canvasId: uuid,
        };
        ws.send(JSON.stringify(requestForRegistration));
    };
    ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        console.log('Incoming...');
        console.log(response);
        switch (response.type) {
            case Services.REGISTRATION:
                const clientId = response.clientId;
                localStorage.setItem('clientId', clientId);
                localStorage.setItem('randColor', response.markedColor);
                try {
                    loadStream(response.eventStream);
                }
                catch {
                    console.log('Cant load stream. Either error or this client (host) has closed canvas object from outside.');
                }
                break;
            case Services.UNREGISTER:
                // clear selected shapes before disconnecting
                clearShapesSelection();
                ws.close();
                break;
            case Services.HOST_DISCONNECT:
                // "Redirecting" to overview page
                if (document.getElementById('canvas-container')) {
                    document.getElementById('canvas-container').style.display = 'none';
                }
                document.getElementById('index-container').style.display = 'block';
                document.getElementById(response.canvasId).remove();
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
        //document.getElementById('canvas-container').style.display = 'none';
        //document.getElementById('index-container').style.display = 'block';
        console.log('WebSocket connection closed');
    };
};
export default { wsInstance, wsConnection };
export { wsInstance, wsConnection };
