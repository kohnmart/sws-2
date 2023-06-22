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
    /* DEFINE COLOR PALETTES */
    [Types.Outline, Types.Hintergrund],
    /* DEFINE BASE COLORS */
    {
      red: { name: 'rot', value: { red: 255, green: 0, blue: 0, alpha: 1 } },
      green: { name: 'grün', value: { red: 0, green: 255, blue: 0, alpha: 1 } },
      yellow: {
        name: 'gelb',
        value: { red: 255, green: 255, blue: 0, alpha: 1 },
      },
      blue: { name: 'blau', value: { red: 0, green: 0, blue: 255, alpha: 1 } },
      black: {
        name: 'schwarz',
        value: { red: 0, green: 0, blue: 0, alpha: 1 },
      },
    },
    /* SET DEFAULT COLOR */
    {
      Outline: {
        type: Types.Outline,
        key: 'black',
      },
      Hintergrund: {
        type: Types.Hintergrund,
        key: 'transparent',
      },
    },

    (colorItem: Color) => {
      const shapes = ShapesInteraction.canvasRef.getShapes();
      ShapesInteraction.shapesSelected.forEach((id: number) => {
        const shape = shapes[id];
        const ctx = ShapesInteraction.canvasRef.getCanvasRenderingContext();
        console.log(colorItem.paletteInstance.type + ' test');
        if (colorItem.paletteInstance.type === Types.Hintergrund) {
          shape.backgroundColor = colorItem.colorAsRGBA();
        } else {
          shape.strokeColor = colorItem.colorAsRGBA();
        }
        shape.draw(ctx, true);
      });

      colorItem.paletteInstance.setDefaultColor(colorItem.key);
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
