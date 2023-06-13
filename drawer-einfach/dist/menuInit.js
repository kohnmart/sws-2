import { Types } from './item.js';
import ShapesInteraction from './ShapesInteraction.js';
export function setupContextMenu(menuApi) {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('Entfernen', (m) => {
        m.hide();
        ShapesInteraction.deleteShapesFromList();
    });
    menu.addItems(mItem1);
    menuApi.createRadioOption([Types.Vordergrund, Types.Hintergrund], {
        transparent: 'transparent',
        red: 'rot',
        green: 'grün',
        yellow: 'gelb',
        blue: 'blau',
        black: 'schwarz',
    }, 'transparent', (item) => {
        const shapes = ShapesInteraction.canvas.getShapes();
        ShapesInteraction.shapesSelected.forEach((id) => {
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