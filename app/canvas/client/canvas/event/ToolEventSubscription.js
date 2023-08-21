import { ECanvasEventType } from '../../types/eventStream.js';
export class ToolEventSubscription {
    constructor(eventDispatcher) {
        // Subscribe to the canvas event dispatcher
        eventDispatcher.subscribe((event) => {
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
