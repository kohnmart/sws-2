import { getCanvasId, wsSend } from '../pages/index.js';
export class EventStream {
    events = [];
    addEvent(event) {
        this.events.push(event);
        const requestEvent = {
            command: event.type,
            canvasId: getCanvasId(),
            clientId: localStorage.getItem('clientId'),
            eventStream: event.data,
        };
        wsSend(JSON.stringify(requestEvent));
    }
}
