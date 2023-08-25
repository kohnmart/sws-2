import { Canvas } from '../pages/Canvas.js';
import { EventStream } from './EventStream.js';
import { createShapeCopy } from '../helper/canvasHelper.js';
import { IShape } from '../../types/shape.js';
import { EventDispatcher } from './Event.js';
import { ICanvasEvent, ECanvasEventType } from '../../types/eventStream.js';
import { EClient } from '../../types/services.js';

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
    eventDispatcher.subscribe((event: ICanvasEvent) => {
      switch (event.type) {
        case ECanvasEventType.ADD_SHAPE:
          this.handleAddShape(event.data.shape, event.data.redraw);
          break;
        case ECanvasEventType.REMOVE_SHAPE:
          this.handleRemoveShape(event.data.id, event.data.redraw);
          break;
        case ECanvasEventType.REMOVE_SHAPE_WITH_ID:
          this.handleRemoveShapeWithId(event.data.id, event.data.redraw);
          break;
        case ECanvasEventType.UPDATE_SHAPE:
          this.handleUpdateShape(event.data.shape);
          break;
        case ECanvasEventType.UPDATE_SHAPES_ORDER:
          this.handleUpdateShapesOrder(event.data.id, event.data.moveUp);
          break;
        case ECanvasEventType.CHANGE_COLOR:
          this.handleColorChange(event);
          break;
        default:
          break;
      }
    });
  }

  handleColorChange(event: ICanvasEvent) {
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
      this.canvas.draw();
    }
  }

  handleAddShape(shape: IShape, redraw: boolean = true): Canvas {
    const shapes = this.canvas.getShapes();
    shapes[shape.id] = shape as IShape;
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

  handleGetShapeById(id: string): IShape {
    const shapes = this.canvas.getShapes();
    for (const key in shapes) {
      if (shapes[key].id === id) {
        return shapes[key];
      }
    }
  }

  handleUpdateShape(shape: IShape) {
    const shapes = this.canvas.getShapes();
    for (const key in shapes) {
      if (shapes[key].id === shape.id) {
        shapes[key] = shape as IShape;
      }
    }
    this.canvas.draw();
  }

  handleUpdateShapesOrder(shapeId: string, moveUp: boolean) {
    const shapes = this.canvas.getShapes();
    const shapeKeys = Object.keys(shapes);
    const shapeIndex = shapeKeys.findIndex((key) => shapes[key].id === shapeId);

    if (moveUp && shapeIndex > 0) {
      const newShapeKeys = [...shapeKeys];
      const currentShapeKey = shapeKeys[shapeIndex];
      const previousShapeKey = shapeKeys[shapeIndex - 1];

      // Swap the positions within the newShapeKeys array
      newShapeKeys[shapeIndex] = previousShapeKey;
      newShapeKeys[shapeIndex - 1] = currentShapeKey;

      // Update the shapes object with the new order
      const newShapes = {};
      newShapeKeys.forEach((key) => {
        newShapes[key] = shapes[key];
      });

      this.canvas.setShapes(newShapes);
      this.canvas.draw();
    } else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
      const newShapeKeys = [...shapeKeys];
      const currentShapeKey = shapeKeys[shapeIndex];
      const nextShapeKey = shapeKeys[shapeIndex + 1];

      // Swap the positions within the newShapeKeys array
      newShapeKeys[shapeIndex] = nextShapeKey;
      newShapeKeys[shapeIndex + 1] = currentShapeKey;

      // Update the shapes object with the new order
      const newShapes = {};
      newShapeKeys.forEach((key) => {
        newShapes[key] = shapes[key];
      });

      this.canvas.setShapes(newShapes);
      this.canvas.draw();
    }
  }

  /* DISPATCHER */

  selectShape(shapeId: string) {
    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.SELECT_SHAPE,
      data: {
        id: shapeId,
        isBlockedByUserId: localStorage.getItem(EClient.CLIENT_ID),
        markedColor: localStorage.getItem(EClient.RAND_COLOR),
      },
    };

    this.eventStream.addEvent(canvasEvent);
  }

  unselectShape(shapeId: string) {
    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.UNSELECT_SHAPE,
      data: { id: shapeId, isBlockedByUserId: null },
    };
    this.eventStream.addEvent(canvasEvent);
  }

  addShape(isTemp: boolean, shape: IShape, redraw: boolean = true): void {
    const shapeCopy = createShapeCopy(shape);
    Object.assign(shapeCopy, shape);

    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.ADD_SHAPE,
      data: { shape: shapeCopy, redraw: redraw },
    };

    this.eventDispatcher.dispatch(canvasEvent);

    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
    }
  }

  removeShapeWithId(isTemp: boolean, id: string, redraw: boolean = true): void {
    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.REMOVE_SHAPE_WITH_ID,
      data: { id: id, redraw: redraw },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    if (!isTemp) {
      this.eventStream.addEvent(canvasEvent);
    }
  }

  updateShapeColor(shape: IShape) {
    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.ADD_SHAPE,
      data: { shape: shape, redraw: true },
    };
    this.eventDispatcher.dispatch(canvasEvent);
    this.eventStream.addEvent(canvasEvent);
    this.selectShape(shape.id);
  }

  updateShapesOrder(
    shapeId: string,
    moveUp: boolean,
    isReceiving: boolean = false
  ) {
    const canvasEvent: ICanvasEvent = {
      type: ECanvasEventType.UPDATE_SHAPES_ORDER,
      data: { id: shapeId, moveUp: moveUp },
    };
    this.eventDispatcher.dispatch(canvasEvent);

    if (!isReceiving) {
      this.eventStream.addEvent(canvasEvent);
    }
  }

  clearBlockedByClientShapes() {
    const shapes = this.canvas.getShapes();
    const id = localStorage.getItem(EClient.CLIENT_ID);
    for (const key in shapes) {
      if (shapes[key].isBlockedByUserId === id) {
        this.unselectShape(shapes[key].id);
      }
    }
  }
}
