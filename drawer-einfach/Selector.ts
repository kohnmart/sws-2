import { Canvas } from './Canvas.js';
import { Line } from './Shapes';

export class Selector {
  static isEditMode: boolean = false;
  label = 'Select';
  static drawArea = document.getElementById('drawArea');
  static canvas: Canvas = undefined;

  static iterateShapes(x: number, y: number) {
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

          if (Math.abs(distance) <= 10) {
            //shape.draw(ctx, true)
            console.log(`Line is activated`);
          }
        }
      }
    }
  }
}
