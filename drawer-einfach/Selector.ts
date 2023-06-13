import { ShapeFactory } from './types.js';
import { setupContextMenu } from './menuInit.js';
import MenuApi from './menuApi.js';
import ShapesInteraction from './ShapesInteraction.js';
export class Selector implements ShapeFactory {
  public label = 'Select';
  public static isSelectionMode = false;

  private static menu = setupContextMenu(new MenuApi());

  public handleMouseDown(x: number, y: number) {
    ShapesInteraction.iterateShapes(x, y, false);
  }

  public handleAlt() {
    if (ShapesInteraction.shapeListId.length) {
      ShapesInteraction.handleShapesList();
    }
  }

  public handleCtrl(x: number, y: number) {
    ShapesInteraction.iterateShapes(x, y, true);
  }

  public handleRightClick(x: number, y: number) {
    Selector.menu.show(x, y);
  }

  public handleMouseUp() {
    return;
  }

  public handleMouseMove() {
    return;
  }
}
