import { Line, Rectangle, Triangle, Circle, Point2D } from './Shapes.js';
import MenuApi from './menuApi.js';
import {
  checkLineIntersection,
  checkPointInCircle,
  checkPointInRectangle,
  checkPointInTriangle,
  checkShapeColorsConsistency,
} from '../helper/shapesInteractionUtils.js';
import { ColorPicker, ColorPaletteGroup } from './ColorPalette.js';
import { EPLT_TYPES } from '../../types/color.js';
import { IShapeFactory, ISelectorManager } from '../../types/shape.js';
import { EClient } from '../../types/services.js';
export class Selector implements IShapeFactory {
  public readonly label = 'Select';
  private readonly slm: ISelectorManager;
  private readonly menu: MenuApi;
  private shapeListId: string[] = [];
  private shapesSelected: string[] = [];
  private shapeListIndexer: number = 0;
  private isMoving = false;
  private lastSelectedShapeId: string;
  private selectedShape: Line | Rectangle | Triangle | Circle;
  constructor(slm: ISelectorManager) {
    this.slm = slm;
    this.menu = this.createMenu(new MenuApi());
  }

  /* ------------ CREATE - MENU ------------ */
  createMenu = (menuApi: MenuApi): MenuApi => {
    const menu = menuApi.createMenu();
    const deleteShapesItem = menuApi.createItem('Entfernen', (m: MenuApi) => {
      m.hide();
      this.shapesSelected.forEach((id: string) => {
        this.slm.removeShapeWithId(false, id, true);
      });
    });
    menu.addItems(deleteShapesItem);
    menuApi.createRadioOption(
      /* DEFINE COLOR PALETTES */
      [EPLT_TYPES.Hintergrund, EPLT_TYPES.Outline],
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
          type: EPLT_TYPES.Outline,
          key: 'black',
        },
        Hintergrund: {
          type: EPLT_TYPES.Hintergrund,
          key: 'transparent',
        },
      },
      /* SET SPECIAL COLORS */
      {
        transparent: {
          type: EPLT_TYPES.Hintergrund,
          name: 'transparent',
          value: { red: 0, green: 0, blue: 0, alpha: 0 },
        },
      },
      /* SET SHAPE CONSTRAINTS */
      {
        line: {
          type: EPLT_TYPES.Hintergrund,
          shapeType: 'line',
        },
      },

      (colorPicker: ColorPicker) => {
        const shapes = this.slm.getShapes();
        this.shapesSelected.forEach((id: string) => {
          const shape = shapes[id];
          if (colorPicker.paletteInstance.type === EPLT_TYPES.Hintergrund) {
            shape.backgroundColor = colorPicker.colorFormatAsRGBA();
            shape.backgroundColorKey = colorPicker.key;
            this.slm.updateShapeColor(shape);
          } else {
            shape.strokeColor = colorPicker.colorFormatAsRGBA();
            shape.strokeColorKey = colorPicker.key;
            this.slm.updateShapeColor(shape);
          }
          this.slm.draw();
        });
      }
    );

    const shapeMoveForwardItem = menuApi.createItem('Shape nach vorne', () => {
      if (this.shapesSelected[0]) {
        this.slm.updateOrder(this.shapesSelected[0], false, false);
        this.slm
          .getShapeById(this.shapesSelected[0])
          .draw(
            this.slm.getCtx(),
            true,
            localStorage.getItem(EClient.RAND_COLOR)
          );
      }
    });

    const shapeMoveBackwardItem = menuApi.createItem(
      'Shape nach hinten',
      () => {
        if (this.shapesSelected[0]) {
          this.slm.updateOrder(this.shapesSelected[0], true, false);
          this.slm
            .getShapeById(this.shapesSelected[0])
            .draw(
              this.slm.getCtx(),
              true,
              localStorage.getItem(EClient.RAND_COLOR)
            );
        }
      }
    );

    const separator = menuApi.createSeparator();

    menu.addItems(shapeMoveForwardItem, separator, shapeMoveBackwardItem);

    return menu;
  };
  /* -------------------------------------- */

  /* ------------ HANDLER - SECTION ------------ */

  handleMouseDown(x: number, y: number) {
    this.checkShapeCollision(x, y, false);
    const clientId = localStorage.getItem(EClient.CLIENT_ID);
    const selectedShapeId = this.shapesSelected[0];

    if (selectedShapeId) {
      this.selectedShape = this.slm.getShapeById(selectedShapeId) as
        | Line
        | Rectangle
        | Triangle
        | Circle;

      // Update the condition for isBlockedByCurrentUser
      const isBlockedByCurrentUser =
        this.selectedShape.isBlockedByUserId === clientId ||
        this.selectedShape.isBlockedByUserId == null;
      if (isBlockedByCurrentUser) {
        if (
          this.lastSelectedShapeId &&
          this.lastSelectedShapeId !== selectedShapeId
        ) {
          const lastSelectedShape = this.slm.getShapeById(
            this.lastSelectedShapeId
          );
          if (lastSelectedShape) {
            this.slm.unselectShape(this.lastSelectedShapeId);
            this.slm.updateShape(
              this.lastSelectedShapeId,
              'isBlockedByUserId',
              null
            );
          }
        }
        this.isMoving = true;
        this.lastSelectedShapeId = selectedShapeId;
        this.slm.selectShape(selectedShapeId);
        this.slm.updateShape(selectedShapeId, 'isBlockedByUserId', clientId);
      }
    } else {
      this.lastSelectedShapeId = null;
      this.shapesSelected = [];
    }
  }

  handleMouseMove(x: number, y: number) {
    if (this.isMoving && this.selectedShape) {
      const type = this.slm.getShapeById(this.shapesSelected[0]).type;
      let shape: Line | Rectangle | Triangle | Circle,
        newShape: Line | Rectangle | Triangle | Circle;
      switch (type) {
        case 'line':
          shape = this.slm.getShapeById(this.shapesSelected[0]) as Line;
          newShape = new Line(
            new Point2D(x, y),
            new Point2D(
              x + Math.abs(shape.to.x - shape.from.x),
              y - Math.abs(shape.to.y - shape.from.y)
            )
          );
          break;
        case 'rectangle':
          shape = this.slm.getShapeById(this.shapesSelected[0]) as Rectangle;
          newShape = new Rectangle(
            new Point2D(x, y),
            new Point2D(
              x + Math.abs(shape.to.x - shape.from.x),
              y + Math.abs(shape.to.y - shape.from.y)
            )
          );
          break;

        case 'circle':
          shape = this.slm.getShapeById(this.shapesSelected[0]) as Circle;
          newShape = new Circle(new Point2D(x, y), shape.radius);
          break;

        case 'triangle':
          shape = this.slm.getShapeById(this.shapesSelected[0]) as Triangle;
          const deltaX = x - shape.p1.x;
          const deltaY = y - shape.p1.y;

          newShape = new Triangle(
            new Point2D(x, y),
            new Point2D(shape.p2.x + deltaX, shape.p2.y + deltaY),
            new Point2D(shape.p3.x + deltaX, shape.p3.y + deltaY)
          );

          break;
        default:
          break;
      }
      newShape.backgroundColor = shape.backgroundColor;
      newShape.strokeColor = shape.strokeColor;
      newShape.id = shape.id;
      this.selectedShape = newShape;
      this.slm.addShape(true, this.selectedShape);
      this.selectedShape.draw(
        this.slm.getCtx(),
        true,
        localStorage.getItem('randColor')
      );
    }
  }

  handleAlt(x: number, y: number) {
    if (this.shapeListId.length) {
      this.iterateShapesLevels();
    }
  }

  handleCtrl(x: number, y: number) {
    this.checkShapeCollision(x, y, true);
    const clientId = localStorage.getItem(EClient.CLIENT_ID);
    this.shapesSelected.forEach((shapeId) => {
      this.selectedShape = this.slm.getShapeById(shapeId) as
        | Line
        | Rectangle
        | Triangle
        | Circle;

      if (this.selectedShape.isBlockedByUserId == null) {
        this.lastSelectedShapeId = shapeId;
        this.slm.selectShape(shapeId);
        this.slm.updateShape(shapeId, 'isBlockedByUserId', clientId);
      }
    });
  }

  handleRightClick(x: number, y: number) {
    this.menu.show(x, y);
  }

  handleMouseUp() {
    if (this.isMoving && this.selectedShape) {
      this.isMoving = false;
      this.slm.addShape(false, this.selectedShape, false);
      this.slm.selectShape(this.selectedShape.id);
      this.slm.updateShape(
        this.selectedShape.id,
        'isBlockedByUserId',
        localStorage.getItem(EClient.CLIENT_ID)
      );
    }
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
      try {
        this.shapesSelected.forEach((id: string) => {
          const userId = this.slm.getShapeById(id).isBlockedByUserId;
          if (userId === localStorage.getItem(EClient.CLIENT_ID)) {
            this.slm.unselectShape(id);
            this.slm.updateShape(id, 'isBlockedByUserId', null);
          }
        });
      } catch {
        console.log('ERROR ON SELECTION');
      }
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
    if (this.shapeListId.length > 0) {
      const firstId = this.shapeListId[this.shapeListId.length - 1]; // firstId => Shape in front
      this.shapeListIndexer = this.shapeListId.length - 2;

      /* If single selection */
      if (!isCtrl) {
        // Iterate over each shapes object
        this.slm.draw();
        for (const key in shapes) {
          if (shapes.hasOwnProperty(key)) {
            const id = shapes[key].id;
            // Check if the current shape id matches the firstId
            if (id === firstId) {
              // Add the id to the shapesSelected array
              this.shapesSelected.push(id);
              // Draw the shape with ctx and true flag
              shapes[key].draw(ctx, true, shapes[key].markedColor);
              // Set color pickers
              ColorPaletteGroup.group[EPLT_TYPES.Hintergrund].setColorPicker(
                shapes[key].type,
                true,
                shapes[key].backgroundColorKey
              );
              ColorPaletteGroup.group[EPLT_TYPES.Outline].setColorPicker(
                shapes[key].type,
                true,
                shapes[key].strokeColorKey
              );
            }
          }
        }
      } else {
        // If multi-selection
        // Add the id to the shapesSelected array
        this.shapesSelected.push(firstId);
        shapes[firstId].draw(ctx, true);
        // Check colors of first shape
        const bgKey = shapes[this.shapeListId[0]].backgroundColorKey;
        const strKey = shapes[this.shapeListId[0]].strokeColorKey;
        // Check if shape colors are consistent
        const consistent = checkShapeColorsConsistency(
          shapes,
          this.shapeListId,
          bgKey,
          strKey
        );
        // check on selected background colors
        if (!consistent[0]) {
          ColorPaletteGroup.group[EPLT_TYPES.Hintergrund].setColorPicker(
            shapes[firstId].type,
            true,
            bgKey
          );
        } else {
          ColorPaletteGroup.group[EPLT_TYPES.Hintergrund].setColorPicker(
            shapes[firstId].type,
            false
          );
        }
        // check on selected outline colors
        if (!consistent[1]) {
          ColorPaletteGroup.group[EPLT_TYPES.Outline].setColorPicker(
            shapes[firstId].type,
            true,
            strKey
          );
        } else {
          ColorPaletteGroup.group[EPLT_TYPES.Outline].setColorPicker(
            shapes[firstId].type,
            false
          );
        }
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
    this.slm.draw();

    // if indexer is smaller zero, take the last index
    if (this.shapeListIndexer < 0) {
      this.shapeListIndexer = this.shapeListId.length - 1;
    }

    if (this.lastSelectedShapeId) {
      this.slm.unselectShape(this.lastSelectedShapeId);
      this.slm.updateShape(this.lastSelectedShapeId, 'isBlockedByUserId', null);
    }

    const idCurrent = this.shapeListId[this.shapeListIndexer];
    // Maybe this can be done even more efficiently
    // Questionable on large amount of objects
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const id = shapes[key].id;
        // Check if the current shape id matches the iteration level
        // Dont select if selected by other client
        if (id === idCurrent && shapes[key].isBlockedByUserId == null) {
          // Draw the shape with ctx and true flag
          this.lastSelectedShapeId = id;
          this.slm.selectShape(idCurrent);
          this.slm.updateShape(
            idCurrent,
            'isBlockedByUserId',
            localStorage.getItem(EClient.CLIENT_ID)
          );
        }
      }
    }
    this.slm.draw();
    this.shapesSelected = [];
    this.shapesSelected.push(idCurrent);
    this.shapeListIndexer--;
  };

  /* -------------------------------------- */
}
