import { getCanvasId, wsSend } from './index.js';
import { CanvasEvent, CanvasEventType, Shape } from './types.js';

export class CanvasEventManager {
  type: CanvasEventType;
  data?: { shape: Shape; redraw: boolean; moveUp: boolean };
  timestamp: number;
  isTemporary: boolean;

  constructor(type: CanvasEventType, data?: any) {
    this.type = type;
    this.data = data;
    this.timestamp = Date.now();
  }
}

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

export class CanvasEventDispatcher {
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

export class ToolEventDispatcher {
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

export class ToolEventSubscription {
  constructor(eventDispatcher: ToolEventDispatcher) {
    // Subscribe to the canvas event dispatcher
    eventDispatcher.subscribe((event: CanvasEvent) => {
      switch (event.type) {
        case CanvasEventType.TOOL_ACTION:
          const shape = event.data;
          shape.method.call(shape.tool, shape.x, shape.y);
          break;
        default:
          break;
      }
    });
  }
}
