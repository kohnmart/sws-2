import { Selector } from './Selector.js';
export class Canvas {
    constructor(canvasDomElement, toolarea) {
        this.shapes = {};
        const { width, height } = canvasDomElement.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.ctx = canvasDomElement.getContext('2d');
        canvasDomElement.addEventListener('mousemove', createMouseHandler('handleMouseMove'));
        canvasDomElement.addEventListener('mouseup', createMouseHandler('handleMouseUp'));
        canvasDomElement.addEventListener('mousedown', (event) => {
            if (event.button === 0) {
                if (event.altKey && Selector.isSelectionMode) {
                    /* Execute Selector-Alt-Event */
                    createMouseHandler('handleAlt').call(this, event);
                }
                else if (event.ctrlKey && Selector.isSelectionMode) {
                    /* Execute Selector-CRTL-Event */
                    createMouseHandler('handleCtrl').call(this, event);
                }
                else {
                    /* Execute for all types */
                    createMouseHandler('handleMouseDown').call(this, event);
                }
            }
        });
        canvasDomElement.addEventListener('contextmenu', (event) => {
            if (event.button === 2 && Selector.isSelectionMode) {
                event.preventDefault();
                createMouseHandler('handleRightClick').call(this, event);
            }
        });
        function createMouseHandler(methodName) {
            return function (e) {
                e = e || window.event;
                if ('object' === typeof e) {
                    const btnCode = e.button, x = e.pageX - this.offsetLeft, y = e.pageY - this.offsetTop, tool = toolarea.getSelectedTool();
                    if (tool) {
                        const m = tool[methodName];
                        // This in the shapeFactory should be the factory itself.
                        m.call(tool, x, y);
                    }
                }
            }.bind(canvasDomElement);
        }
    }
    draw() {
        // TODO: it there a better way to reset the canvas?
        this.ctx.beginPath();
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.stroke();
        // draw shapes
        this.ctx.fillStyle = 'black';
        for (let id in this.shapes) {
            this.shapes[id].draw(this.ctx, false);
        }
        return this;
    }
    addShape(shape, redraw = true) {
        this.shapes[shape.id] = shape;
        return redraw ? this.draw() : this;
    }
    removeShape(shape, redraw = true) {
        const id = shape.id;
        delete this.shapes[id];
        return redraw ? this.draw() : this;
    }
    removeShapeWithId(id, redraw = true) {
        delete this.shapes[id];
        return redraw ? this.draw() : this;
    }
    getShapes() {
        return this.shapes;
    }
    getCanvasRenderingContext() {
        return this.ctx;
    }
}
//# sourceMappingURL=Canvas.js.map