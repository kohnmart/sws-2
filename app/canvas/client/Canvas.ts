import { CanvasEvent, CanvasEventType, Shape, ShapeManager } from './types.js';
import { ToolArea } from './ToolArea.js';
import {
  CanvasEventDispatcher,
  CanvasEventSubscription,
  EventStream,
  ToolEventDispatcher,
  ToolEventSubscription,
} from './CanvasEvent.js';
import { Line, Rectangle, Circle, Triangle } from './Shapes.js';

export class Canvas implements ShapeManager {
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
    new CanvasEventSubscription(this, this.eventDispatcher);
  private isCreatingShape: boolean = false;

  constructor(canvasDomElement: HTMLCanvasElement, toolarea: ToolArea) {
    const { width, height } = canvasDomElement.getBoundingClientRect();
    this.width = width;
    this.height = height;

    this.toolEventDispatcher = new ToolEventDispatcher();

    this.toolEventSubscription = new ToolEventSubscription(
      this.toolEventDispatcher
    );

    const el = document.getElementById('load-event-stream-btn');
    el.addEventListener('click', () => {
      this.loadEventStream();
    });

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
      this.shapes[id].draw(this.ctx, false);
    }
    return this;
  }

  /******* DISPATCHER METHODS *******/
  addShape(isTemp: boolean, shape: Shape, redraw: boolean = true): void {
    const shapeCopy = this.createShapeCopy(shape);
    Object.assign(shapeCopy, shape);

    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.ADD_SHAPE,
      data: { shape: shapeCopy, redraw: redraw },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
      this.displayEventStream();
    }
  }

  removeShape(shape: Shape, redraw: boolean = true): void {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.REMOVE_SHAPE,
      data: { id: shape.id, redraw: redraw },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    this.eventStream.removeLastEvent();
  }

  removeShapeWithId(isTemp: boolean, id: number, redraw: boolean = true): void {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.REMOVE_SHAPE_WITH_ID,
      data: { id: id, redraw: redraw },
    };
    console.log(isTemp);
    this.eventDispatcher.dispatch(canvasEvent);
    if (isTemp) {
      this.eventStream.removeLastEvent();
    } else {
      this.eventStream.addEvent(canvasEvent);
      this.displayEventStream();
    }
  }

  updateShapeColor(shapeId: number, colorType: string, newColor: string) {
    const canvasEvent = {
      type: CanvasEventType.CHANGE_COLOR,
      data: { id: shapeId, colorType: colorType, newColor: newColor },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    this.eventStream.addEvent(canvasEvent);
    this.displayEventStream();
  }

  updateShape(shape: Shape, isTemp: boolean) {
    const shapeCopy = this.createShapeCopy(shape);

    // Die Eigenschaften von shape auf shapeCopy kopieren
    Object.assign(shapeCopy, shape);

    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.UPDATE_SHAPE,
      data: { shape: shapeCopy, isTemp: isTemp },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
      this.displayEventStream();
    }
  }

  updateShapesOrder(shapeId: number, moveUp: boolean) {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.UPDATE_SHAPES_ORDER,
      data: { id: shapeId, moveUp: moveUp },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    this.eventStream.addEvent(canvasEvent);
    this.displayEventStream();
  }

  /******* HELPER METHODS *******/

  createShapeCopy(shape: Shape) {
    let shapeCopy: Shape;
    if (shape.type === 'line') {
      const line = shape as Line;
      shapeCopy = new Line(line.from, line.to);
    } else if (shape.type === 'rectangle') {
      const rectangle = shape as Rectangle;
      shapeCopy = new Rectangle(rectangle.from, rectangle.to);
    } else if (shape.type === 'circle') {
      const circle = shape as Circle;
      shapeCopy = new Circle(circle.center, circle.radius);
    } else if (shape.type === 'triangle') {
      const triangle = shape as Triangle;
      shapeCopy = new Triangle(triangle.p1, triangle.p2, triangle.p3);
    } else {
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

  setShapes(shapes: { [k: string]: Shape }) {
    this.shapes = shapes;
  }

  getShapeById(id: number): Shape {
    for (const key in this.shapes) {
      if (this.shapes[key].id === id) {
        return this.shapes[key];
      }
    }
  }
  /* EVENT DISPLAY */
  displayEventStream() {
    const textArea = document.getElementById(
      'event-stream-textarea'
    ) as HTMLTextAreaElement;

    const eventsJSON = this.eventStream
      .getEvents()
      .map((event) => JSON.stringify(event))
      .join('\n');

    console.log('EVENT');
    console.log(eventsJSON);

    textArea.value = '';
    textArea.value = eventsJSON;
  }

  loadEventStream() {
    const textArea = document.getElementById(
      'event-stream-textarea'
    ) as HTMLTextAreaElement;
    const eventStreamContent = textArea.value;
    const events = eventStreamContent
      .split('\n')
      .map((event) => JSON.parse(event.trim()));

    this.eventStream.clearEvents();

    for (const event of events) {
      switch (event.type) {
        case CanvasEventType.ADD_SHAPE:
          const shapeData: Line | Circle | Rectangle | Triangle =
            event.data.shape;
          const shape = this.createShapeCopy(shapeData);
          if (shape) {
            shape.backgroundColor = shapeData.backgroundColor;
            shape.backgroundColorKey = shapeData.backgroundColorKey;
            shape.strokeColor = shapeData.strokeColor;
            shape.strokeColorKey = shapeData.strokeColorKey;
            shape.id = shapeData.id;
            this.addShape(false, shape, event.data.redraw);
          }
          break;
        case CanvasEventType.REMOVE_SHAPE:
          this.removeShape(event.data.id, event.data.redraw);
          break;
        case CanvasEventType.REMOVE_SHAPE_WITH_ID:
          this.removeShapeWithId(false, event.data.id, event.data.redraw);
          break;
        case CanvasEventType.UPDATE_SHAPE:
          this.updateShape(event.data.shape, event.data.isTemp);
          break;
        case CanvasEventType.UPDATE_SHAPES_ORDER:
          this.updateShapesOrder(event.data.id, event.data.moveUp);
          break;
        default:
          break;
      }
    }
    this.draw();
  }
}
