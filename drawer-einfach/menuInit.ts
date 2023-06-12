import { Selector } from './Selector.js';
import { Types, ItemColor } from './item.js';
import MenuApi from './menuApi.js';

export function setupContextMenu(menuApi: MenuApi): MenuApi {
  /* Setup new Menu */
  const menu = menuApi.createMenu();
  /* Add Entfernen-Button */
  const mItem1 = menuApi.createItem('Entfernen', (m: MenuApi) => {
    m.hide();
    const id = Selector.shapeListId[0];
    const shapes = Selector.canvas.getShapes();
    Selector.canvas.removeShape(shapes[id]);
  });
  menu.addItems(mItem1);
  /* Create radio options for color-selection */
  /* Eigene Klasse? */
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
    'red',
    (item: ItemColor) => {
      const shapes = Selector.canvas.getShapes();
      const shape = shapes[Selector.shapeListId[0]];
      if (shape) {
        const ctx = Selector.canvas.getCanvasRenderingContext();
        if (item.inputElement.name === Types.Hintergrund) {
          shape.backgroundColor = item.key;
          item.setColorOption(true);
        } else {
          shape.strokeColor = item.key;
          item.setColorOption(false);
        }
        shape.draw(ctx, true);
      } else {
        item.setColorOption(item.inputElement.name === Types.Hintergrund);
      }
    }
  );
  return menu;
}
