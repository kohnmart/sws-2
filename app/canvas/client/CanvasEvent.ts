import { Canvas } from './Canvas.js';
import { getCanvasId, wsSend } from './index.js';
import { CanvasEvent, CanvasEventType, Shape } from './types.js';

export class CanvasEventManager {
  type: CanvasEventType;
  data?: { shape: Shape; redraw: boolean; moveUp: boolean };
  timestamp: number;
  isTemporary: boolean;

  constructor(type: CanvasEventType, data?: any) {
    this.type = type;
    this.data = data;
    this.timestamp = Date.now();
  }
}

export class EventStream {
  private events: CanvasEvent[] = [];

  addEvent(event: CanvasEvent) {
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
  private subscribers: ((event: CanvasEvent) => void)[] = [];

  subscribe(callback: (event: CanvasEvent) => void) {
    this.subscribers.push(callback);
  }

  dispatch(event: CanvasEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}

export class ToolEventDispatcher {
  private subscribers: ((event: CanvasEvent) => void)[] = [];

  subscribe(callback: (event: CanvasEvent) => void) {
    this.subscribers.push(callback);
  }

  dispatch(event: CanvasEvent) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
  }
}

export class ToolEventSubscription {
  constructor(eventDispatcher: ToolEventDispatcher) {
    // Subscribe to the canvas event dispatcher
    eventDispatcher.subscribe((event: CanvasEvent) => {
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
  private canvas: Canvas;

  constructor(canvas: Canvas, eventDispatcher: CanvasEventDispatcher) {
    this.canvas = canvas;
    eventDispatcher.subscribe((event: CanvasEvent) => {
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

  handleColorChange(event: CanvasEvent) {
    const shapeId = event.data.id;
    const colorType = event.data.colorType;
    const newColor = event.data.newColor;
    const shape = this.canvas.getShapeById(shapeId);
    if (shape) {
      if (colorType === 'backgroundColor') {
        shape.backgroundColor = newColor;
      } else {
        shape.strokeColor = newColor;
      }
      return this.canvas.draw();
    }
    return;
  }

  handleAddShape(shape: Shape, redraw: boolean = true): Canvas {
    const shapes = this.canvas.getShapes();
    shapes[shape.id] = shape as Shape;
    this.canvas.setShapes(shapes);
    return redraw ? this.canvas.draw() : this.canvas;
  }

  handleRemoveShape(id: string, redraw: boolean = true): Canvas {
    const shapes = this.canvas.getShapes();
    delete shapes[id];
    this.canvas.setShapes(shapes);
    return redraw ? this.canvas.draw() : this.canvas;
  }

  handleRemoveShapeWithId(id: string, redraw: boolean = true): Canvas {
    const shapes = this.canvas.getShapes();
    for (const key in shapes) {
      if (shapes[key].id === id) {
        delete shapes[key];
      }
    }
    return redraw ? this.canvas.draw() : this.canvas;
  }

  handleGetShapeById(id: string): Shape {
    const shapes = this.canvas.getShapes();
    for (const key in shapes) {
      if (shapes[key].id === id) {
        return shapes[key];
      }
    }
  }

  handleUpdateShape(shape: Shape) {
    const shapes = this.canvas.getShapes();
    for (const key in shapes) {
      if (shapes[key].id === shape.id) {
        shapes[key] = shape as Shape;
      }
    }
    this.canvas.draw();
  }

  handleUpdateShapesOrder(shapeId: string, moveUp: boolean) {
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
    } else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
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
