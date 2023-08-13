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
export class CanvasEventSubscription {
    canvas;
    constructor(canvas, eventDispatcher) {
        this.canvas = canvas;
        eventDispatcher.subscribe((event) => {
            switch (event.type) {
                case CanvasEventType.ADD_SHAPE:
                    this.handleAddShape(event.data.shape, event.data.redraw);
                    break;
                case CanvasEventType.REMOVE_SHAPE:
                    this.handleRemoveShape(event.data.id, event.data.redraw);
                    break;
                case CanvasEventType.REMOVE_SHAPE_WITH_ID:
                    this.handleRemoveShapeWithId(event.data.id, event.data.redraw);
                    break;
                case CanvasEventType.UPDATE_SHAPE:
                    this.handleUpdateShape(event.data.shape);
                    break;
                case CanvasEventType.UPDATE_SHAPES_ORDER:
                    this.handleUpdateShapesOrder(event.data.id, event.data.moveUp);
                    break;
                case CanvasEventType.CHANGE_COLOR:
                    this.handleColorChange(event);
                    break;
                default:
                    break;
            }
        });
    }
    handleColorChange(event) {
        const shapeId = event.data.id;
        const colorType = event.data.colorType;
        const newColor = event.data.newColor;
        const shape = this.canvas.getShapeById(shapeId);
        if (shape) {
            if (colorType === 'backgroundColor') {
                shape.backgroundColor = newColor;
            }
            else {
                shape.strokeColor = newColor;
            }
            return this.canvas.draw();
        }
        return;
    }
    handleAddShape(shape, redraw = true) {
        const shapes = this.canvas.getShapes();
        shapes[shape.id] = shape;
        this.canvas.setShapes(shapes);
        return redraw ? this.canvas.draw() : this.canvas;
    }
    handleRemoveShape(id, redraw = true) {
        const shapes = this.canvas.getShapes();
        delete shapes[id];
        this.canvas.setShapes(shapes);
        return redraw ? this.canvas.draw() : this.canvas;
    }
    handleRemoveShapeWithId(id, redraw = true) {
        const shapes = this.canvas.getShapes();
        for (const key in shapes) {
            if (shapes[key].id === id) {
                delete shapes[key];
            }
        }
        return redraw ? this.canvas.draw() : this.canvas;
    }
    handleGetShapeById(id) {
        const shapes = this.canvas.getShapes();
        for (const key in shapes) {
            if (shapes[key].id === id) {
                return shapes[key];
            }
        }
    }
    handleUpdateShape(shape) {
        const shapes = this.canvas.getShapes();
        for (const key in shapes) {
            if (shapes[key].id === shape.id) {
                shapes[key] = shape;
            }
        }
        this.canvas.draw();
    }
    handleUpdateShapesOrder(shapeId, moveUp) {
        const shapes = this.canvas.getShapes();
        const shapeKeys = Object.keys(shapes);
        const shapeIndex = shapeKeys.findIndex((key) => shapes[key].id === shapeId);
        if (moveUp && shapeIndex > 0) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const previousShapeKey = shapeKeys[shapeIndex - 1];
            // Swap the positions within the shapes object
            [shapes[currentShapeKey], shapes[previousShapeKey]] = [
                shapes[previousShapeKey],
                shapes[currentShapeKey],
            ];
        }
        else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const nextShapeKey = shapeKeys[shapeIndex + 1];
            // Swap the positions within the shapes object
            [shapes[currentShapeKey], shapes[nextShapeKey]] = [
                shapes[nextShapeKey],
                shapes[currentShapeKey],
            ];
        }
        this.canvas.draw();
    }
}
