import { CircleFactory, LineFactory, RectangleFactory, TriangleFactory, } from './Shapes.js';
import { ToolArea } from './ToolArea.js';
import { Canvas } from './Canvas.js';
import { Selector } from './Selector.js';
function init() {
    const canvasDomElm = document.getElementById('drawArea');
    const menu = document.getElementsByClassName('tools');
    // Problem here: Factories needs a way to create new Shapes, so they
    // have to call a method of the canvas.
    // The canvas on the other side wants to call the event methods
    // on the toolbar, because the toolbar knows what tool is currently
    // selected.
    // Anyway, we do not want the two to have references on each other
    let canvas;
    const sm = {
        addShape(s, rd) {
            return canvas.addShape(s, rd);
        },
        removeShape(s, rd) {
            return canvas.removeShape(s, rd);
        },
        removeShapeWithId(id, rd) {
            return canvas.removeShapeWithId(id, rd);
        },
    };
    const slm = {
        getShapes() {
            return canvas.getShapes();
        },
        getShapeById(id) {
            return canvas.getShapeById(id);
        },
        getCtx() {
            return canvas.getCanvasRenderingContext();
        },
        draw() {
            canvas.draw();
        },
        updateOrder(n, dir) {
            canvas.updateShapesOrder(n, dir);
        },
        removeShapeWithId(id, rd) {
            canvas.removeShapeWithId(id, rd);
        },
    };
    const tools = [
        new LineFactory(sm),
        new CircleFactory(sm),
        new RectangleFactory(sm),
        new TriangleFactory(sm),
        new Selector(slm),
    ];
    const toolArea = new ToolArea(tools, menu[0]);
    canvas = new Canvas(canvasDomElm, toolArea);
    canvas.draw();
}
init();
//# sourceMappingURL=init.js.map