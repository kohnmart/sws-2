import {
  CanvasEvent,
  CanvasEventType,
  IResponseEvent,
  IStream,
  Shape,
} from './types.js';
import { ToolArea } from './ToolArea.js';
import {
  CanvasEventDispatcher,
  CanvasEventSubscription,
  EventStream,
  ToolEventDispatcher,
  ToolEventSubscription,
} from './CanvasEvent.js';
import { Line, Rectangle, Circle, Triangle } from './Shapes.js';
import { createShapeCopy } from './canvasHelper.js';

export class Canvas {
  private ctx: CanvasRenderingContext2D;
  private shapes: { [p: number]: Shape } = {};
  private width: number;
  private height: number;

  /* EVENTS */
  private eventStream: EventStream = new EventStream();
  private eventDispatcher: CanvasEventDispatcher = new CanvasEventDispatcher();
  private toolEventDispatcher: ToolEventDispatcher;
  private toolEventSubscription: ToolEventSubscription;
  private canvasEventSubscription: CanvasEventSubscription =
    new CanvasEventSubscription(this, this.eventDispatcher, this.eventStream);
  private isCreatingShape: boolean = false;

  constructor(canvasDomElement: HTMLCanvasElement, toolarea: ToolArea) {
    const { width, height } = canvasDomElement.getBoundingClientRect();
    this.width = width;
    this.height = height;

    this.toolEventDispatcher = new ToolEventDispatcher();

    this.toolEventSubscription = new ToolEventSubscription(
      this.toolEventDispatcher
    );

    this.ctx = canvasDomElement.getContext('2d');
    canvasDomElement.addEventListener(
      'mousemove',
      createMouseHandler('handleMouseMove', toolarea)
    );

    canvasDomElement.addEventListener(
      'mouseup',
      createMouseHandler('handleMouseUp', toolarea)
    );

    canvasDomElement.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        if (event.altKey) {
          /* Execute Selector-Alt-Event */
          createMouseHandler('handleAlt', toolarea).call(this, event);
        } else if (event.ctrlKey) {
          /* Execute Selector-CRTL-Event */
          createMouseHandler('handleCtrl', toolarea).call(this, event);
        } else {
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

    function createMouseHandler(methodName: string, toolarea: ToolArea) {
      return function (e) {
        e = e || window.event;
        if ('object' === typeof e) {
          const btnCode = e.button,
            x = e.pageX - this.offsetLeft,
            y = e.pageY - this.offsetTop,
            tool = toolarea.getSelectedTool();
          if (tool && self.isCreatingShape) {
            // Form nur erstellen, wenn isCreatingShape true ist
            const m = tool[methodName];
            const toolEvent: CanvasEvent = {
              type: CanvasEventType.TOOL_ACTION,
              data: { tool: tool, method: m, x: x, y: y },
            };
            self.toolEventDispatcher.dispatch(toolEvent);
          }
        }
      }.bind(canvasDomElement);
    }
  }

  draw(): this {
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

  getShapes() {
    return this.shapes;
  }

  getEventSubscription() {
    return this.canvasEventSubscription;
  }

  getCanvasRenderingContext() {
    return this.ctx;
  }

  setShapes(shapes: { [k: string]: Shape }) {
    this.shapes = shapes;
  }

  getShapeById(id: string): Shape {
    for (const key in this.shapes) {
      if (this.shapes[key].id === id) {
        return this.shapes[key];
      }
    }
  }

  getShapeKeyById(id: string): string {
    for (const key in this.shapes) {
      if (this.shapes[key].id === id) {
        return key;
      }
    }
  }

  loadEventStream(stream: IStream[]) {
    stream.forEach((event: IResponseEvent) => {
      switch (event.type) {
        case CanvasEventType.ADD_SHAPE:
          const shapeData: Line | Circle | Rectangle | Triangle =
            event.eventStream.shape;
          const shape = createShapeCopy(shapeData);
          if (shape) {
            shape.backgroundColor = shapeData.backgroundColor;
            shape.backgroundColorKey = shapeData.backgroundColorKey;
            shape.strokeColor = shapeData.strokeColor;
            shape.strokeColorKey = shapeData.strokeColorKey;
            shape.id = shapeData.id;
            this.canvasEventSubscription.addShape(
              true,
              shape,
              event.eventStream.redraw
            );
          }
          break;
        case CanvasEventType.REMOVE_SHAPE_WITH_ID:
          this.canvasEventSubscription.removeShapeWithId(
            true,
            event.eventStream.id,
            event.eventStream.redraw
          );
          break;
        case CanvasEventType.UPDATE_SHAPES_ORDER:
          this.canvasEventSubscription.updateShapesOrder(
            event.eventStream.id,
            event.eventStream.moveUp,
            true
          );
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
