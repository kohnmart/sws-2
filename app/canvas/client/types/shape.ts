export interface Shape {
  readonly type: string;
  id: string;
  backgroundColor: string;
  backgroundColorKey: string;
  strokeColor: string;
  strokeColorKey: string;
  isBlockedByUserId: string | null;
  markedColor: string;
  draw(
    ctx: CanvasRenderingContext2D,
    isSelected: boolean,
    markedColor: string
  ): void;
}

export interface IShapeManager {
  addShape(isTemp: boolean, shape: Shape, redraw?: boolean): void;
  removeShapeWithId(isTemp: boolean, id: string, redraw?: boolean): void;
}

export interface ISelectorManager {
  addShape(isTemp: boolean, shape: Shape, redraw?: boolean): void;
  getShapes(): { [p: number]: Shape };
  getCtx(): CanvasRenderingContext2D;
  draw(): void;
  updateOrder(n: string, dir: boolean, isReceiving: boolean): void;
  removeShapeWithId(isTemp: boolean, id: string, redraw?: boolean): void;
  getShapeById(id: string): Shape;
  getShapeKeyById(id: string): string;
  updateShapeColor(shape: Shape): void;
  selectShape(shapeId: string): void;
  unselectShape(shapeId: string): void;
  setShapes(shapes: {}): void;
  updateShape(
    shapeId: string,
    prop: string,
    value: string | number | boolean | null
  ): void;
}

export interface IShapeFactory {
  label: string;
  handleMouseDown(x: number, y: number): void;
  handleMouseUp(x: number, y: number): void;
  handleMouseMove(x: number, y: number): void;
}
