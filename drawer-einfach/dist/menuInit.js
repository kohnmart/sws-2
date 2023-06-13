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
        ShapesInteraction.shapeListId.forEach((id) => {
            const shape = shapes[id];
            const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
            if (item.inputElement.name === Types.Hintergrund) {
                shape.backgroundColor = item.key;
            }
            else {
                shape.strokeColor = item.key;
            }
            shape.draw(ctx, true);
        });
        if (item.inputElement.name === Types.Hintergrund) {
            item.setColorOption(true);
        }
        else {
            item.setColorOption(false);
        }
    });
    return menu;
}
//# sourceMappingURL=menuInit.js.map