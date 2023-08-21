import { Line, Rectangle, Circle, Triangle } from '../components/Shapes.js';
import { Shape } from '../../types/shape.js';

export function createShapeCopy(shape: Shape) {
  let shapeCopy: Shape;
  if (shape.type === 'line') {
    const line = shape as Line;
    shapeCopy = new Line(line.from, line.to);
  } else if (shape.type === 'rectangle') {
    const rectangle = shape as Rectangle;
    shapeCopy = new Rectangle(rectangle.from, rectangle.to);
  } else if (shape.type === 'circle') {
    const circle = shape as Circle;
    shapeCopy = new Circle(circle.center, circle.radius);
  } else if (shape.type === 'triangle') {
    const triangle = shape as Triangle;
    shapeCopy = new Triangle(triangle.p1, triangle.p2, triangle.p3);
  } else {
    console.error('Unknown Shape-Typ');
    return;
  }
  return shapeCopy;
}
