import { ColorPaletteGroup } from './ColorPalette.js';
class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class AbstractShape {
    constructor(type, backgroundColor = ColorPaletteGroup.group['Hintergrund']
        .defaultRGBA, outlineColor = ColorPaletteGroup.group['Outline'].defaultRGBA, backgroundColorKey = ColorPaletteGroup.group['Hintergrund']
        .colorKey, strokeColorKey = ColorPaletteGroup.group['Outline'].colorKey) {
        this.id = AbstractShape.counter++;
        this.type = type;
        this.backgroundColor = backgroundColor;
        this.backgroundColorKey = backgroundColorKey;
        this.strokeColor = outlineColor;
        this.strokeColorKey = strokeColorKey;
    }
}
AbstractShape.counter = 0;
class AbstractFactory {
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
        this.tmpShape = null;
    }
    handleMouseDown(x, y) {
        this.from = new Point2D(x, y);
    }
    handleMouseUp(x, y) {
        // Abort the drawing process if `this.from` is undefined
        if (!this.from) {
            return;
        }
        // remove the temp line, if there was one
        if (this.tmpShape) {
            this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
        }
        this.shapeManager.addShape(this.createShape(this.from, new Point2D(x, y)));
        this.from = undefined;
    }
    handleMouseMove(x, y) {
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
    handleCtrl(x, y) {
        // Currently no logic
        return;
    }
    handleAlt(x, y) {
        // Currently no logic
        return;
    }
}
export class Line extends AbstractShape {
    constructor(from, to) {
        super('line');
        this.from = from;
        this.to = to;
    }
    draw(ctx, isSelected) {
        if (!isSelected) {
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath();
            ctx.moveTo(this.from.x, this.from.y);
            ctx.lineTo(this.to.x, this.to.y);
            ctx.stroke();
        }
        else {
            ctx.fillStyle = 'purple';
            ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
        }
    }
}
export class LineFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = 'Linie';
    }
    createShape(from, to) {
        return new Line(from, to);
    }
}
export class Circle extends AbstractShape {
    constructor(center, radius) {
        super('circle');
        this.center = center;
        this.radius = radius;
    }
    draw(ctx, isSelected) {
        if (!isSelected) {
            ctx.fillStyle = this.backgroundColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath();
            ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.stroke();
        }
        else {
            ctx.fillStyle = 'purple';
            ctx.fillRect(this.center.x - 5, this.center.y + this.radius - 5, 10, 10);
            ctx.fillRect(this.center.x - 5, this.center.y - this.radius - 5, 10, 10);
            ctx.fillRect(this.center.x - 5 - this.radius, this.center.y, 10, 10);
            ctx.fillRect(this.center.x - 5 + this.radius, this.center.y, 10, 10);
        }
    }
}
export class CircleFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = 'Kreis';
    }
    createShape(from, to) {
        return new Circle(from, CircleFactory.computeRadius(from, to.x, to.y));
    }
    static computeRadius(from, x, y) {
        const xDiff = from.x - x, yDiff = from.y - y;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
}
export class Rectangle extends AbstractShape {
    constructor(from, to) {
        super('rectangle');
        this.from = from;
        this.to = to;
    }
    draw(ctx, isSelected) {
        if (!isSelected) {
            ctx.fillStyle = this.backgroundColor;
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath();
            ctx.strokeRect(this.from.x, this.from.y, this.to.x - this.from.x, this.to.y - this.from.y);
            ctx.stroke();
            ctx.fillRect(this.from.x, this.from.y, this.to.x - this.from.x, this.to.y - this.from.y);
            ctx.fill();
        }
        else {
            ctx.fillStyle = 'purple';
            ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
            ctx.fillRect(this.from.x - 5, this.to.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.from.y - 5, 10, 10);
        }
    }
}
export class RectangleFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = 'Rechteck';
    }
    createShape(from, to) {
        return new Rectangle(from, to);
    }
}
export class Triangle extends AbstractShape {
    constructor(p1, p2, p3) {
        super('triangle');
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    draw(ctx, isSelected) {
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
        }
        else {
            ctx.fillStyle = 'purple';
            ctx.fillRect(this.p1.x - 5, this.p1.y - 5, 10, 10);
            ctx.fillRect(this.p2.x - 5, this.p2.y - 5, 10, 10);
            ctx.fillRect(this.p3.x - 5, this.p3.y - 5, 10, 10);
        }
    }
}
export class TriangleFactory {
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
        this.label = 'Dreieck';
    }
    handleMouseDown(x, y) {
        if (this.tmpShape) {
            this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
            this.shapeManager.addShape(new Triangle(this.from, this.tmpTo, new Point2D(x, y)));
            this.from = undefined;
            this.tmpTo = undefined;
            this.tmpLine = undefined;
            this.thirdPoint = undefined;
            this.tmpShape = undefined;
        }
        else {
            this.from = new Point2D(x, y);
        }
    }
    handleMouseUp(x, y) {
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
    handleMouseMove(x, y) {
        // show temp circle only, if the start point is defined;
        if (!this.from) {
            return;
        }
        if (this.tmpShape) {
            // second point already defined, update temp triangle
            if (!this.thirdPoint ||
                this.thirdPoint.x !== x ||
                this.thirdPoint.y !== y) {
                this.thirdPoint = new Point2D(x, y);
                if (this.tmpShape) {
                    // remove the old temp line, if there was one
                    this.shapeManager.removeShapeWithId(this.tmpShape.id, false);
                }
                // adds a new temp triangle
                this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
                this.shapeManager.addShape(this.tmpShape);
            }
        }
        else {
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
//# sourceMappingURL=Shapes.js.map