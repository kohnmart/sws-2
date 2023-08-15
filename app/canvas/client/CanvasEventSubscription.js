import { createShapeCopy } from './canvasHelper.js';
import { CanvasEventType } from './types.js';
export class CanvasEventSubscription {
    canvas;
    eventStream;
    eventDispatcher;
    constructor(canvas, eventDispatcher, evS) {
        this.canvas = canvas;
        this.eventStream = evS;
        this.eventDispatcher = eventDispatcher;
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
    /* DISPATCHER */
    selectShape(shapeId) {
        const canvasEvent = {
            type: CanvasEventType.SELECT_SHAPE,
            data: {
                id: shapeId,
                isBlockedByUserId: localStorage.getItem('clientId'),
                markedColor: localStorage.getItem('randColor'),
            },
        };
        this.eventStream.addEvent(canvasEvent);
    }
    unselectShape(shapeId) {
        const canvasEvent = {
            type: CanvasEventType.UNSELECT_SHAPE,
            data: { id: shapeId, isBlockedByUserId: null },
        };
        this.eventStream.addEvent(canvasEvent);
    }
    addShape(isTemp, shape, redraw = true) {
        const shapeCopy = createShapeCopy(shape);
        Object.assign(shapeCopy, shape);
        const canvasEvent = {
            type: CanvasEventType.ADD_SHAPE,
            data: { shape: shapeCopy, redraw: redraw },
        };
        this.eventDispatcher.dispatch(canvasEvent);
        if (!isTemp) {
            this.eventStream.addEvent(canvasEvent);
        }
    }
    removeShapeWithId(isTemp, id, redraw = true) {
        const canvasEvent = {
            type: CanvasEventType.REMOVE_SHAPE_WITH_ID,
            data: { id: id, redraw: redraw },
        };
        this.eventDispatcher.dispatch(canvasEvent);
        if (!isTemp) {
            this.eventStream.addEvent(canvasEvent);
        }
    }
    updateShapeColor(shape) {
        const canvasEvent = {
            type: CanvasEventType.ADD_SHAPE,
            data: { shape: shape, redraw: true },
        };
        this.eventDispatcher.dispatch(canvasEvent);
        this.eventStream.addEvent(canvasEvent);
    }
    updateShapesOrder(shapeId, moveUp, isReceiving = false) {
        const canvasEvent = {
            type: CanvasEventType.UPDATE_SHAPES_ORDER,
            data: { id: shapeId, moveUp: moveUp },
        };
        this.eventDispatcher.dispatch(canvasEvent);
        if (!isReceiving) {
            this.eventStream.addEvent(canvasEvent);
        }
    }
}
