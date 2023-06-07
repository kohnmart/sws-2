export class Selector {
    constructor() {
        this.label = 'Select';
    }
    static iterateShapes(x, y) {
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
                        Selector.drawControllRects(start_x, start_y);
                        Selector.drawControllRects(end_x, end_y);
                        console.log(`Line is activated`);
                    }
                }
            }
        }
    }
    static drawControllRects(x, y) {
        console.log(Selector.drawArea);
        const rectangle = document.createElement('button');
        rectangle.style.width = '10px'; // Adjust the width as needed
        rectangle.style.height = '10px'; // Adjust the height as needed
        rectangle.style.backgroundColor = 'black'; // Adjust the color as desired
        rectangle.style.borderRadius = '50%'; // Makes the rectangle circular
        /* Positioning */
        rectangle.style.position = 'absolute';
        rectangle.style.left = x + 'px';
        rectangle.style.top = y + 'px';
        Selector.drawArea.appendChild(rectangle);
    }
}
Selector.isEditMode = false;
Selector.drawArea = document.getElementById('drawArea');
Selector.canvas = undefined;
//# sourceMappingURL=Selector.js.map