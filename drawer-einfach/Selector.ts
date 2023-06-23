import { SelectorManager, ShapeFactory, PLT_TYPES } from './types.js';
import { Line, Rectangle, Triangle, Circle } from './Shapes.js';
import MenuApi from './menuApi.js';
import {
  checkLineIntersection,
  checkPointInCircle,
  checkPointInRectangle,
  checkPointInTriangle,
} from './ShapesInteraction.js';
import { Color } from './ColorPalette.js';
export class Selector implements ShapeFactory {
  public label = 'Select';
  private shapeListId: number[] = [];
  private shapesSelected: number[] = [];
  private shapeListIndexer: number = 0;
  private slm: SelectorManager;
  private menu: MenuApi;
  constructor(slm: SelectorManager) {
    this.slm = slm;
    this.menu = this.createMenu(new MenuApi());
  }

  /* ------------ CREATE - MENU ------------ */
  createMenu = (menuApi: MenuApi): MenuApi => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('Entfernen', (m: MenuApi) => {
      m.hide();
      this.shapesSelected.forEach((id: number) => {
        this.slm.removeShapeWithId(id, true);
      });
    });
    menu.addItems(mItem1);
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
      },
      (colorItem: Color) => {
        const shapes = this.slm.getShapes();
        this.shapesSelected.forEach((id: number) => {
          const shape = shapes[id];
          const ctx = this.slm.getCtx();
          if (colorItem.paletteInstance.type === PLT_TYPES.Hintergrund) {
            shape.backgroundColor = colorItem.colorFormatAsRGBA();
          } else {
            shape.strokeColor = colorItem.colorFormatAsRGBA();
          }
          shape.draw(ctx, true);
        });

        colorItem.paletteInstance.setDefaultColor(colorItem.key);
      }
    );

    const itemMoveUp = menuApi.createItem('MoveUp', () => {
      const selected = this.shapesSelected[0];
      this.slm.updateOrder(selected, false);
    });

    const itemMoveDown = menuApi.createItem('MoveDown', () => {
      const selected = this.shapesSelected[0];
      this.slm.updateOrder(selected, true);
    });

    menu.addItems(itemMoveUp, menuApi.createSeparator(), itemMoveDown);

    return menu;
  };
  /* -------------------------------------- */

  /* ------------ HANDLER - SECTION ------------ */

  public handleMouseDown(x: number, y: number) {
    this.checkShapeCollision(x, y, false);
  }

  public handleAlt(x: number, y: number) {
    if (this.shapeListId.length) {
      this.iterateShapesLevels();
    }
  }

  public handleCtrl(x: number, y: number) {
    this.checkShapeCollision(x, y, true);
  }

  public handleRightClick(x: number, y: number) {
    this.menu.show(x, y);
  }

  public handleMouseUp() {
    return;
  }

  public handleMouseMove() {
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
  checkShapeCollision(x: number, y: number, isCtrl: boolean) {
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
            const line = shape as Line;
            const { from, to } = line;

            if (checkLineIntersection(x, y, from, to)) {
              this.shapeListId.push(line.id);
            }
            break;

          case 'rectangle':
            const rectangle = shape as Rectangle;
            const { from: rectFrom, to: rectTo } = rectangle;

            if (checkPointInRectangle(x, y, rectFrom, rectTo)) {
              this.shapeListId.push(rectangle.id);
            }
            break;

          case 'triangle':
            const triangle = shape as Triangle;
            const { p1, p2, p3 } = triangle;

            if (checkPointInTriangle(x, y, p1, p2, p3)) {
              this.shapeListId.push(triangle.id);
            }
            break;

          case 'circle':
            const circle = shape as Circle;
            const { center, radius } = circle;

            if (checkPointInCircle(x, y, center, radius)) {
              this.shapeListId.push(circle.id);
            }
            break;
        }
      }
    }

    /* check if shapes have been detected */
    if (this.shapeListId.length) {
      const firstId = this.shapeListId[this.shapeListId.length - 1];

      if (!isCtrl) {
        // Iterate over each shapes object
        for (const key in shapes) {
          if (shapes.hasOwnProperty(key)) {
            const id = shapes[key].id;

            // Check if the current shape id matches the firstId
            if (id === firstId) {
              // Add the id to the shapesSelected array
              this.shapesSelected.push(id);
              // Draw the shape with ctx and true flag
              shapes[key].draw(ctx, true);
            } else {
              // Draw the shape with ctx and false flag
              shapes[key].draw(ctx, false);
            }
          }
        }
      } else {
        // Iterate over each id in shapeListId array
        this.shapeListId.forEach((id) => {
          // Add the id to the shapesSelected array
          this.shapesSelected.push(id);
          shapes[id].draw(ctx, true);
        });
      }
    }
  }

  /**
   * This method is used to iterate through the shapes in a cyclic manner,
   * selecting and highlighting each shape one by one on the canvas.
   * It provides a way to cycle through the shapes and perform actions on the selected shape.
   */
  iterateShapesLevels = () => {
    const shapes = this.slm.getShapes();
    const ctx = this.slm.getCtx();
    this.slm.draw();
    if (this.shapeListIndexer < this.shapeListId.length - 1) {
      this.shapeListIndexer++;
    }

    const idCurrent = this.shapeListId[this.shapeListIndexer];
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const id = shapes[key].id;
        // Check if the current shape id matches the iteration level
        if (id === idCurrent) {
          // Draw the shape with ctx and true flag
          shapes[key].draw(ctx, true);
        } else {
          // Draw the shape with ctx and false flag
          shapes[key].draw(ctx, false);
        }
      }
    }
    this.shapesSelected = [];
    this.shapesSelected.push(idCurrent);

    if (this.shapeListIndexer == this.shapeListId.length - 1) {
      this.shapeListIndexer = -1;
    }
  };
  /* -------------------------------------- */
}
