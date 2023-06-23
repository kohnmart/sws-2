import { Canvas } from './Canvas';

export interface Shape {
  readonly id: number;
  readonly type: string;
  backgroundColor: string;
  strokeColor: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
}

export interface ShapeManager {
  addShape(shape: Shape, redraw?: boolean): this;
  removeShape(shape: Shape, redraw?: boolean): this;
  removeShapeWithId(id: number, redraw?: boolean): this;
}

export interface SelectorManager {
  getShapes(): { [p: number]: Shape };
  getCtx(): CanvasRenderingContext2D;
  draw(): void;
  updateOrder(n: number, dir: boolean): void;
  removeShapeWithId(id: number, redraw?: boolean): void;
}

export interface ShapeFactory {
  label: string;
  handleMouseDown(x: number, y: number): void;
  handleMouseUp(x: number, y: number): void;
  handleMouseMove(x: number, y: number): void;
}
