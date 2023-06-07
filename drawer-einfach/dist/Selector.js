export class Selector {
    constructor() {
        this.label = 'Select';
    }
    static iterateShapes(x, y) {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        const shapes = Selector.canvas.getShapes();
        for (const key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                const shape = shapes[key];
                const type = shape.type;
                if (type == 'line') {
                    const line = shape;
                    const { x: start_x, y: start_y } = line.from;
                    const { x: end_x, y: end_y } = line.to;
                    const distance = ((end_y - start_y) * x -
                        (end_x - start_x) * y +
                        end_x * start_y -
                        end_y * start_x) /
                        Math.pow((Math.pow((end_y - start_y), 2) + Math.pow((end_x - start_x), 2)), 0.5);
                    if (Math.abs(distance) <= 10) {
                        shape.draw(ctx, true);
                        console.log(`Line is activated`);
                    }
                }
            }
        }
    }
}
Selector.isEditMode = false;
Selector.drawArea = document.getElementById('drawArea');
Selector.canvas = undefined;
//# sourceMappingURL=Selector.js.map