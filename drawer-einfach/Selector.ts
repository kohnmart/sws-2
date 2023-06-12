import { Canvas } from './Canvas.js';
import { Circle, Triangle, Rectangle, Line } from './Shapes';
import { ShapeFactory } from './types.js';
import MenuApi from './menuApi.js';
import { ItemColor, Types } from './item.js';
export class Selector implements ShapeFactory {
  public label = 'Select';
  public static isSelectionMode = false;
  public static canvas: Canvas = undefined;
  private static shapeIdList: number[] = [];
  private static indexer = 0;

  private static setupContextMenu = (menuApi: MenuApi) => {
    /* Setup new Menu */
    const menu = menuApi.createMenu();
    /* Add Entfernen-Button */
    const mItem1 = menuApi.createItem('Entfernen', (m: MenuApi) => {
      m.hide();
      const id = Selector.shapeIdList[0];
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
        console.log('IDES');
        Selector.shapeIdList.forEach((id) => {
          console.log(id);
          const shape = shapes[Selector.shapeIdList[id]];
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
        });
      }
    );
    return menu;
  };

  private static menu = this.setupContextMenu(new MenuApi());

  public handleMouseDown(x: number, y: number) {
    Selector.iterateShapes(x, y, false);
  }

  public handleAlt() {
    if (Selector.shapeIdList.length) {
      Selector.handleShapesList();
    }
  }

  public handleCtrl(x: number, y: number) {
    Selector.iterateShapes(x, y, true);
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

  /* Scanning shapes */
  public static iterateShapes(x: number, y: number, isCtrl: boolean) {
    const ctx = Selector.canvas.getCanvasRenderingContext();
    const shapes = Selector.canvas.getShapes();

    if (!isCtrl) {
      Selector.canvas.draw();
      Selector.shapeIdList = [];
    }

    /* Iterate over shapes */
    for (const key in shapes) {
      if (shapes.hasOwnProperty(key)) {
        const shape = shapes[key];
        const type = shape.type;

        /* Check the type */
        if (type == 'line') {
          const line = shape as Line;
          const { x: start_x, y: start_y } = line.from;
          const { x: end_x, y: end_y } = line.to;

          // Calculate the cross product between vectors (start to point) and (start to end)
          const crossProduct =
            (x - start_x) * (end_y - start_y) -
            (y - start_y) * (end_x - start_x);

          // Check if the point is collinear with the line segment
          if (Math.abs(crossProduct) < 1500) {
            if (
              Math.min(start_x, end_x) <= x &&
              x <= Math.max(start_x, end_x) &&
              Math.min(start_y, end_y) <= y &&
              y <= Math.max(start_y, end_y)
            ) {
              Selector.shapeIdList.push(line.id);
            }
          }
        } else if (type == 'rectangle') {
          const rectangle = shape as Rectangle;
          const { x: start_x, y: start_y } = rectangle.from;
          const { x: end_x, y: end_y } = rectangle.to;

          // Calculate the distances from the point to each side of the rectangle
          const distanceToLeft = Math.abs(x - start_x);
          const distanceToRight = Math.abs(x - end_x);
          const distanceToTop = Math.abs(y - start_y);
          const distanceToBottom = Math.abs(y - end_y);

          // Check if the point is within the rectangle's boundaries
          if (
            distanceToLeft <= Math.abs(end_x - start_x) &&
            distanceToRight <= Math.abs(end_x - start_x) &&
            distanceToTop <= end_y - start_y &&
            distanceToBottom <= end_y - start_y
          ) {
            Selector.shapeIdList.push(rectangle.id);
          }
        } else if (type == 'triangle') {
          const triangle = shape as Triangle;
          const { p1, p2, p3 } = triangle;

          // Calculate barycentric coordinates of the point with respect to the triangle
          const alpha =
            ((p2.y - p3.y) * (x - p3.x) + (p3.x - p2.x) * (y - p3.y)) /
            ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
          const beta =
            ((p3.y - p1.y) * (x - p3.x) + (p1.x - p3.x) * (y - p3.y)) /
            ((p2.y - p3.y) * (p1.x - p3.x) + (p3.x - p2.x) * (p1.y - p3.y));
          const gamma = 1 - alpha - beta;

          if (alpha >= 0 && beta >= 0 && gamma >= 0) {
            Selector.shapeIdList.push(triangle.id);
          }
        } else {
          const circle = shape as Circle;
          const { radius, center } = circle;
          // Calculate the distance between the point and the center of the circle
          const distance = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);

          if (distance <= radius) {
            Selector.shapeIdList.push(circle.id);
          }
        }
      }
    }
    if (Selector.shapeIdList.length && !isCtrl) {
      const id = Selector.shapeIdList[0];
      shapes[id].draw(ctx, true);
    } else if (Selector.shapeIdList.length && isCtrl) {
      Selector.shapeIdList.forEach((id) => {
        shapes[id].draw(ctx, true);
      });
    }
  }
  private static handleShapesList() {
    const ctx = Selector.canvas.getCanvasRenderingContext();
    const shapes = Selector.canvas.getShapes();
    Selector.canvas.draw();
    if (Selector.indexer < Selector.shapeIdList.length - 1) {
      Selector.indexer++;
    }

    const idCurrent = Selector.shapeIdList[Selector.indexer];
    shapes[idCurrent].draw(ctx, true);

    if (Selector.indexer == Selector.shapeIdList.length - 1) {
      Selector.indexer = -1;
    }
  }
}
