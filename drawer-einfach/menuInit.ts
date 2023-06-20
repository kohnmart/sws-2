import { Color, Types } from './ColorPalette.js';
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
    [Types.Outline, Types.Hintergrund],
    {
      red: 'rot',
      green: 'grün',
      yellow: 'gelb',
      blue: 'blau',
      black: 'schwarz',
    },
    'red',
    (item: Color) => {
      const shapes = ShapesInteraction.canvasRef.getShapes();
      ShapesInteraction.shapesSelected.forEach((id: number) => {
        const shape = shapes[id];
        const ctx = ShapesInteraction.canvasRef.getCanvasRenderingContext();
        if (item.radioButton.inputElement.name === Types.Hintergrund) {
          shape.backgroundColor = item.key;
        } else {
          shape.strokeColor = item.key;
        }
        shape.draw(ctx, true);
      });

      if (item.radioButton.inputElement.name === Types.Hintergrund) {
        item.setColorOption(true);
      } else {
        item.setColorOption(false);
      }
    }
  );

  const itemMoveUp = menuApi.createItem('MoveUp', () => {
    const selected = ShapesInteraction.shapesSelected[0];
    ShapesInteraction.canvasRef.updateShapesOrder(selected, true);
  });

  const itemMoveDown = menuApi.createItem('MoveDown', () => {
    const selected = ShapesInteraction.shapesSelected[0];
    ShapesInteraction.canvasRef.updateShapesOrder(selected, false);
  });

  menu.addItems(itemMoveUp, itemMoveDown);

  return menu;
}
