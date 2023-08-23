import { EventStream } from '../event/EventStream.js';
import { createShapeCopy } from '../helper/canvasHelper.js';
import { CanvasEventSubscription } from '../event/CanvasEventSubscription.js';
import { ToolEventSubscription } from '../event/ToolEventSubscription.js';
import { EventDispatcher } from '../event/Event.js';
import { ECanvasEventType, } from '../../types/eventStream.js';
import { EClient } from '../../types/services.js';
export class Canvas {
    ctx;
    shapes = {};
    width;
    height;
    /* EVENTS */
    eventStream = new EventStream();
    eventDispatcher = new EventDispatcher();
    toolEventDispatcher;
    toolEventSubscription;
    canvasEventSubscription = new CanvasEventSubscription(this, this.eventDispatcher, this.eventStream);
    isCreatingShape = false;
    constructor(canvasDomElement, toolarea) {
        const { width, height } = canvasDomElement.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.toolEventDispatcher = new EventDispatcher();
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
                            type: ECanvasEventType.TOOL_ACTION,
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
        for (const key in this.shapes) {
            this.shapes[key].draw(this.ctx, false, this.shapes[key].markedColor);
            if (this.shapes[key].isBlockedByUserId) {
                {
                    this.shapes[key].draw(this.ctx, true, this.shapes[key].markedColor);
                }
            }
        }
        return this;
    }
    getShapes() {
        return this.shapes;
    }
    updateShape(shapeId, prop, value) {
        for (const key in this.shapes) {
            if (this.shapes[key].id === shapeId) {
                this.shapes[key][prop] = value;
                return;
            }
        }
        return;
    }
    getEventSubscription() {
        return this.canvasEventSubscription;
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
    clearShapesSelection() {
        this.canvasEventSubscription.clearBlockedByClientShapes();
        this.shapes = {};
    }
    loadEventStream(stream) {
        console.log(stream);
        stream.forEach((event) => {
            switch (event.type) {
                case ECanvasEventType.ADD_SHAPE:
                    const shapeData = event.eventStream.shape;
                    const shape = createShapeCopy(shapeData);
                    if (shape) {
                        shape.backgroundColor = shapeData.backgroundColor;
                        shape.backgroundColorKey = shapeData.backgroundColorKey;
                        shape.strokeColor = shapeData.strokeColor;
                        shape.strokeColorKey = shapeData.strokeColorKey;
                        shape.id = shapeData.id;
                        this.canvasEventSubscription.addShape(true, shape, event.eventStream.redraw);
                    }
                    break;
                case ECanvasEventType.REMOVE_SHAPE_WITH_ID:
                    this.canvasEventSubscription.removeShapeWithId(true, event.eventStream.id, event.eventStream.redraw);
                    break;
                case ECanvasEventType.UPDATE_SHAPES_ORDER:
                    this.canvasEventSubscription.updateShapesOrder(event.eventStream.id, event.eventStream.moveUp, true);
                    break;
                case ECanvasEventType.SELECT_SHAPE:
                    const selectedShapeKey = this.getShapeKeyById(event.eventStream.id);
                    this.shapes[selectedShapeKey].isBlockedByUserId =
                        event.eventStream.isBlockedByUserId;
                    this.shapes[selectedShapeKey].markedColor =
                        event.eventStream.markedColor;
                    break;
                case ECanvasEventType.UNSELECT_SHAPE:
                    const unselectedShape = this.getShapeKeyById(event.eventStream.id);
                    this.shapes[unselectedShape].isBlockedByUserId = null;
                    this.shapes[unselectedShape].markedColor = localStorage.getItem(EClient.RAND_COLOR);
                    break;
                case ECanvasEventType.CLIENT_DISCONNECT:
                    const clientId = event.eventStream.id;
                    for (const key in this.shapes) {
                        if (this.shapes[key].isBlockedByUserId === clientId) {
                            this.shapes[key].isBlockedByUserId = null;
                            this.shapes[key].markedColor = localStorage.getItem(EClient.RAND_COLOR);
                        }
                    }
                default:
                    break;
            }
            this.draw();
        });
    }
}
