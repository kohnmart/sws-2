import { ICanvasEvent } from '../../types/eventStream.js';

export class EventDispatcher {
  private subscribers: ((event: ICanvasEvent) => void)[] = [];

  subscribe(callback: (event: ICanvasEvent) => void) {
    this.subscribers.push(callback);
  }

  dispatch(event: ICanvasEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}
