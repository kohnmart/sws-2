import { CircleFactory, LineFactory, RectangleFactory, TriangleFactory, } from './Shapes.js';
import { ToolArea } from './ToolArea.js';
import { Canvas } from './Canvas.js';
import { Selector } from './Selector.js';
let canvas;
function init() {
    const canvasDomElm = document.getElementById('drawArea');
    const menu = document.getElementsByClassName('tools');
    // Problem here: Factories needs a way to create new Shapes, so they
    // have to call a method of the canvas.
    // The canvas on the other side wants to call the event methods
    // on the toolbar, because the toolbar knows what tool is currently
    // selected.
    // Anyway, we do not want the two to have references on each other
    const sm = {
        addShape(isTemp, s, rd) {
            return canvas.addShape(isTemp, s, rd);
        },
        removeShape(s, rd) {
            return canvas.removeShape(s, rd);
        },
        removeShapeWithId(isTemp, id, rd) {
            return canvas.removeShapeWithId(isTemp, id, rd);
        },
    };
    const slm = {
        getShapes() {
            return canvas.getShapes();
        },
        getShapeById(id) {
            return canvas.getShapeById(id);
        },
        getShapeKeyById(id) {
            return canvas.getShapeKeyById(id);
        },
        updateShapeColor(shape) {
            return canvas.updateShapeColor(shape);
        },
        updateShapeProperty(shapeKey, prop, value) {
            return canvas.updateShapeProperty(shapeKey, prop, value);
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
        removeShapeWithId(isTemp, id, rd) {
            canvas.removeShapeWithId(isTemp, id, rd);
        },
        updateShape(shape, isTemp) {
            canvas.updateShape(shape, isTemp);
        },
        selectShape(shapeId) {
            canvas.selectShape(shapeId);
        },
        unselectShape(shapeId) {
            canvas.unselectShape(shapeId);
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
const loadStream = (stream) => {
    return canvas.loadEventStream(stream);
};
export default { init, loadStream };
export { init, loadStream };
