import { Canvas } from '../pages/Canvas.js';
import { EventStream } from './EventStream.js';
import { createShapeCopy } from '../helper/canvasHelper.js';
import { CanvasEvent, CanvasEventType, Shape } from '../../types/types.js';
import { EventDispatcher } from './Event.js';
import { Rectangle } from '../components/Shapes.js';

export class CanvasEventSubscription {
  private canvas: Canvas;
  private eventStream: EventStream;
  private eventDispatcher: EventDispatcher;
  constructor(
    canvas: Canvas,
    eventDispatcher: EventDispatcher,
    evS: EventStream
  ) {
    this.canvas = canvas;
    this.eventStream = evS;
    this.eventDispatcher = eventDispatcher;
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

  /* DISPATCHER */

  selectShape(shapeId: string) {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.SELECT_SHAPE,
      data: {
        id: shapeId,
        isBlockedByUserId: localStorage.getItem('clientId'),
        markedColor: localStorage.getItem('randColor'),
      },
    };

    this.eventStream.addEvent(canvasEvent);
  }

  unselectShape(shapeId: string) {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.UNSELECT_SHAPE,
      data: { id: shapeId, isBlockedByUserId: null },
    };
    this.eventStream.addEvent(canvasEvent);
  }

  addShape(isTemp: boolean, shape: Shape, redraw: boolean = true): void {
    const shapeCopy = createShapeCopy(shape);
    Object.assign(shapeCopy, shape);

    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.ADD_SHAPE,
      data: { shape: shapeCopy, redraw: redraw },
    };

    this.eventDispatcher.dispatch(canvasEvent);

    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
    }
  }

  removeShapeWithId(isTemp: boolean, id: string, redraw: boolean = true): void {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.REMOVE_SHAPE_WITH_ID,
      data: { id: id, redraw: redraw },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
    }
  }

  updateShapeColor(shape: Shape) {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.ADD_SHAPE,
      data: { shape: shape, redraw: true },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    this.eventStream.addEvent(canvasEvent);
  }

  updateShapesOrder(
    shapeId: string,
    moveUp: boolean,
    isReceiving: boolean = false
  ) {
    const canvasEvent: CanvasEvent = {
      type: CanvasEventType.UPDATE_SHAPES_ORDER,
      data: { id: shapeId, moveUp: moveUp },
    };

    this.eventDispatcher.dispatch(canvasEvent);

    if (!isReceiving) {
      this.eventStream.addEvent(canvasEvent);
    }
  }
}
