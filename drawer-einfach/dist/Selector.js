import { setupContextMenu } from './menuInit.js';
import MenuApi from './menuApi.js';
import ShapesInteraction from './ShapesInteraction.js';
export class Selector {
    constructor() {
        this.label = 'Select';
    }
    handleMouseDown(x, y) {
        ShapesInteraction.iterateShapes(x, y, false);
    }
    handleAlt(x, y) {
        ShapesInteraction.iterateShapes(x, y, false);
        if (ShapesInteraction.shapeListId.length) {
            ShapesInteraction.handleShapesList();
        }
    }
    handleCtrl(x, y) {
        ShapesInteraction.iterateShapes(x, y, true);
    }
    handleRightClick(x, y) {
        Selector.menu.show(x, y);
    }
    handleMouseUp() {
        return;
    }
    handleMouseMove() {
        return;
    }
}
Selector.isSelectionMode = false;
Selector.menu = setupContextMenu(new MenuApi());
//# sourceMappingURL=Selector.js.map