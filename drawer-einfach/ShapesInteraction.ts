import { Line, Rectangle, Triangle, Circle } from './Shapes';
import { Canvas } from './Canvas.js';

export default class ShapesInteraction {
  static shapeListId: number[] = [];
  static shapeListIndexer = 0;
  static shapesSelected: number[] = [];
  static canvas: Canvas = undefined;

  public static iterateShapes(x: number, y: number, isCtrl: boolean) {
    const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
    const shapes = ShapesInteraction.canvas.getShapes();

    if (!isCtrl) {
      ShapesInteraction.canvas.draw();
      ShapesInteraction.shapeListId = [];
      ShapesInteraction.shapesSelected = [];
    }

    /* Iterate over shapes */
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const shape = shapes[key];
        const type = shape.type;

        switch (type) {
          case 'line':
            const line = shape as Line;
            const { from, to } = line;

            if (ShapesInteraction.checkLineIntersection(x, y, from, to)) {
              ShapesInteraction.shapeListId.push(line.id);
            }
            break;

          case 'rectangle':
            const rectangle = shape as Rectangle;
            const { from: rectFrom, to: rectTo } = rectangle;

            if (
              ShapesInteraction.checkPointInRectangle(x, y, rectFrom, rectTo)
            ) {
              ShapesInteraction.shapeListId.push(rectangle.id);
            }
            break;

          case 'triangle':
            const triangle = shape as Triangle;
            const { p1, p2, p3 } = triangle;

            if (ShapesInteraction.checkPointInTriangle(x, y, p1, p2, p3)) {
              ShapesInteraction.shapeListId.push(triangle.id);
            }
            break;

          case 'circle':
            const circle = shape as Circle;
            const { center, radius } = circle;

            if (ShapesInteraction.checkPointInCircle(x, y, center, radius)) {
              ShapesInteraction.shapeListId.push(circle.id);
            }
            break;
        }
      }
    }

    if (ShapesInteraction.shapeListId.length) {
      const firstId = ShapesInteraction.shapeListId[0];
      ShapesInteraction.shapesSelected.push(firstId);
      if (!isCtrl) {
        const id = ShapesInteraction.shapeListId[0];
        shapes[id].draw(ctx, true);
      } else {
        ShapesInteraction.shapeListId.forEach((id) => {
          shapes[id].draw(ctx, true);
        });
      }
    }
  }

  private static checkLineIntersection(
    x: number,
    y: number,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const { x: start_x, y: start_y } = from;
    const { x: end_x, y: end_y } = to;

    const crossProduct =
      (x - start_x) * (end_y - start_y) - (y - start_y) * (end_x - start_x);

    if (Math.abs(crossProduct) < 1500) {
      if (
        Math.min(start_x, end_x) <= x &&
        x <= Math.max(start_x, end_x) &&
        Math.min(start_y, end_y) <= y &&
        y <= Math.max(start_y, end_y)
      ) {
        return true;
      }
    }

    return false;
  }

  private static checkPointInRectangle(
    x: number,
    y: number,
    from: { x: number; y: number },
    to: { x: number; y: number }
  ) {
    const { x: start_x, y: start_y } = from;
    const { x: end_x, y: end_y } = to;

    const distanceToLeft = Math.abs(x - start_x);
    const distanceToRight = Math.abs(x - end_x);
    const distanceToTop = Math.abs(y - start_y);
    const distanceToBottom = Math.abs(y - end_y);

    if (
      distanceToLeft <= Math.abs(end_x - start_x) &&
      distanceToRight <= Math.abs(end_x - start_x) &&
      distanceToTop <= end_y - start_y &&
      distanceToBottom <= end_y - start_y
    ) {
      return true;
    }

    return false;
  }

  private static checkPointInTriangle(
    x: number,
    y: number,
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number }
  ) {
    const alpha =
      ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) /
      ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
    const beta =
      ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) /
      ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
    const gamma = 1 - alpha - beta;

    if (alpha >= 0 && beta >= 0 && gamma >= 0) {
      return true;
    }

    return false;
  }

  private static checkPointInCircle(
    x: number,
    y: number,
    center: { x: number; y: number },
    radius: number
  ) {
    const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);

    if (distance <= radius) {
      return true;
    }

    return false;
  }

  public static handleShapesList() {
    const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
    const shapes = ShapesInteraction.canvas.getShapes();
    ShapesInteraction.canvas.draw();
    if (
      ShapesInteraction.shapeListIndexer <
      ShapesInteraction.shapeListId.length - 1
    ) {
      ShapesInteraction.shapeListIndexer++;
    }

    const handleIdCurrent =
      ShapesInteraction.shapeListId[ShapesInteraction.shapeListIndexer];
    shapes[handleIdCurrent].draw(ctx, true);

    ShapesInteraction.shapesSelected = [];
    ShapesInteraction.shapesSelected.push(handleIdCurrent);

    if (
      ShapesInteraction.shapeListIndexer ==
      ShapesInteraction.shapeListId.length - 1
    ) {
      ShapesInteraction.shapeListIndexer = -1;
    }
  }

  public static deleteShapesFromList() {
    const shapes = ShapesInteraction.canvas.getShapes();
    ShapesInteraction.shapeListId.forEach((id: number) => {
      const shape = shapes[id];
      ShapesInteraction.canvas.removeShape(shape);
    });
  }
}
