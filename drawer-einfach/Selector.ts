import { Canvas } from './Canvas.js';

export class Selector {
  static isEditMode: boolean = false;
  label = 'Select';
  static canvas: Canvas = undefined;

  static iterateShapes(x: number, y: number) {
    console.log('RUN');
    const shapes = Selector.canvas.getShapes();
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const shape = shapes[key];

        if (x) console.log('Shape:');
        console.log(shape);
      }
    }
  }
}
