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
                if (event.altKey) {
                    /* Execute Selector-Alt-Event */
                    createMouseHandler('handleAlt').call(this, event);
                }
                else if (event.ctrlKey) {
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
            if (event.button === 2) {
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
        for (const key in this.shapes) {
            if (this.shapes[key].id === id) {
                delete this.shapes[key];
            }
        }
        return redraw ? this.draw() : this;
    }
    getShapeById(id) {
        for (const key in this.shapes) {
            if (this.shapes[key].id === id) {
                return this.shapes[key];
            }
        }
    }
    updateShape(shape) {
        for (const key in this.shapes) {
            if (this.shapes[key].id === shape.id) {
                this.shapes[key] = shape;
            }
        }
    }
    getShapes() {
        return this.shapes;
    }
    /** Explanation:
     Use of Map and Object.entries: The this.shapes object is converted into
     a Map using Object.entries, which allows for efficient manipulation of
     key-value pairs. This is beneficial when dealing with a large number of shape objects.
     
     Finding the index of the shape: The shapeIndex is determined by finding the index in
     the shapeKeys array where the shape's ID matches the given shapeId. This index
     is used to determine the current position of the shape in the z-order.
     
     Swapping positions within the Map: If moveUp is true and the shape is
     not already at the top, or if moveUp is false and the shape is not already at
     the bottom, the positions of the current shape and the adjacent shape
     are swapped within the Map using Map.set().
     
     Updating the original shapes object:
     The modified shapesMap is converted back to an object using Object.fromEntries(), and the
     this.shapes object is updated with the new order of shapes.
     
     Redrawing the canvas: Finally, the draw() method is called to redraw the canvas
     with the updated shape order, reflecting the changes made to the z-order.
  
     ~ Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map?retiredLocale=de
     ~ Ref: https://www.digitalocean.com/community/tutorials/understanding-map-and-set-objects-in-javascript
     ~ Ref: https://javascript.info/map-set
     ~ Ref: https://de.wikipedia.org/wiki/Z-Ordnung
     *
     */
    updateShapesOrder(shapeId, moveUp) {
        const shapesMap = new Map(Object.entries(this.shapes));
        const shapeKeys = Array.from(shapesMap.keys());
        const shapeIndex = shapeKeys.findIndex((key) => shapesMap.get(key).id === shapeId);
        if (moveUp && shapeIndex > 0) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const previousShapeKey = shapeKeys[shapeIndex - 1];
            // Swap the positions within the Map
            const tempShape = shapesMap.get(currentShapeKey);
            shapesMap.set(currentShapeKey, shapesMap.get(previousShapeKey));
            shapesMap.set(previousShapeKey, tempShape);
        }
        else if (!moveUp && shapeIndex < shapeKeys.length - 1) {
            const currentShapeKey = shapeKeys[shapeIndex];
            const nextShapeKey = shapeKeys[shapeIndex + 1];
            // Swap the positions within the Map
            const tempShape = shapesMap.get(currentShapeKey);
            shapesMap.set(currentShapeKey, shapesMap.get(nextShapeKey));
            shapesMap.set(nextShapeKey, tempShape);
        }
        // Update the original shapes object with the modified order
        this.shapes = Object.fromEntries(shapesMap);
        // Redraw to new shape order
        this.draw();
    }
    getCanvasRenderingContext() {
        return this.ctx;
    }
}
//# sourceMappingURL=Canvas.js.map