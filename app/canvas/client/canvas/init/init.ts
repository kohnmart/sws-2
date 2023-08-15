import {
  ShapeFactory,
  ShapeManager,
  SelectorManager,
  Shape,
  IStream,
} from '../../types/types.js';
import {
  CircleFactory,
  LineFactory,
  RectangleFactory,
  TriangleFactory,
} from '../components/Shapes.js';
import { ToolArea } from '../components/ToolArea.js';
import { Canvas } from '../pages/Canvas.js';
import { Selector } from '../components/Selector.js';
let canvas: Canvas;
function init() {
  const canvasDomElm = document.getElementById('drawArea') as HTMLCanvasElement;
  const menu = document.getElementsByClassName('tools');
  // Problem here: Factories needs a way to create new Shapes, so they
  // have to call a method of the canvas.
  // The canvas on the other side wants to call the event methods
  // on the toolbar, because the toolbar knows what tool is currently
  // selected.
  // Anyway, we do not want the two to have references on each other
  const sm: ShapeManager = {
    addShape(isTemp, s, rd) {
      return canvas.getEventSubscription().addShape(isTemp, s, rd);
    },
    removeShapeWithId(isTemp, id, rd) {
      return canvas.getEventSubscription().removeShapeWithId(isTemp, id, rd);
    },
  };

  const slm: SelectorManager = {
    addShape(isTemp: boolean, shape: Shape, redraw?: boolean) {
      canvas.getEventSubscription().addShape(isTemp, shape, redraw);
    },

    getShapes() {
      return canvas.getShapes();
    },

    getShapeById(id: string) {
      return canvas.getShapeById(id);
    },

    getShapeKeyById(id: string) {
      return canvas.getShapeKeyById(id);
    },

    updateShapeColor(shape: Shape): void {
      return canvas.getEventSubscription().updateShapeColor(shape);
    },

    getCtx() {
      return canvas.getCanvasRenderingContext();
    },
    draw() {
      canvas.draw();
    },
    updateOrder(n: string, dir: boolean, isReceiving: boolean) {
      canvas.getEventSubscription().updateShapesOrder(n, dir, isReceiving);
    },
    removeShapeWithId(isTemp, id, rd) {
      canvas.getEventSubscription().removeShapeWithId(isTemp, id, rd);
    },

    selectShape(shapeId: string) {
      canvas.getEventSubscription().selectShape(shapeId);
    },

    unselectShape(shapeId: string) {
      canvas.getEventSubscription().unselectShape(shapeId);
    },
  };

  const tools: ShapeFactory[] = [
    new LineFactory(sm),
    new CircleFactory(sm),
    new RectangleFactory(sm),
    new TriangleFactory(sm),
    new Selector(slm),
  ];
  const toolArea = new ToolArea(tools, menu[0]);
  canvas = new Canvas(canvasDomElm, toolArea);
  canvas.draw();
}

const loadStream = (stream: IStream[]) => {
  return canvas.loadEventStream(stream);
};

export default { init, loadStream };

export { init, loadStream };
