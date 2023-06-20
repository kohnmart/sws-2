export default class ShapesInteraction {
    /**
     * The iterateShapes function is responsible for
     * iterating over shapes, determining if a given point
     * (specified by the x and y coordinates) is within the
     * boundaries of each shape, and updating the selected
     * shapes accordingly. The function also handles rendering
     * the selected shapes on the canvas.
     */
    static iterateShapes(x, y, isCtrl) {
        const ctx = ShapesInteraction.canvasRef.getCanvasRenderingContext();
        const shapes = ShapesInteraction.canvasRef.getShapes();
        if (!isCtrl) {
            ShapesInteraction.canvasRef.draw();
            ShapesInteraction.shapeListId = [];
            ShapesInteraction.shapesSelected = [];
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
        /* check if shapes have been detected */
        if (ShapesInteraction.shapeListId.length) {
            const firstId = ShapesInteraction.shapeListId[0];
            /* push first shape to selectedShapes list */
            ShapesInteraction.shapesSelected.push(firstId);
            if (!isCtrl) {
                /* if controll-key hasnt been pressed */
                /* render only first shape */
                shapes[firstId].draw(ctx, true);
            }
            else {
                /* control-key pressed -> then loop over all selected shapes */
                /* render */
                ShapesInteraction.shapeListId.forEach((id) => {
                    ShapesInteraction.shapesSelected.push(id);
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
    /***
     * The handleShapesList function is responsible for
     * managing the display and selection of shapes.
     */
    static handleShapesList() {
        const ctx = ShapesInteraction.canvasRef.getCanvasRenderingContext();
        const shapes = ShapesInteraction.canvasRef.getShapes();
        ShapesInteraction.canvasRef.draw();
        if (ShapesInteraction.shapeListIndexer <
            ShapesInteraction.shapeListId.length - 1) {
            ShapesInteraction.shapeListIndexer++;
        }
        const handleIdCurrent = ShapesInteraction.shapeListId[ShapesInteraction.shapeListIndexer];
        shapes[handleIdCurrent].draw(ctx, true);
        ShapesInteraction.shapesSelected = [];
        ShapesInteraction.shapesSelected.push(handleIdCurrent);
        if (ShapesInteraction.shapeListIndexer ==
            ShapesInteraction.shapeListId.length - 1) {
            ShapesInteraction.shapeListIndexer = -1;
        }
    }
    static deleteShapesFromList() {
        const shapes = ShapesInteraction.canvasRef.getShapes();
        ShapesInteraction.shapeListId.forEach((id) => {
            const shape = shapes[id];
            ShapesInteraction.canvasRef.removeShape(shape);
        });
    }
}
ShapesInteraction.shapeListId = [];
ShapesInteraction.shapesSelected = [];
ShapesInteraction.shapeListIndexer = 0;
ShapesInteraction.canvasRef = undefined;
//# sourceMappingURL=ShapesInteraction.js.map