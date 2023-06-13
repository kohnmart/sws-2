import { Types } from './item.js';
import ShapesInteraction from './ShapesInteraction.js';
export function setupContextMenu(menuApi) {
    /* Setup new Menu */
    const menu = menuApi.createMenu();
    /* Add Entfernen-Button */
    const mItem1 = menuApi.createItem('Entfernen', (m) => {
        m.hide();
        const id = ShapesInteraction.shapeListId[0];
        const shapes = ShapesInteraction.canvas.getShapes();
        ShapesInteraction.canvas.removeShape(shapes[id]);
    });
    menu.addItems(mItem1);
    /* Create radio options for color-selection */
    /* Eigene Klasse? */
    menuApi.createRadioOption([Types.Vordergrund, Types.Hintergrund], {
        transparent: 'transparent',
        red: 'rot',
        green: 'grün',
        yellow: 'gelb',
        blue: 'blau',
        black: 'schwarz',
    }, 'red', (item) => {
        const shapes = ShapesInteraction.canvas.getShapes();
        const shape = shapes[ShapesInteraction.shapeListId[0]];
        if (shape) {
            const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
            if (item.inputElement.name === Types.Hintergrund) {
                shape.backgroundColor = item.key;
                item.setColorOption(true);
            }
            else {
                shape.strokeColor = item.key;
                item.setColorOption(false);
            }
            shape.draw(ctx, true);
        }
        else {
            item.setColorOption(item.inputElement.name === Types.Hintergrund);
        }
    });
    return menu;
}
//# sourceMappingURL=menuInit.js.map