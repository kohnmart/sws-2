import { CanvasEventType, } from './types.js';
import { CanvasEventDispatcher, CanvasEventSubscription, EventStream, ToolEventDispatcher, ToolEventSubscription, } from './CanvasEvent.js';
import { Line, Rectangle, Circle, Triangle } from './Shapes.js';
export class Canvas {
    ctx;
    shapes = {};
    width;
    height;
    /* EVENTS */
    eventStream = new EventStream();
    eventDispatcher = new CanvasEventDispatcher();
    toolEventDispatcher;
    toolEventSubscription;
    canvasEventSubscription = new CanvasEventSubscription(this, this.eventDispatcher);
    isCreatingShape = false;
    constructor(canvasDomElement, toolarea) {
        const { width, height } = canvasDomElement.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.toolEventDispatcher = new ToolEventDispatcher();
        this.toolEventSubscription = new ToolEventSubscription(this.toolEventDispatcher);
        this.ctx = canvasDomElement.getContext('2d');
        canvasDomElement.addEventListener('mousemove', createMouseHandler('handleMouseMove', toolarea));
        canvasDomElement.addEventListener('mouseup', createMouseHandler('handleMouseUp', toolarea));
        canvasDomElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                if (event.altKey) {
                    /* Execute Selector-Alt-Event */
                    createMouseHandler('handleAlt', toolarea).call(this, event);
                }
                else if (event.ctrlKey) {
                    /* Execute Selector-CRTL-Event */
                    createMouseHandler('handleCtrl', toolarea).call(this, event);
                }
                else {
                    /* Execute for all types */
                    this.isCreatingShape = true; // Formerstellung beginnt bei Mousedown
                    createMouseHandler('handleMouseDown', toolarea).call(this, event);
                }
            }
        });
        canvasDomElement.addEventListener('contextmenu', (event) => {
            if (event.button === 2) {
                event.preventDefault();
                createMouseHandler('handleRightClick', toolarea).call(this, event);
            }
        });
        const self = this;
        function createMouseHandler(methodName, toolarea) {
            return function (e) {
                e = e || window.event;
                if ('object' === typeof e) {
                    const btnCode = e.button, x = e.pageX - this.offsetLeft, y = e.pageY - this.offsetTop, tool = toolarea.getSelectedTool();
                    if (tool && self.isCreatingShape) {
                        // Form nur erstellen, wenn isCreatingShape true ist
                        const m = tool[methodName];
                        const toolEvent = {
                            type: CanvasEventType.TOOL_ACTION,
                            data: { tool: tool, method: m, x: x, y: y },
                        };
                        self.toolEventDispatcher.dispatch(toolEvent);
                    }
                }
            }.bind(canvasDomElement);
        }
    }
    draw() {
        // TODO: it there a better way to reset the canvas?
        this.ctx.beginPath();
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.stroke();
        // draw shapes
        this.ctx.fillStyle = 'black';
        for (let id in this.shapes) {
            this.shapes[id].draw(this.ctx, false, localStorage.getItem('randColor'));
            if (this.shapes[id].isBlockedByUserId) {
                {
                    this.shapes[id].draw(this.ctx, true, this.shapes[id].markedColor);
                }
            }
        }
        return this;
    }
    /******* DISPATCHER METHODS *******/
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
        const shapeCopy = this.createShapeCopy(shape);
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
    /******* HELPER METHODS *******/
    createShapeCopy(shape) {
        let shapeCopy;
        if (shape.type === 'line') {
            const line = shape;
            shapeCopy = new Line(line.from, line.to);
        }
        else if (shape.type === 'rectangle') {
            const rectangle = shape;
            shapeCopy = new Rectangle(rectangle.from, rectangle.to);
        }
        else if (shape.type === 'circle') {
            const circle = shape;
            shapeCopy = new Circle(circle.center, circle.radius);
        }
        else if (shape.type === 'triangle') {
            const triangle = shape;
            shapeCopy = new Triangle(triangle.p1, triangle.p2, triangle.p3);
        }
        else {
            console.error('Unknown Shape-Typ');
            return;
        }
        return shapeCopy;
    }
    getShapes() {
        return this.shapes;
    }
    getCanvasRenderingContext() {
        return this.ctx;
    }
    setShapes(shapes) {
        this.shapes = shapes;
    }
    getShapeById(id) {
        for (const key in this.shapes) {
            if (this.shapes[key].id === id) {
                return this.shapes[key];
            }
        }
    }
    getShapeKeyById(id) {
        for (const key in this.shapes) {
            if (this.shapes[key].id === id) {
                return key;
            }
        }
    }
    loadEventStream(stream) {
        stream.forEach((event) => {
            switch (event.type) {
                case CanvasEventType.ADD_SHAPE:
                    const shapeData = event.eventStream.shape;
                    const shape = this.createShapeCopy(shapeData);
                    if (shape) {
                        shape.backgroundColor = shapeData.backgroundColor;
                        shape.backgroundColorKey = shapeData.backgroundColorKey;
                        shape.strokeColor = shapeData.strokeColor;
                        shape.strokeColorKey = shapeData.strokeColorKey;
                        shape.id = shapeData.id;
                        this.addShape(true, shape, event.eventStream.redraw);
                    }
                    break;
                case CanvasEventType.REMOVE_SHAPE_WITH_ID:
                    this.removeShapeWithId(true, event.eventStream.id, event.eventStream.redraw);
                    break;
                case CanvasEventType.UPDATE_SHAPES_ORDER:
                    this.updateShapesOrder(event.eventStream.id, event.eventStream.moveUp, true);
                    break;
                case CanvasEventType.SELECT_SHAPE:
                    const selectedShapeKey = this.getShapeKeyById(event.eventStream.id);
                    this.shapes[selectedShapeKey].isBlockedByUserId =
                        event.eventStream.isBlockedByUserId; // true
                    this.shapes[selectedShapeKey].markedColor =
                        event.eventStream.markedColor;
                    break;
                case CanvasEventType.UNSELECT_SHAPE:
                    const unselectedShape = this.getShapeKeyById(event.eventStream.id);
                    this.shapes[unselectedShape].isBlockedByUserId = null;
                    this.shapes[unselectedShape].markedColor =
                        localStorage.getItem('randColor');
                    break;
                default:
                    break;
            }
            this.draw();
        });
    }
}
