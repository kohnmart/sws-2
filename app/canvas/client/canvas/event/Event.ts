import { CanvasEvent } from '../../types/types.js';

export class EventDispatcher {
  private subscribers: ((event: CanvasEvent) => void)[] = [];

  subscribe(callback: (event: CanvasEvent) => void) {
    this.subscribers.push(callback);
  }

  dispatch(event: CanvasEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}
