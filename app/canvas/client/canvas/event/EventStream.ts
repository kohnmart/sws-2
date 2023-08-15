import { getCanvasId, wsSend } from '../pages/index.js';
import { CanvasEvent } from '../../types/types.js';
export class EventStream {
  private events: CanvasEvent[] = [];

  addEvent(event: CanvasEvent) {
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
