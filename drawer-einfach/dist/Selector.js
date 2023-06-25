import { PLT_TYPES } from './types.js';
import MenuApi from './menuApi.js';
import { checkLineIntersection, checkPointInCircle, checkPointInRectangle, checkPointInTriangle, checkShapeColorsConsistency, } from './shapesInteractionUtils.js';
import { ColorPaletteGroup } from './ColorPalette.js';
export class Selector {
    constructor(slm) {
        this.label = 'Select';
        this.shapeListId = [];
        this.shapesSelected = [];
        this.shapeListIndexer = 0;
        /* ------------ CREATE - MENU ------------ */
        this.createMenu = (menuApi) => {
            const menu = menuApi.createMenu();
            const deleteShapesItem = menuApi.createItem('Entfernen', (m) => {
                m.hide();
                this.shapesSelected.forEach((id) => {
                    this.slm.removeShapeWithId(id, true);
                });
            });
            menu.addItems(deleteShapesItem);
            menuApi.createRadioOption(
            /* DEFINE COLOR PALETTES */
            [PLT_TYPES.Hintergrund, PLT_TYPES.Outline], 
            /* DEFINE BASE COLORS */
            {
                red: {
                    name: 'rot',
                    value: { red: 255, green: 0, blue: 0, alpha: 1 },
                },
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
                    type: PLT_TYPES.Outline,
                    key: 'black',
                },
                Hintergrund: {
                    type: PLT_TYPES.Hintergrund,
                    key: 'transparent',
                },
            }, 
            /* SET SPECIAL COLORS */
            {
                transparent: {
                    type: PLT_TYPES.Hintergrund,
                    name: 'transparent',
                    value: { red: 0, green: 0, blue: 0, alpha: 0 },
                },
            }, (colorPicker) => {
                const shapes = this.slm.getShapes();
                this.shapesSelected.forEach((id) => {
                    const shape = shapes[id];
                    if (colorPicker.paletteInstance.type === PLT_TYPES.Hintergrund) {
                        shape.backgroundColor = colorPicker.colorFormatAsRGBA();
                        shape.backgroundColorKey = colorPicker.key;
                    }
                    else {
                        shape.strokeColor = colorPicker.colorFormatAsRGBA();
                        shape.strokeColorKey = colorPicker.key;
                    }
                    this.slm.draw();
                });
            });
            const shapeMoveForwardItem = menuApi.createItem('Shape nach vorne', () => {
                this.slm.updateOrder(this.shapesSelected[0], false);
            });
            const shapeMoveBackwardItem = menuApi.createItem('Shape nach hinten', () => {
                this.slm.updateOrder(this.shapesSelected[0], true);
            });
            const separator = menuApi.createSeparator();
            menu.addItems(shapeMoveForwardItem, separator, shapeMoveBackwardItem);
            return menu;
        };
        /**
         * This method is used to iterate through the shapes in a cyclic manner,
         * selecting and highlighting each shape one by one on the canvas.
         * It provides a way to cycle through the shapes and perform actions on the selected shape.
         */
        this.iterateShapesLevels = () => {
            const shapes = this.slm.getShapes();
            const ctx = this.slm.getCtx();
            this.slm.draw();
            if (this.shapeListIndexer < 0) {
                this.shapeListIndexer = this.shapeListId.length - 1;
            }
            const idCurrent = this.shapeListId[this.shapeListIndexer];
            for (const key in shapes) {
                if (shapes.hasOwnProperty(key)) {
                    const id = shapes[key].id;
                    // Check if the current shape id matches the iteration level
                    if (id === idCurrent) {
                        // Draw the shape with ctx and true flag
                        shapes[key].draw(ctx, true);
                    }
                }
            }
            this.shapesSelected = [];
            this.shapesSelected.push(idCurrent);
            this.shapeListIndexer--;
        };
        this.slm = slm;
        this.menu = this.createMenu(new MenuApi());
    }
    /* -------------------------------------- */
    /* ------------ HANDLER - SECTION ------------ */
    handleMouseDown(x, y) {
        this.checkShapeCollision(x, y, false);
    }
    handleAlt(x, y) {
        if (this.shapeListId.length) {
            this.iterateShapesLevels();
        }
    }
    handleCtrl(x, y) {
        this.checkShapeCollision(x, y, true);
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
    /* -------------------------------------- */
    /* ------- INTERACTION - SECTION -------- */
    /**
     * The iterateShapes function is responsible for
     * iterating over shapes, determining if a given point
     * (specified by the x and y coordinates) is within the
     * boundaries of each shape, and updating the selected
     * shapes accordingly. The function also handles rendering
     * the selected shapes on the canvas.
     */
    checkShapeCollision(x, y, isCtrl) {
        const ctx = this.slm.getCtx();
        const shapes = this.slm.getShapes();
        if (!isCtrl) {
            this.slm.draw();
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
        if (this.shapeListId.length > 0) {
            const firstId = this.shapeListId[this.shapeListId.length - 1]; // firstId => Shape in front
            this.shapeListIndexer = this.shapeListId.length - 2;
            /* If single selection */
            if (!isCtrl) {
                // Iterate over each shapes object
                this.slm.draw();
                for (const key in shapes) {
                    if (shapes.hasOwnProperty(key)) {
                        const id = shapes[key].id;
                        // Check if the current shape id matches the firstId
                        if (id === firstId) {
                            // Add the id to the shapesSelected array
                            this.shapesSelected.push(id);
                            // Draw the shape with ctx and true flag
                            shapes[key].draw(ctx, true);
                            // Set color pickers
                            ColorPaletteGroup.group[PLT_TYPES.Hintergrund].setColorPicker(true, shapes[key].backgroundColorKey);
                            ColorPaletteGroup.group[PLT_TYPES.Outline].setColorPicker(true, shapes[key].strokeColorKey);
                        }
                    }
                }
            }
            else {
                // If multi-selection
                // Iterate over each id in shapeListId array
                this.shapeListId.forEach((id) => {
                    // Add the id to the shapesSelected array
                    this.shapesSelected.push(id);
                    shapes[id].draw(ctx, true);
                    // Set color pickers
                });
                // Check colors of first shape
                const bgKey = shapes[this.shapeListId[0]].backgroundColorKey;
                const strKey = shapes[this.shapeListId[0]].strokeColorKey;
                // Check if shape colors are consistent
                const consistent = checkShapeColorsConsistency(shapes, this.shapeListId, bgKey, strKey);
                if (!consistent[0]) {
                    ColorPaletteGroup.group[PLT_TYPES.Hintergrund].setColorPicker(true, bgKey);
                }
                else {
                    ColorPaletteGroup.group[PLT_TYPES.Hintergrund].setColorPicker(false);
                }
                if (!consistent[1]) {
                    ColorPaletteGroup.group[PLT_TYPES.Outline].setColorPicker(true, strKey);
                }
                else {
                    ColorPaletteGroup.group[PLT_TYPES.Outline].setColorPicker(false);
                }
            }
        }
    }
}
//# sourceMappingURL=Selector.js.map