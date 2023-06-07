export interface Shape {
  readonly id: number;
  readonly type: string;
  draw(ctx: CanvasRenderingContext2D, isSeleted: boolean);
}

export interface ShapeManager {
  addShape(shape: Shape, redraw?: boolean): this;
  removeShape(shape: Shape, redraw?: boolean): this;
  removeShapeWithId(id: number, redraw?: boolean): this;
}

export interface ShapeFactory {
  label: string;
  handleMouseDown(x: number, y: number);
  handleMouseUp(x: number, y: number);
  handleMouseMove(x: number, y: number);
}
