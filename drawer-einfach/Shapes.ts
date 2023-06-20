import { ItemRadio } from './item.js';
import { Shape, ShapeFactory, ShapeManager } from './types.js';

class Point2D {
  constructor(readonly x: number, readonly y: number) {}
}
class AbstractShape {
  private static counter: number = 0;
  readonly id: number;
  readonly type: string;
  readonly backgroundColor: string;
  readonly strokeColor: string;
  constructor(
    type: string,
    backgroundColor: string = ItemRadio.defaultBackground,
    strokeColor: string = ItemRadio.defaultForground
  ) {
    this.id = AbstractShape.counter++;
    this.type = type;
    this.backgroundColor = backgroundColor;
    this.strokeColor = strokeColor;
  }
}
abstract class AbstractFactory<T extends Shape> {
  private from: Point2D;
  private tmpTo: Point2D;
  private tmpShape: T;
  constructor(readonly shapeManager: ShapeManager) {}

  abstract createShape(from: Point2D, to: Point2D): T;

  handleMouseDown(x: number, y: number) {
    this.from = new Point2D(x, y);
  }

  handleMouseUp(x: number, y: number) {
    // remove the temp line, if there was one
    if (this.tmpShape) {
      this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
    }
    this.shapeManager.addShape(this.createShape(this.from, new Point2D(x, y)));
    this.from = undefined;
  }

  handleMouseMove(x: number, y: number) {
    // show temp circle only, if the start point is defined;
    if (!this.from) {
      return;
    }
    if (!this.tmpTo || this.tmpTo.x !== x || this.tmpTo.y !== y) {
      this.tmpTo = new Point2D(x, y);
      if (this.tmpShape) {
        // remove the old temp line, if there was one
        this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
      }
      // adds a new temp line
      this.tmpShape = this.createShape(this.from, new Point2D(x, y));
      this.shapeManager.addShape(this.tmpShape);
    }
  }
}
export class Line extends AbstractShape implements Shape {
  constructor(readonly from: Point2D, readonly to: Point2D) {
    super('line');
  }

  draw(ctx: CanvasRenderingContext2D, isSelected: boolean) {
    ctx.strokeStyle = this.strokeColor;

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.stroke();

    if (isSelected) {
      ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
      ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
    }
  }
}
export class LineFactory extends AbstractFactory<Line> implements ShapeFactory {
  public label: string = 'Linie';

  constructor(shapeManager: ShapeManager) {
    super(shapeManager);
  }

  createShape(from: Point2D, to: Point2D): Line {
    return new Line(from, to);
  }
}
export class Circle extends AbstractShape implements Shape {
  constructor(readonly center: Point2D, readonly radius: number) {
    super('circle');
  }
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean) {
    ctx.fillStyle = this.backgroundColor;
    ctx.strokeStyle = this.strokeColor;

    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.stroke();

    if (isSelected) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.center.x - 5, this.center.y + this.radius - 5, 10, 10);
      ctx.fillRect(this.center.x - 5, this.center.y - this.radius - 5, 10, 10);
      ctx.fillRect(this.center.x - 5 - this.radius, this.center.y, 10, 10);
      ctx.fillRect(this.center.x - 5 + this.radius, this.center.y, 10, 10);
    }
  }
}
export class CircleFactory
  extends AbstractFactory<Circle>
  implements ShapeFactory
{
  public label: string = 'Kreis';

  constructor(shapeManager: ShapeManager) {
    super(shapeManager);
  }

  createShape(from: Point2D, to: Point2D): Circle {
    return new Circle(from, CircleFactory.computeRadius(from, to.x, to.y));
  }

  private static computeRadius(from: Point2D, x: number, y: number): number {
    const xDiff = from.x - x,
      yDiff = from.y - y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }
}
export class Rectangle extends AbstractShape implements Shape {
  constructor(readonly from: Point2D, readonly to: Point2D) {
    super('rectangle');
  }

  draw(ctx: CanvasRenderingContext2D, isSelected: boolean) {
    ctx.fillStyle = this.backgroundColor;
    ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    ctx.strokeRect(
      this.from.x,
      this.from.y,
      this.to.x - this.from.x,
      this.to.y - this.from.y
    );
    ctx.stroke();
    ctx.fillRect(
      this.from.x,
      this.from.y,
      this.to.x - this.from.x,
      this.to.y - this.from.y
    );

    ctx.strokeRect(
      this.from.x,
      this.from.y,
      this.to.x - this.from.x,
      this.to.y - this.from.y
    );

    if (isSelected) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
      ctx.fillRect(this.from.x - 5, this.to.y - 5, 10, 10);
      ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
      ctx.fillRect(this.to.x - 5, this.from.y - 5, 10, 10);
    }
  }
}
export class RectangleFactory
  extends AbstractFactory<Rectangle>
  implements ShapeFactory
{
  public label: string = 'Rechteck';
  constructor(shapeManager: ShapeManager) {
    super(shapeManager);
  }

  createShape(from: Point2D, to: Point2D): Rectangle {
    return new Rectangle(from, to);
  }
}
export class Triangle extends AbstractShape implements Shape {
  constructor(
    readonly p1: Point2D,
    readonly p2: Point2D,
    readonly p3: Point2D
  ) {
    super('triangle');
  }
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineTo(this.p3.x, this.p3.y);
    ctx.lineTo(this.p1.x, this.p1.y);
    ctx.closePath(); // Close the path
    ctx.fillStyle = this.backgroundColor;
    ctx.fill(); // Fill the triangle
    ctx.strokeStyle = this.strokeColor;
    ctx.stroke();

    if (isSelected) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.p1.x - 5, this.p1.y - 5, 10, 10);
      ctx.fillRect(this.p2.x - 5, this.p2.y - 5, 10, 10);
      ctx.fillRect(this.p3.x - 5, this.p3.y - 5, 10, 10);
    }
  }
}
export class TriangleFactory implements ShapeFactory {
  public label: string = 'Dreieck';

  private from: Point2D;
  private tmpTo: Point2D;
  private tmpLine: Line;
  private thirdPoint: Point2D;
  private tmpShape: Triangle;

  constructor(readonly shapeManager: ShapeManager) {}

  handleMouseDown(x: number, y: number) {
    if (this.tmpShape) {
      this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
      this.shapeManager.addShape(
        new Triangle(this.from, this.tmpTo, new Point2D(x, y))
      );
      this.from = undefined;
      this.tmpTo = undefined;
      this.tmpLine = undefined;
      this.thirdPoint = undefined;
      this.tmpShape = undefined;
    } else {
      this.from = new Point2D(x, y);
    }
  }

  handleMouseUp(x: number, y: number) {
    // remove the temp line, if there was one
    if (this.tmpLine) {
      this.shapeManager.removeShapeWithId(this.tmpLine.id, false);
      this.tmpLine = undefined;
      this.tmpTo = new Point2D(x, y);
      this.thirdPoint = new Point2D(x, y);
      this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
      this.shapeManager.addShape(this.tmpShape);
    }
  }

  handleMouseMove(x: number, y: number) {
    // show temp circle only, if the start point is defined;
    if (!this.from) {
      return;
    }

    if (this.tmpShape) {
      // second point already defined, update temp triangle
      if (
        !this.thirdPoint ||
        this.thirdPoint.x !== x ||
        this.thirdPoint.y !== y
      ) {
        this.thirdPoint = new Point2D(x, y);
        if (this.tmpShape) {
          // remove the old temp line, if there was one
          this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
        }
        // adds a new temp triangle
        this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
        this.shapeManager.addShape(this.tmpShape);
      }
    } else {
      // no second point fixed, update tmp line
      if (!this.tmpTo || this.tmpTo.x !== x || this.tmpTo.y !== y) {
        this.tmpTo = new Point2D(x, y);
        if (this.tmpLine) {
          // remove the old temp line, if there was one
          this.shapeManager.removeShapeWithId(this.tmpLine.id, false);
        }
        // adds a new temp line
        this.tmpLine = new Line(this.from, this.tmpTo);
        this.shapeManager.addShape(this.tmpLine);
      }
    }
  }
}
