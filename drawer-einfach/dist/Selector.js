import MenuApi from './menuApi.js';
import { checkLineIntersection, checkPointInCircle, checkPointInRectangle, checkPointInTriangle, } from './ShapesInteraction.js';
import { Types } from './ColorPalette.js';
export class Selector {
    constructor(ss) {
        this.label = 'Select';
        this.shapeListId = [];
        this.shapesSelected = [];
        this.shapeListIndexer = 0;
        this.createMenu = (menuApi) => {
            const menu = menuApi.createMenu();
            const mItem1 = menuApi.createItem('Entfernen', (m) => {
                m.hide();
                this.deleteShapesFromList();
            });
            menu.addItems(mItem1);
            menuApi.createRadioOption(
            /* DEFINE COLOR PALETTES */
            [Types.Outline, Types.Hintergrund], 
            /* DEFINE BASE COLORS */
            {
                red: { name: 'rot', value: { red: 255, green: 0, blue: 0, alpha: 1 } },
                green: {
                    name: 'grün',
                    value: { red: 0, green: 255, blue: 0, alpha: 1 },
                },
                yellow: {
                    name: 'gelb',
                    value: { red: 255, green: 255, blue: 0, alpha: 1 },
                },
                blue: {
                    name: 'blau',
                    value: { red: 0, green: 0, blue: 255, alpha: 1 },
                },
                black: {
                    name: 'schwarz',
                    value: { red: 0, green: 0, blue: 0, alpha: 1 },
                },
            }, 
            /* SET DEFAULT COLORS */
            {
                Outline: {
                    type: Types.Outline,
                    key: 'black',
                },
                Hintergrund: {
                    type: Types.Hintergrund,
                    key: 'transparent',
                },
            }, (colorItem) => {
                const shapes = this.sm.getShapes();
                this.shapesSelected.forEach((id) => {
                    const shape = shapes[id];
                    const ctx = this.sm.getCtx();
                    if (colorItem.paletteInstance.type === Types.Hintergrund) {
                        shape.backgroundColor = colorItem.colorAsRGBA();
                    }
                    else {
                        shape.strokeColor = colorItem.colorAsRGBA();
                    }
                    shape.draw(ctx, true);
                });
                colorItem.paletteInstance.setDefaultColor(colorItem.key);
            });
            const itemMoveUp = menuApi.createItem('MoveUp', () => {
                const selected = this.shapesSelected[0];
                this.sm.updateOrder(selected, true);
            });
            const itemMoveDown = menuApi.createItem('MoveDown', () => {
                const selected = this.shapesSelected[0];
                this.sm.updateOrder(selected, false);
            });
            menu.addItems(itemMoveUp, itemMoveDown);
            return menu;
        };
        /***
         * The handleShapesList function is responsible for
         * managing the display and selection of shapes.
         */
        this.handleShapesList = () => {
            const ctx = this.sm.getCtx();
            const shapes = this.sm.getShapes();
            ctx.draw();
            if (this.shapeListIndexer < this.shapeListId.length - 1) {
                this.shapeListIndexer++;
            }
            const handleIdCurrent = this.shapeListId[this.shapeListIndexer];
            shapes[handleIdCurrent].draw(ctx, true);
            this.shapesSelected = [];
            this.shapesSelected.push(handleIdCurrent);
            if (this.shapeListIndexer == this.shapeListId.length - 1) {
                this.shapeListIndexer = -1;
            }
        };
        this.sm = ss;
        this.menu = this.createMenu(new MenuApi());
    }
    handleMouseDown(x, y) {
        this.iterateShapes(x, y, false);
    }
    handleAlt(x, y) {
        this.iterateShapes(x, y, false);
        if (this.shapeListId.length) {
            this.handleShapesList();
        }
    }
    handleCtrl(x, y) {
        this.iterateShapes(x, y, true);
    }
    handleRightClick(x, y) {
        this.menu.show(x, y);
    }
    handleMouseUp() {
        return;
    }
    handleMouseMove() {
        return;
    }
    /**
     * The iterateShapes function is responsible for
     * iterating over shapes, determining if a given point
     * (specified by the x and y coordinates) is within the
     * boundaries of each shape, and updating the selected
     * shapes accordingly. The function also handles rendering
     * the selected shapes on the canvas.
     */
    iterateShapes(x, y, isCtrl) {
        const ctx = this.sm.getCtx();
        const shapes = this.sm.getShapes();
        if (!isCtrl) {
            this.sm.draw();
            this.shapeListId = [];
            this.shapesSelected = [];
        }
        /* Iterate over shapes */
        for (const key in shapes) {
            if (shapes.hasOwnProperty(key)) {
                const shape = shapes[key];
                const type = shape.type;
                switch (type) {
                    case 'line':
                        const line = shape;
                        const { from, to } = line;
                        if (checkLineIntersection(x, y, from, to)) {
                            this.shapeListId.push(line.id);
                        }
                        break;
                    case 'rectangle':
                        const rectangle = shape;
                        const { from: rectFrom, to: rectTo } = rectangle;
                        if (checkPointInRectangle(x, y, rectFrom, rectTo)) {
                            this.shapeListId.push(rectangle.id);
                        }
                        break;
                    case 'triangle':
                        const triangle = shape;
                        const { p1, p2, p3 } = triangle;
                        if (checkPointInTriangle(x, y, p1, p2, p3)) {
                            this.shapeListId.push(triangle.id);
                        }
                        break;
                    case 'circle':
                        const circle = shape;
                        const { center, radius } = circle;
                        if (checkPointInCircle(x, y, center, radius)) {
                            this.shapeListId.push(circle.id);
                        }
                        break;
                }
            }
        }
        /* check if shapes have been detected */
        if (this.shapeListId.length) {
            const firstId = this.shapeListId[0];
            /* push first shape to selectedShapes list */
            this.shapesSelected.push(firstId);
            if (!isCtrl) {
                /* if controll-key hasnt been pressed */
                /* render only first shape */
                shapes[firstId].draw(ctx, true);
            }
            else {
                /* control-key pressed -> then loop over all selected shapes */
                /* render */
                this.shapeListId.forEach((id) => {
                    this.shapesSelected.push(id);
                    shapes[id].draw(ctx, true);
                });
            }
        }
    }
    deleteShapesFromList() {
        const shapes = this.sm.getShapes();
        this.shapeListId.forEach((id) => {
            const shape = shapes[id];
            this.sm.removeShape(shape, true);
        });
    }
}
//# sourceMappingURL=Selector.js.map