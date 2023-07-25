import { CanvasEventType } from './types.js';
import { CanvasEventDispatcher, CanvasEventSubscription, ToolEventDispatcher, ToolEventSubscription, } from './CanvasEvent.js';
export class Canvas {
    constructor(canvasDomElement, toolarea) {
        this.shapes = {};
        /* EVENTS */
        this.eventDispatcher = new CanvasEventDispatcher();
        this.canvasEventSubscription = new CanvasEventSubscription(this, this.eventDispatcher);
        this.isCreatingShape = false;
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
            this.shapes[id].draw(this.ctx, false);
        }
        return this;
    }
    /******* DISPATCHER METHODS *******/
    addShape(shape, redraw = true) {
        const canvasEvent = {
            type: CanvasEventType.ADD_SHAPE,
            data: { shape: shape, redraw: redraw },
        };
        this.eventDispatcher.dispatch(canvasEvent);
    }
    removeShape(shape, redraw = true) {
        const canvasEvent = {
            type: CanvasEventType.REMOVE_SHAPE,
            data: { id: shape.id, redraw: redraw },
        };
        this.eventDispatcher.dispatch(canvasEvent);
    }
    removeShapeWithId(id, redraw = true) {
        const canvasEvent = {
            type: CanvasEventType.REMOVE_SHAPE_WITH_ID,
            data: { id, redraw },
        };
        this.eventDispatcher.dispatch(canvasEvent);
    }
    updateShape(shape) {
        const canvasEvent = {
            type: CanvasEventType.UPDATE_SHAPE,
            data: { shape },
        };
        this.eventDispatcher.dispatch(canvasEvent);
    }
    updateShapesOrder(shapeId, moveUp) {
        const canvasEvent = {
            type: CanvasEventType.UPDATE_SHAPES_ORDER,
            data: { id: shapeId, moveUp: moveUp },
        };
        this.eventDispatcher.dispatch(canvasEvent);
    }
    /******* HELPER METHODS *******/
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
}
//# sourceMappingURL=Canvas.js.map