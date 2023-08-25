import { getCanvasId, wsSend } from '../pages/index.js';
import { EClient } from '../../types/services.js';
export class EventStream {
    events = [];
    addEvent(event) {
        this.events.push(event);
        const requestEvent = {
            command: event.type,
            canvasId: getCanvasId(),
            clientId: localStorage.getItem(EClient.CLIENT_ID),
            eventStream: event.data,
        };
        wsSend(JSON.stringify(requestEvent));
    }
}
