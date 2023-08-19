import { ColorPaletteGroup } from '../components/ColorPalette.js';
import { Shape, ShapeFactory, ShapeManager } from '../../types/types.js';
export class Point2D {
  constructor(readonly x: number, readonly y: number) {}
}
class AbstractShape {
  id: string;
  readonly type: string;

  backgroundColor: string;
  readonly backgroundColorKey: string;
  strokeColor: string;
  isBlockedByUserId: string | null;
  readonly strokeColorKey: string;
  readonly markedColor: string = localStorage.getItem('randColor');
  constructor(
    type: string,
    backgroundColor: string = ColorPaletteGroup.group['Hintergrund']
      .defaultRGBA,
    outlineColor: string = ColorPaletteGroup.group['Outline'].defaultRGBA,
    backgroundColorKey: string = ColorPaletteGroup.group['Hintergrund']
      .colorKey,
    strokeColorKey: string = ColorPaletteGroup.group['Outline'].colorKey,

    isBlockedByUserId: string | null = null
  ) {
    this.id = localStorage.getItem('clientId') + '--' + Date.now();
    this.isBlockedByUserId = isBlockedByUserId;
    this.type = type;
    this.backgroundColor = backgroundColor;
    this.backgroundColorKey = backgroundColorKey;
    this.strokeColor = outlineColor;
    this.strokeColorKey = strokeColorKey;
  }
}
abstract class AbstractFactory<T extends Shape> {
  private from: Point2D;
  private tmpTo: Point2D;
  private tmpShape: T = null;
  private isDrawing: boolean = false; // Neue Eigenschaft, um zu überprüfen, ob ein Shape gezeichnet wird
  constructor(readonly shapeManager: ShapeManager) {}

  abstract createShape(from: Point2D, to: Point2D): T;

  handleMouseDown(x: number, y: number) {
    this.from = new Point2D(x, y);
    this.isDrawing = true; // Setzen Sie isDrawing auf true, um den Zeichnungsvorgang zu starten
  }

  handleMouseUp(x: number, y: number) {
    // Beenden Sie den Zeichnungsvorgang, wenn `this.from` nicht definiert ist
    if (!this.from) {
      return;
    }

    // Entfernen Sie das temporäre Shape, wenn eines vorhanden ist
    if (this.tmpShape) {
      this.shapeManager.removeShapeWithId(false, this.tmpShape.id, false);
      this.tmpShape = null;
    }

    // Fügen Sie das endgültige Shape hinzu
    this.shapeManager.addShape(
      false,
      this.createShape(this.from, new Point2D(x, y))
    );
    this.from = null;
    this.isDrawing = false; // Setzen Sie isDrawing auf false, um den Zeichnungsvorgang zu beenden
  }

  handleMouseMove(x: number, y: number) {
    // Zeigen Sie das temporäre Shape nur an, wenn der Startpunkt definiert ist
    if (!this.from) {
      return;
    }

    if (this.isDrawing) {
      if (!this.tmpTo || this.tmpTo.x !== x || this.tmpTo.y !== y) {
        this.tmpTo = new Point2D(x, y);

        if (this.tmpShape) {
          // Entfernen Sie das alte temporäre Shape, falls vorhanden
          this.shapeManager.removeShapeWithId(true, this.tmpShape.id, false);
        }

        // Fügen Sie das neue temporäre Shape hinzu
        this.tmpShape = this.createShape(this.from, this.tmpTo);
        this.shapeManager.addShape(true, this.tmpShape);
      }
    }
  }

  handleCtrl(x: number, y: number) {
    // Currently no logic
    return;
  }

  handleAlt(x: number, y: number) {
    // Currently no logic
    return;
  }
}
export class Line extends AbstractShape implements Shape {
  constructor(readonly from: Point2D, readonly to: Point2D) {
    super('line');
  }

  draw(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    markedColor: string = this.markedColor
  ) {
    if (!isSelected) {
      ctx.strokeStyle = this.strokeColor;
      ctx.beginPath();
      ctx.moveTo(this.from.x, this.from.y);
      ctx.lineTo(this.to.x, this.to.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = markedColor;
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
  draw(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    markedColor: string = this.markedColor
  ) {
    if (!isSelected) {
      ctx.fillStyle = this.backgroundColor;
      ctx.strokeStyle = this.strokeColor;

      ctx.beginPath();
      ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = markedColor;
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

  draw(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    markedColor: string = this.markedColor
  ) {
    if (!isSelected) {
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

      ctx.fill();
    } else {
      ctx.fillStyle = markedColor;
      ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
      ctx.fillRect(this.from.x - 5, this.to.y - 5, 10, 10);
      ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
      ctx.fillRect(this.to.x - 5, this.from.y - 5, 10, 10);
    }
  }

  undraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.strokeStyle = 'rgba(0,0,0,0)';
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

    ctx.fill();
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
  draw(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    markedColor: string = this.markedColor
  ) {
    if (!isSelected) {
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
    } else {
      ctx.fillStyle = markedColor;
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
      this.shapeManager.removeShapeWithId(true, this.tmpShape.id, false);
      this.shapeManager.addShape(
        false,
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

  p1: { x: number; y: number };
  p3: { x: number; y: number };
  tmpShapeId: string; // Use a separate variable to store the ID of the temporary shape

  handleMouseUp(x: number, y: number) {
    if (this.tmpLine) {
      this.shapeManager.removeShapeWithId(true, this.tmpLine.id, false);
      if (!this.thirdPoint) {
        this.tmpTo = new Point2D(x, y);
        this.thirdPoint = new Point2D(x, y);
        this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
        this.tmpShapeId = this.tmpShape.id; // Store the ID of the temporary shape
        //this.shapeManager.addShape(true, this.tmpShape, false);
        this.p1 = this.from;
        this.p3 = this.thirdPoint;
      }
      this.tmpLine = undefined;
    } else if (this.tmpShape) {
      this.tmpTo = new Point2D(x, y);
      console.log(this.tmpShapeId);
      this.shapeManager.removeShapeWithId(true, this.tmpShapeId, true);
      this.shapeManager.addShape(
        false,
        new Triangle(this.p1, this.tmpTo, this.p3)
      );
      this.tmpShapeId = undefined; // Reset the temporary shape ID
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
          this.shapeManager.removeShapeWithId(true, this.tmpShape.id, false);
        }
        // adds a new temp triangle
        this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
        this.shapeManager.addShape(true, this.tmpShape);
      }
    } else {
      // no second point fixed, update tmp line
      if (!this.tmpTo || this.tmpTo.x !== x || this.tmpTo.y !== y) {
        this.tmpTo = new Point2D(x, y);
        if (this.tmpLine) {
          // remove the old temp line, if there was one
          this.shapeManager.removeShapeWithId(true, this.tmpLine.id, false);
        }
        // adds a new temp line
        this.tmpLine = new Line(this.from, this.tmpTo);
        this.shapeManager.addShape(true, this.tmpLine);
      }
    }
  }
}
