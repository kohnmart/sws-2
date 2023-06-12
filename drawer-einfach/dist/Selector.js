import MenuApi from './menuApi.js';
import { setupContextMenu } from './menuInit.js';
export class Selector {
    constructor() {
        this.label = 'Select';
    }
    handleMouseDown(x, y) {
        Selector.iterateShapes(x, y, false);
    }
    handleAlt() {
        if (Selector.shapeListId.length) {
            Selector.handleShapesList();
        }
    }
    handleCtrl(x, y) {
        Selector.iterateShapes(x, y, true);
    }
    handleRightClick(x, y) {
        Selector.menu.show(x, y);
    }
    handleMouseUp() {
        return;
    }
    handleMouseMove() {
        return;
    }
    static iterateShapes(x, y, isCtrl) {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        const shapes = Selector.canvas.getShapes();
        if (!isCtrl) {
            Selector.canvas.draw();
            Selector.shapeListId = [];
        }
        /* Iterate over shapes */
        for (const key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                const shape = shapes[key];
                const type = shape.type;
                switch (type) {
                    case 'line':
                        const line = shape;
                        const { from, to } = line;
                        if (Selector.checkLineIntersection(x, y, from, to)) {
                            Selector.shapeListId.push(line.id);
                        }
                        break;
                    case 'rectangle':
                        const rectangle = shape;
                        const { from: rectFrom, to: rectTo } = rectangle;
                        if (Selector.checkPointInRectangle(x, y, rectFrom, rectTo)) {
                            Selector.shapeListId.push(rectangle.id);
                        }
                        break;
                    case 'triangle':
                        const triangle = shape;
                        const { p1, p2, p3 } = triangle;
                        if (Selector.checkPointInTriangle(x, y, p1, p2, p3)) {
                            Selector.shapeListId.push(triangle.id);
                        }
                        break;
                    case 'circle':
                        const circle = shape;
                        const { center, radius } = circle;
                        if (Selector.checkPointInCircle(x, y, center, radius)) {
                            Selector.shapeListId.push(circle.id);
                        }
                        break;
                }
            }
        }
        if (Selector.shapeListId.length) {
            if (!isCtrl) {
                const id = Selector.shapeListId[0];
                shapes[id].draw(ctx, true);
            }
            else {
                Selector.shapeListId.forEach((id) => {
                    shapes[id].draw(ctx, true);
                });
            }
        }
    }
    static checkLineIntersection(x, y, from, to) {
        const { x: start_x, y: start_y } = from;
        const { x: end_x, y: end_y } = to;
        const crossProduct = (x - start_x) * (end_y - start_y) - (y - start_y) * (end_x - start_x);
        if (Math.abs(crossProduct) < 1500) {
            if (Math.min(start_x, end_x) <= x &&
                x <= Math.max(start_x, end_x) &&
                Math.min(start_y, end_y) <= y &&
                y <= Math.max(start_y, end_y)) {
                return true;
            }
        }
        return false;
    }
    static checkPointInRectangle(x, y, from, to) {
        const { x: start_x, y: start_y } = from;
        const { x: end_x, y: end_y } = to;
        const distanceToLeft = Math.abs(x - start_x);
        const distanceToRight = Math.abs(x - end_x);
        const distanceToTop = Math.abs(y - start_y);
        const distanceToBottom = Math.abs(y - end_y);
        if (distanceToLeft <= Math.abs(end_x - start_x) &&
            distanceToRight <= Math.abs(end_x - start_x) &&
            distanceToTop <= end_y - start_y &&
            distanceToBottom <= end_y - start_y) {
            return true;
        }
        return false;
    }
    static checkPointInTriangle(x, y, p1, p2, p3) {
        const alpha = ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) /
            ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
        const beta = ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) /
            ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
        const gamma = 1 - alpha - beta;
        if (alpha >= 0 && beta >= 0 && gamma >= 0) {
            return true;
        }
        return false;
    }
    static checkPointInCircle(x, y, center, radius) {
        const distance = Math.sqrt(Math.pow((x - center.x), 2) + Math.pow((y - center.y), 2));
        if (distance <= radius) {
            return true;
        }
        return false;
    }
    static handleShapesList() {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        const shapes = Selector.canvas.getShapes();
        Selector.canvas.draw();
        if (Selector.shapeListIndexer < Selector.shapeListId.length - 1) {
            Selector.shapeListIndexer++;
        }
        const idCurrent = Selector.shapeListId[Selector.shapeListIndexer];
        shapes[idCurrent].draw(ctx, true);
        if (Selector.shapeListIndexer == Selector.shapeListId.length - 1) {
            Selector.shapeListIndexer = -1;
        }
    }
}
Selector.isSelectionMode = false;
Selector.canvas = undefined;
Selector.shapeListId = [];
Selector.shapeListIndexer = 0;
Selector.menu = setupContextMenu(new MenuApi());
//# sourceMappingURL=Selector.js.map