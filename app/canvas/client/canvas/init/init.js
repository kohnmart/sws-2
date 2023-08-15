import { CircleFactory, LineFactory, RectangleFactory, TriangleFactory, } from '../components/Shapes.js';
import { ToolArea } from '../components/ToolArea.js';
import { Canvas } from '../pages/Canvas.js';
import { Selector } from '../components/Selector.js';
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
            return canvas.getEventSubscription().addShape(isTemp, s, rd);
        },
        removeShapeWithId(isTemp, id, rd) {
            return canvas.getEventSubscription().removeShapeWithId(isTemp, id, rd);
        },
    };
    const slm = {
        addShape(isTemp, shape, redraw) {
            canvas.getEventSubscription().addShape(isTemp, shape, redraw);
        },
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
            return canvas.getEventSubscription().updateShapeColor(shape);
        },
        getCtx() {
            return canvas.getCanvasRenderingContext();
        },
        draw() {
            canvas.draw();
        },
        updateOrder(n, dir, isReceiving) {
            canvas.getEventSubscription().updateShapesOrder(n, dir, isReceiving);
        },
        removeShapeWithId(isTemp, id, rd) {
            canvas.getEventSubscription().removeShapeWithId(isTemp, id, rd);
        },
        selectShape(shapeId) {
            canvas.getEventSubscription().selectShape(shapeId);
        },
        unselectShape(shapeId) {
            canvas.getEventSubscription().unselectShape(shapeId);
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
