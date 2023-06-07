export class Selector {
    constructor() {
        this.label = 'Select';
    }
    static iterateShapes(x, y) {
        console.log('RUN');
        const shapes = Selector.canvas.getShapes();
        for (const key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                const shape = shapes[key];
                if (x)
                    console.log('Shape:');
                console.log(shape);
            }
        }
    }
}
Selector.isEditMode = false;
Selector.canvas = undefined;
//# sourceMappingURL=Selector.js.map