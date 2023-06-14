import { Types, ItemColor } from './item.js';
import MenuApi from './menuApi.js';
import ShapesInteraction from './ShapesInteraction.js';
export function setupContextMenu(menuApi: MenuApi): MenuApi {
  const menu = menuApi.createMenu();
  const mItem1 = menuApi.createItem('Entfernen', (m: MenuApi) => {
    m.hide();
    ShapesInteraction.deleteShapesFromList();
  });
  menu.addItems(mItem1);
  menuApi.createRadioOption(
    [Types.Vordergrund, Types.Hintergrund],
    {
      transparent: 'transparent',
      red: 'rot',
      green: 'grün',
      yellow: 'gelb',
      blue: 'blau',
      black: 'schwarz',
    },
    'transparent',
    (item: ItemColor) => {
      const shapes = ShapesInteraction.canvas.getShapes();
      ShapesInteraction.shapesSelected.forEach((id: number) => {
        const shape = shapes[id];
        const ctx = ShapesInteraction.canvas.getCanvasRenderingContext();
        if (item.inputElement.name === Types.Hintergrund) {
          shape.backgroundColor = item.key;
        } else {
          shape.strokeColor = item.key;
        }
        shape.draw(ctx, true);
      });

      if (item.inputElement.name === Types.Hintergrund) {
        item.setColorOption(true);
      } else {
        item.setColorOption(false);
      }
    }
  );

  const itemMoveUp = menuApi.createItem('MoveUp', () => {
    const selected = ShapesInteraction.shapesSelected[0];
    ShapesInteraction.canvas.updateShapesOrder(selected, true);
  });

  const itemMoveDown = menuApi.createItem('MoveDown', () => {
    const selected = ShapesInteraction.shapesSelected[0];
    ShapesInteraction.canvas.updateShapesOrder(selected, false);
  });

  menu.addItems(itemMoveUp, itemMoveDown);

  return menu;
}
