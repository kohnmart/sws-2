import { Shape, ShapeManager } from './types.js';
import { ToolArea } from './ToolArea.js';
import { Selector } from './Selector.js';
export class Canvas implements ShapeManager {
  private ctx: CanvasRenderingContext2D;
  private shapes: { [p: number]: Shape } = {};
  private width: number;
  private height: number;

  constructor(canvasDomElement: HTMLCanvasElement, toolarea: ToolArea) {
    const { width, height } = canvasDomElement.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.ctx = canvasDomElement.getContext('2d');
    canvasDomElement.addEventListener(
      'mousemove',
      createMouseHandler('handleMouseMove')
    );

    canvasDomElement.addEventListener(
      'mouseup',
      createMouseHandler('handleMouseUp')
    );

    canvasDomElement.addEventListener('mousedown', (event) => {
      if (event.button === 0) {
        if (event.altKey && Selector.isSelectionMode) {
          /* Execute Selector-Alt-Event */
          createMouseHandler('handleAlt').call(this, event);
        } else if (event.ctrlKey && Selector.isSelectionMode) {
          /* Execute Selector-CRTL-Event */
          createMouseHandler('handleCtrl').call(this, event);
        } else {
          /* Execute for all types */
          createMouseHandler('handleMouseDown').call(this, event);
        }
      }
    });

    canvasDomElement.addEventListener('contextmenu', (event) => {
      if (event.button === 2 && Selector.isSelectionMode) {
        event.preventDefault();
        createMouseHandler('handleRightClick').call(this, event);
      }
    });

    function createMouseHandler(methodName: string) {
      return function (e) {
        e = e || window.event;
        if ('object' === typeof e) {
          const btnCode = e.button,
            x = e.pageX - this.offsetLeft,
            y = e.pageY - this.offsetTop,
            tool = toolarea.getSelectedTool();
          if (tool) {
            const m = tool[methodName];
            // This in the shapeFactory should be the factory itself.
            m.call(tool, x, y);
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

  addShape(shape: Shape, redraw: boolean = true): this {
    this.shapes[shape.id] = shape;
    return redraw ? this.draw() : this;
  }

  removeShape(shape: Shape, redraw: boolean = true): this {
    const id = shape.id;
    delete this.shapes[id];
    return redraw ? this.draw() : this;
  }

  removeShapeWithId(id: number, redraw: boolean = true): this {
    delete this.shapes[id];
    return redraw ? this.draw() : this;
  }

  getShapes() {
    return this.shapes;
  }

  updateShapesOrder(shapeId: number, moveUp: boolean) {
    const shapeKeys = Object.keys(this.shapes);
    const shapeIndex = shapeKeys.findIndex(
      (key) => this.shapes[key].id === shapeId
    );

    if (moveUp && shapeIndex > 0) {
      const currentShapeKey = shapeKeys[shapeIndex];
      const previousShapeKey = shapeKeys[shapeIndex - 1];

      [this.shapes[currentShapeKey], this.shapes[previousShapeKey]] = [
        this.shapes[previousShapeKey],
        this.shapes[currentShapeKey],
      ];
    } else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
      const currentShapeKey = shapeKeys[shapeIndex];
      const nextShapeKey = shapeKeys[shapeIndex + 1];

      [this.shapes[currentShapeKey], this.shapes[nextShapeKey]] = [
        this.shapes[nextShapeKey],
        this.shapes[currentShapeKey],
      ];
    }
  }

  getCanvasRenderingContext() {
    return this.ctx;
  }
}
