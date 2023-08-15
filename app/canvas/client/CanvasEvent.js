import { getCanvasId, wsSend } from './index.js';
import { CanvasEventType } from './types.js';
export class CanvasEventManager {
    type;
    data;
    timestamp;
    isTemporary;
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.timestamp = Date.now();
    }
}
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
export class CanvasEventDispatcher {
    subscribers = [];
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    dispatch(event) {
        for (const subscriber of this.subscribers) {
            subscriber(event);
        }
    }
}
export class ToolEventDispatcher {
    subscribers = [];
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    dispatch(event) {
        for (const subscriber of this.subscribers) {
            subscriber(event);
        }
    }
}
export class ToolEventSubscription {
    constructor(eventDispatcher) {
        // Subscribe to the canvas event dispatcher
        eventDispatcher.subscribe((event) => {
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
