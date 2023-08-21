import { ICanvasEvent, ECanvasEventType } from '../../types/eventStream.js';
import { EventDispatcher } from './Event.js';

export class ToolEventSubscription {
  constructor(eventDispatcher: EventDispatcher) {
    // Subscribe to the canvas event dispatcher
    eventDispatcher.subscribe((event: ICanvasEvent) => {
      switch (event.type) {
        case ECanvasEventType.TOOL_ACTION:
          const shape = event.data;
          shape.method.call(shape.tool, shape.x, shape.y);
          break;
        default:
          break;
      }
    });
  }
}
