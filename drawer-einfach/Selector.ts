import { Canvas } from './Canvas.js';
import { Circle, Triangle, Rectangle, Line } from './Shapes';

export class Selector {
  public static isEditMode: boolean = false;
  public label = 'Select';
  public static canvas: Canvas = undefined;
  public static iterateShapes(x: number, y: number) {
    const ctx = Selector.canvas.getCanvasRenderingContext();
    const shapes = Selector.canvas.getShapes();
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const shape = shapes[key];
        const type = shape.type;

        if (type == 'line') {
          const line = shape as Line;
          const { x: start_x, y: start_y } = line.from;
          const { x: end_x, y: end_y } = line.to;
          const distance =
            ((end_y - start_y) * x -
              (end_x - start_x) * y +
              end_x * start_y -
              end_y * start_x) /
            ((end_y - start_y) ** 2 + (end_x - start_x) ** 2) ** 0.5;

          Selector.checkThreshold(distance, 10, line, ctx);
        } else if (type == 'rectangle') {
          const rectangle = shape as Rectangle;
          const { x: start_x, y: start_y } = rectangle.from;
          const { x: end_x, y: end_y } = rectangle.to;

          // Calculate the distances from the point to each side of the rectangle
          const distanceToLeft = Math.abs(x - start_x);
          const distanceToRight = Math.abs(x - end_x);
          const distanceToTop = Math.abs(y - start_y);
          const distanceToBottom = Math.abs(y - end_y);

          console.log('--------------------');
          console.log('Distance to Left: ' + distanceToLeft);
          console.log('Distance to Right: ' + distanceToRight);
          console.log('Distance to Top: ' + distanceToTop);
          console.log('Distance to Bottom: ' + distanceToBottom);

          console.log('Dist: ' + Math.abs(end_x - start_x));
          console.log('Dist: ' + Math.abs(end_y - start_y));

          // Check if the point is within the rectangle's boundaries
          if (
            distanceToLeft <= Math.abs(end_x - start_x) && // Check if the point is to the right of the left side
            distanceToRight <= Math.abs(end_x - start_x) && // Check if the point is to the left of the right side
            distanceToTop <= end_y - start_y && // Check if the point is below the top side
            distanceToBottom <= end_y - start_y // Check if the point is above the bottom side
          ) {
            ('DRAW');
            rectangle.draw(ctx, true);
          }
        } else if (type == 'triangle') {
          const rectangle = shape as Triangle;
          const { p1, p2, p3 } = rectangle;
        } else {
          const circle = shape as Circle;
          const { radius, center } = circle;
        }
      }
    }
  }

  static checkThreshold(
    distance: number,
    thrs: number,
    shape: Line | Circle | Rectangle | Triangle,
    ctx: CanvasRenderingContext2D
  ) {
    console.log(distance);
    if (Math.abs(distance) <= thrs) {
      shape.draw(ctx, true);
    }
  }
}
