/******* HELPER METHODS *******/
import { Line, Rectangle, Circle, Triangle } from './Shapes.js';
export function createShapeCopy(shape) {
    let shapeCopy;
    if (shape.type === 'line') {
        const line = shape;
        shapeCopy = new Line(line.from, line.to);
    }
    else if (shape.type === 'rectangle') {
        const rectangle = shape;
        shapeCopy = new Rectangle(rectangle.from, rectangle.to);
    }
    else if (shape.type === 'circle') {
        const circle = shape;
        shapeCopy = new Circle(circle.center, circle.radius);
    }
    else if (shape.type === 'triangle') {
        const triangle = shape;
        shapeCopy = new Triangle(triangle.p1, triangle.p2, triangle.p3);
    }
    else {
        console.error('Unknown Shape-Typ');
        return;
    }
    return shapeCopy;
}
