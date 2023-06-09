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
            if (event.altKey) {
                createMouseHandler('handleAlt').call(this, event);
            }
            else if (event.ctrlKey) {
                createMouseHandler('handleCtrl').call(this, event);
            }
            else {
                console.log('HANDLE DOWN');
                createMouseHandler('handleMouseDown').call(this, event);
            }
        });
        function createMouseHandler(methodName) {
            return function (e) {
                e = e || window.event;
                if ('object' === typeof e) {
                    const btnCode = e.button, x = e.pageX - this.offsetLeft, y = e.pageY - this.offsetTop, ss = toolarea.getSelectedShape();
                    // if left mouse button is pressed,
                    // and if a tool is selected, do something
                    if (e.button === 0 && ss) {
                        const m = ss[methodName];
                        // This in the shapeFactory should be the factory itself.
                        m.call(ss, x, y);
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