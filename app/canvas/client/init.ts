import { ShapeFactory, ShapeManager, SelectorManager, Shape } from './types.js';
import {
  CircleFactory,
  LineFactory,
  RectangleFactory,
  TriangleFactory,
} from './Shapes.js';
import { ToolArea } from './ToolArea.js';
import { Canvas } from './Canvas.js';
import { Selector } from './Selector.js';
function init() {
  const canvasDomElm = document.getElementById('drawArea') as HTMLCanvasElement;
  const menu = document.getElementsByClassName('tools');
  // Problem here: Factories needs a way to create new Shapes, so they
  // have to call a method of the canvas.
  // The canvas on the other side wants to call the event methods
  // on the toolbar, because the toolbar knows what tool is currently
  // selected.
  // Anyway, we do not want the two to have references on each other
  let canvas: Canvas;
  const sm: ShapeManager = {
    addShape(s, rd) {
      return canvas.addShape(s, rd);
    },
    removeShape(s, rd) {
      return canvas.removeShape(s, rd);
    },
    removeShapeWithId(isTemp, id, rd) {
      return canvas.removeShapeWithId(isTemp, id, rd);
    },
  };

  const slm: SelectorManager = {
    getShapes() {
      return canvas.getShapes();
    },

    getShapeById(id: number) {
      return canvas.getShapeById(id);
    },

    updateShapeColor(shapeId, colorType, newColor): void {
      return canvas.updateShapeColor(shapeId, colorType, newColor);
    },

    getCtx() {
      return canvas.getCanvasRenderingContext();
    },
    draw() {
      canvas.draw();
    },
    updateOrder(n: number, dir: boolean) {
      canvas.updateShapesOrder(n, dir);
    },
    removeShapeWithId(isTemp, id, rd) {
      canvas.removeShapeWithId(isTemp, id, rd);
    },

    updateShape(shape: Shape, isTemp: boolean) {
      canvas.updateShape(shape, isTemp);
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

export default init;
