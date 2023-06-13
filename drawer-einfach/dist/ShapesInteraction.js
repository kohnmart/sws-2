export default class ShapesInteraction {
    static iterateShapes(x, y, isCtrl) {
        const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
        const shapes = ShapesInteraction.canvas.getShapes();
        if (!isCtrl) {
            ShapesInteraction.canvas.draw();
            ShapesInteraction.shapeListId = [];
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
                        if (ShapesInteraction.checkLineIntersection(x, y, from, to)) {
                            ShapesInteraction.shapeListId.push(line.id);
                        }
                        break;
                    case 'rectangle':
                        const rectangle = shape;
                        const { from: rectFrom, to: rectTo } = rectangle;
                        if (ShapesInteraction.checkPointInRectangle(x, y, rectFrom, rectTo)) {
                            ShapesInteraction.shapeListId.push(rectangle.id);
                        }
                        break;
                    case 'triangle':
                        const triangle = shape;
                        const { p1, p2, p3 } = triangle;
                        if (ShapesInteraction.checkPointInTriangle(x, y, p1, p2, p3)) {
                            ShapesInteraction.shapeListId.push(triangle.id);
                        }
                        break;
                    case 'circle':
                        const circle = shape;
                        const { center, radius } = circle;
                        if (ShapesInteraction.checkPointInCircle(x, y, center, radius)) {
                            ShapesInteraction.shapeListId.push(circle.id);
                        }
                        break;
                }
            }
        }
        if (ShapesInteraction.shapeListId.length) {
            if (!isCtrl) {
                const id = ShapesInteraction.shapeListId[0];
                shapes[id].draw(ctx, true);
            }
            else {
                ShapesInteraction.shapeListId.forEach((id) => {
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
        const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
        const shapes = ShapesInteraction.canvas.getShapes();
        ShapesInteraction.canvas.draw();
        if (ShapesInteraction.shapeListIndexer <
            ShapesInteraction.shapeListId.length - 1) {
            ShapesInteraction.shapeListIndexer++;
        }
        const idCurrent = ShapesInteraction.shapeListId[ShapesInteraction.shapeListIndexer];
        shapes[idCurrent].draw(ctx, true);
        if (ShapesInteraction.shapeListIndexer ==
            ShapesInteraction.shapeListId.length - 1) {
            ShapesInteraction.shapeListIndexer = -1;
        }
    }
}
ShapesInteraction.shapeListId = [];
ShapesInteraction.shapeListIndexer = 0;
ShapesInteraction.canvas = undefined;
//# sourceMappingURL=ShapesInteraction.js.map