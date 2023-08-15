import { CanvasEvent, CanvasEventType } from '../../types/types.js';
import { EventDispatcher } from './Event.js';

export class ToolEventSubscription {
  constructor(eventDispatcher: EventDispatcher) {
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
