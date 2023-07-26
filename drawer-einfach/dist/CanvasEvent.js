import { CanvasEventType } from './types.js';
export class CanvasEventManager {
    constructor(type, data) {
        this.type = type;
        this.data = data;
        this.timestamp = Date.now();
    }
}
export class EventStream {
    constructor() {
        this.events = [];
    }
    addEvent(event) {
        console.log('EVENT');
        console.log(event);
        this.events.push(event);
    }
    getEvents() {
        return this.events;
    }
}
export class CanvasEventDispatcher {
    constructor() {
        this.subscribers = [];
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    dispatch(event) {
        for (const subscribers of this.subscribers) {
            subscribers(event);
        }
    }
}
export class ToolEventDispatcher {
    constructor() {
        this.subscribers = [];
    }
    subscribe(callback) {
        this.subscribers.push(callback);
    }
    dispatch(event) {
        for (const subscribers of this.subscribers) {
            subscribers(event);
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
                // Weitere Ereignisse für das Tool hier hinzufügen
                default:
                    break;
            }
        });
    }
}
export class CanvasEventSubscription {
    constructor(canvas, eventDispatcher) {
        this.canvas = canvas;
        // Subscribe to the canvas event dispatcher
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
                case CanvasEventType.UPDATE_SHAPE:
                    this.handleUpdateShape(event.data.shape);
                    break;
                case CanvasEventType.UPDATE_SHAPES_ORDER:
                    this.handleUpdateShapesOrder(event.data.shapeId, event.data.moveUp);
                    break;
                default:
                    break;
            }
        });
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
    }
    /** Explanation:
     Use of Map and Object.entries: The this.shapes object is converted into
     a Map using Object.entries, which allows for efficient manipulation of
     key-value pairs. This is beneficial when dealing with a large number of shape objects.
     
     Finding the index of the shape: The shapeIndex is determined by finding the index in
     the shapeKeys array where the shape's ID matches the given shapeId. This index
     is used to determine the current position of the shape in the z-order.
     
     Swapping positions within the Map: If moveUp is true and the shape is
     not already at the top, or if moveUp is false and the shape is not already at
     the bottom, the positions of the current shape and the adjacent shape
     are swapped within the Map using Map.set().
     
     Updating the original shapes object:
     The modified shapesMap is converted back to an object using Object.fromEntries(), and the
     this.shapes object is updated with the new order of shapes.
     
     Redrawing the canvas: Finally, the draw() method is called to redraw the canvas
     with the updated shape order, reflecting the changes made to the z-order.
  
     ~ Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map?retiredLocale=de
     ~ Ref: https://www.digitalocean.com/community/tutorials/understanding-map-and-set-objects-in-javascript
     ~ Ref: https://javascript.info/map-set
     ~ Ref: https://de.wikipedia.org/wiki/Z-Ordnung
     *
     */
    handleUpdateShapesOrder(shapeId, moveUp) {
        const shapes = this.canvas.getShapes();
        const shapesMap = new Map(Object.entries(shapes));
        const shapeKeys = Array.from(shapesMap.keys());
        const shapeIndex = shapeKeys.findIndex((key) => shapesMap.get(key).id === shapeId);
        if (moveUp && shapeIndex > 0) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const previousShapeKey = shapeKeys[shapeIndex - 1];
            // Swap the positions within the Map
            const tempShape = shapesMap.get(currentShapeKey);
            shapesMap.set(currentShapeKey, shapesMap.get(previousShapeKey));
            shapesMap.set(previousShapeKey, tempShape);
        }
        else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const nextShapeKey = shapeKeys[shapeIndex + 1];
            // Swap the positions within the Map
            const tempShape = shapesMap.get(currentShapeKey);
            shapesMap.set(currentShapeKey, shapesMap.get(nextShapeKey));
            shapesMap.set(nextShapeKey, tempShape);
        }
        // Update the original shapes object with the modified order
        const shapesNew = Object.fromEntries(shapesMap);
        this.canvas.setShapes(shapesNew);
        // Redraw to new shape order
        this.canvas.draw();
    }
}
//# sourceMappingURL=CanvasEvent.js.map