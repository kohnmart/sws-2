export class Selector {
    constructor() {
        this.label = 'Select';
    }
    handleMouseDown(x, y) {
        Selector.iterateShapes(x, y, false);
    }
    handleAlt() {
        if (Selector.list.length) {
            Selector.handleShapesList();
        }
    }
    handleCtrl(x, y) {
        Selector.iterateShapes(x, y, true);
    }
    handleMouseUp(x, y) { }
    handleMouseMove(x, y) { }
    /* Scanning shapes */
    static iterateShapes(x, y, isCtrl) {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        const shapes = Selector.canvas.getShapes();
        if (!isCtrl) {
            Selector.canvas.draw();
            Selector.list = [];
        }
        /* Iterate over shapes */
        for (const key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                const shape = shapes[key];
                const type = shape.type;
                /* Check the type */
                if (type == 'line') {
                    const line = shape;
                    const { x: start_x, y: start_y } = line.from;
                    const { x: end_x, y: end_y } = line.to;
                    // Calculate the cross product between vectors (start to point) and (start to end)
                    const crossProduct = (x - start_x) * (end_y - start_y) -
                        (y - start_y) * (end_x - start_x);
                    // Check if the point is collinear with the line segment
                    if (Math.abs(crossProduct) < 1500) {
                        // Check if the point lies within the bounding box of the line segment
                        if (Math.min(start_x, end_x) <= x &&
                            x <= Math.max(start_x, end_x) &&
                            Math.min(start_y, end_y) <= y &&
                            y <= Math.max(start_y, end_y)) {
                            //shape.draw(ctx, true);
                            Selector.list.push(line);
                        }
                    }
                }
                else if (type == 'rectangle') {
                    const rectangle = shape;
                    const { x: start_x, y: start_y } = rectangle.from;
                    const { x: end_x, y: end_y } = rectangle.to;
                    // Calculate the distances from the point to each side of the rectangle
                    const distanceToLeft = Math.abs(x - start_x);
                    const distanceToRight = Math.abs(x - end_x);
                    const distanceToTop = Math.abs(y - start_y);
                    const distanceToBottom = Math.abs(y - end_y);
                    // Check if the point is within the rectangle's boundaries
                    if (distanceToLeft <= Math.abs(end_x - start_x) &&
                        distanceToRight <= Math.abs(end_x - start_x) &&
                        distanceToTop <= end_y - start_y &&
                        distanceToBottom <= end_y - start_y) {
                        //rectangle.draw(ctx, true);
                        Selector.list.push(rectangle);
                    }
                }
                else if (type == 'triangle') {
                    const triangle = shape;
                    const { p1, p2, p3 } = triangle;
                    // Calculate barycentric coordinates of the point with respect to the triangle
                    const alpha = ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) /
                        ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
                    const beta = ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) /
                        ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
                    const gamma = 1 - alpha - beta;
                    if (alpha >= 0 && beta >= 0 && gamma >= 0) {
                        //triangle.draw(ctx, true);
                        Selector.list.push(triangle);
                    }
                }
                else {
                    const circle = shape;
                    const { radius, center } = circle;
                    // Calculate the distance between the point and the center of the circle
                    const distance = Math.sqrt(Math.pow((x - center.x), 2) + Math.pow((y - center.y), 2));
                    if (distance <= radius) {
                        // circle.draw(ctx, true);
                        Selector.list.push(circle);
                    }
                }
            }
            if (Selector.list.length && !isCtrl) {
                const id = Selector.list[0].id;
                console.log('TEST');
                shapes[id].draw(ctx, true);
                Selector.list = [];
            }
            else if (Selector.list.length && isCtrl) {
                Selector.list.forEach((s) => {
                    console.log(s);
                    shapes[s.id].draw(ctx, true);
                });
            }
        }
    }
    static handleShapesList() {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        const shapes = Selector.canvas.getShapes();
        Selector.canvas.draw();
        if (Selector.indexer < Selector.list.length - 1) {
            Selector.indexer++;
        }
        const idCurrent = Selector.list[Selector.indexer].id;
        shapes[idCurrent].draw(ctx, true);
        if (Selector.indexer == Selector.list.length - 1) {
            Selector.indexer = -1;
        }
    }
}
Selector.canvas = undefined;
Selector.list = [];
Selector.indexer = 0;
//# sourceMappingURL=Selector.js.map