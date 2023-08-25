import { ColorPaletteGroup } from '../components/ColorPalette.js';
export class Point2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class AbstractShape {
    id;
    type;
    backgroundColor;
    backgroundColorKey;
    strokeColor;
    isBlockedByUserId;
    strokeColorKey;
    markedColor = localStorage.getItem('randColor');
    constructor(type, backgroundColor = ColorPaletteGroup.group['Hintergrund']
        .defaultRGBA, outlineColor = ColorPaletteGroup.group['Outline'].defaultRGBA, backgroundColorKey = ColorPaletteGroup.group['Hintergrund']
        .colorKey, strokeColorKey = ColorPaletteGroup.group['Outline'].colorKey, isBlockedByUserId = null) {
        this.id = localStorage.getItem('clientId') + '--' + Date.now();
        this.isBlockedByUserId = isBlockedByUserId;
        this.type = type;
        this.backgroundColor = backgroundColor;
        this.backgroundColorKey = backgroundColorKey;
        this.strokeColor = outlineColor;
        this.strokeColorKey = strokeColorKey;
    }
}
class AbstractFactory {
    shapeManager;
    from;
    tmpTo;
    tmpShape = null;
    isDrawing = false; // Neue Eigenschaft, um zu überprüfen, ob ein Shape gezeichnet wird
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
    }
    handleMouseDown(x, y) {
        this.from = new Point2D(x, y);
        this.isDrawing = true; // Setzen Sie isDrawing auf true, um den Zeichnungsvorgang zu starten
    }
    handleMouseUp(x, y) {
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
        this.shapeManager.addShape(false, this.createShape(this.from, new Point2D(x, y)));
        this.from = null;
        this.isDrawing = false; // Setzen Sie isDrawing auf false, um den Zeichnungsvorgang zu beenden
    }
    handleMouseMove(x, y) {
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
    from;
    to;
    constructor(from, to) {
        super('line');
        this.from = from;
        this.to = to;
    }
    draw(ctx, isSelected, markedColor = this.markedColor) {
        if (!isSelected) {
            ctx.strokeStyle = this.strokeColor;
            ctx.beginPath();
            ctx.moveTo(this.from.x, this.from.y);
            ctx.lineTo(this.to.x, this.to.y);
            ctx.stroke();
        }
        else {
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
        }
    }
}
export class LineFactory extends AbstractFactory {
    label = 'Linie';
    constructor(shapeManager) {
        super(shapeManager);
    }
    createShape(from, to) {
        return new Line(from, to);
    }
}
export class Circle extends AbstractShape {
    center;
    radius;
    constructor(center, radius) {
        super('circle');
        this.center = center;
        this.radius = radius;
    }
    draw(ctx, isSelected, markedColor = this.markedColor) {
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
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.center.x - 5, this.center.y + this.radius - 5, 10, 10);
            ctx.fillRect(this.center.x - 5, this.center.y - this.radius - 5, 10, 10);
            ctx.fillRect(this.center.x - 5 - this.radius, this.center.y, 10, 10);
            ctx.fillRect(this.center.x - 5 + this.radius, this.center.y, 10, 10);
        }
    }
}
export class CircleFactory extends AbstractFactory {
    label = 'Kreis';
    constructor(shapeManager) {
        super(shapeManager);
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
    from;
    to;
    constructor(from, to) {
        super('rectangle');
        this.from = from;
        this.to = to;
    }
    draw(ctx, isSelected, markedColor = this.markedColor) {
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
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.from.x - 5, this.from.y - 5, 10, 10);
            ctx.fillRect(this.from.x - 5, this.to.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.to.y - 5, 10, 10);
            ctx.fillRect(this.to.x - 5, this.from.y - 5, 10, 10);
        }
    }
    undraw(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.beginPath();
        ctx.strokeRect(this.from.x, this.from.y, this.to.x - this.from.x, this.to.y - this.from.y);
        ctx.stroke();
        ctx.fillRect(this.from.x, this.from.y, this.to.x - this.from.x, this.to.y - this.from.y);
        ctx.fill();
    }
}
export class RectangleFactory extends AbstractFactory {
    label = 'Rechteck';
    constructor(shapeManager) {
        super(shapeManager);
    }
    createShape(from, to) {
        return new Rectangle(from, to);
    }
}
export class Triangle extends AbstractShape {
    p1;
    p2;
    p3;
    constructor(p1, p2, p3) {
        super('triangle');
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    draw(ctx, isSelected, markedColor = this.markedColor) {
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
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.p1.x - 5, this.p1.y - 5, 10, 10);
            ctx.fillRect(this.p2.x - 5, this.p2.y - 5, 10, 10);
            ctx.fillRect(this.p3.x - 5, this.p3.y - 5, 10, 10);
        }
    }
}
export class TriangleFactory {
    shapeManager;
    label = 'Dreieck';
    from;
    tmpTo;
    tmpLine;
    thirdPoint;
    tmpShape;
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
    }
    handleMouseDown(x, y) {
        if (this.tmpShape) {
            this.shapeManager.removeShapeWithId(true, this.tmpShape.id, false);
            this.shapeManager.addShape(false, new Triangle(this.from, this.tmpTo, new Point2D(x, y)));
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
    p1;
    p3;
    tmpShapeId; // Use a separate variable to store the ID of the temporary shape
    handleMouseUp(x, y) {
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
        }
        else if (this.tmpShape) {
            this.tmpTo = new Point2D(x, y);
            console.log(this.tmpShapeId);
            this.shapeManager.removeShapeWithId(true, this.tmpShapeId, true);
            this.shapeManager.addShape(false, new Triangle(this.p1, this.tmpTo, this.p3));
            this.tmpShapeId = undefined; // Reset the temporary shape ID
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
                    this.shapeManager.removeShapeWithId(true, this.tmpShape.id, false);
                }
                // adds a new temp triangle
                this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
                this.shapeManager.addShape(true, this.tmpShape);
            }
        }
        else {
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
