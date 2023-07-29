import { EventStream } from './CanvasEvent';

export interface Shape {
  readonly id: number;
  readonly type: string;
  backgroundColor: string;
  backgroundColorKey: string;
  strokeColor: string;
  strokeColorKey: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
}

export interface ShapeManager {
  addShape(shape: Shape, redraw?: boolean): void;
  removeShape(shape: Shape, redraw?: boolean): void;
  removeShapeWithId(isTemp: boolean, id: number, redraw?: boolean): void;
}

export interface SelectorManager {
  getShapes(): { [p: number]: Shape };
  getCtx(): CanvasRenderingContext2D;
  draw(): void;
  updateOrder(n: number, dir: boolean): void;
  removeShapeWithId(isTemp: boolean, id: number, redraw?: boolean): void;
  getShapeById(id: number): Shape;
  updateShape(shape: Shape, isTemp: boolean): void;
  updateShapeColor(shapeId: number, colorType: string, newColor: string): void;
}

export interface ShapeFactory {
  label: string;
  handleMouseDown(x: number, y: number): void;
  handleMouseUp(x: number, y: number): void;
  handleMouseMove(x: number, y: number): void;
}

export type ColorValue = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export enum PLT_TYPES {
  Outline = 'Outline',
  Hintergrund = 'Hintergrund',
}

export enum CanvasEventType {
  DRAW,
  CLEAR,
  ADD_SHAPE,
  REMOVE_SHAPE,
  REMOVE_SHAPE_WITH_ID,
  UPDATE_SHAPE,
  UPDATE_SHAPES_ORDER,
  TOOL_ACTION,
  CHANGE_COLOR,
}

export interface CanvasEvent {
  type: CanvasEventType;
  data?: any;
}
