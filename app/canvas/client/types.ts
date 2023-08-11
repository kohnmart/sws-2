export interface Shape {
  readonly type: string;
  id: string;
  backgroundColor: string;
  backgroundColorKey: string;
  strokeColor: string;
  strokeColorKey: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
}

export interface ShapeManager {
  addShape(isTemp: boolean, shape: Shape, redraw?: boolean): void;
  removeShape(shape: Shape, redraw?: boolean): void;
  removeShapeWithId(isTemp: boolean, id: string, redraw?: boolean): void;
}

export interface SelectorManager {
  getShapes(): { [p: number]: Shape };
  getCtx(): CanvasRenderingContext2D;
  draw(): void;
  updateOrder(n: string, dir: boolean): void;
  removeShapeWithId(isTemp: boolean, id: string, redraw?: boolean): void;
  getShapeById(id: string): Shape;
  updateShape(shape: Shape, isTemp: boolean): void;
  updateShapeColor(shapeId: string, colorType: string, newColor: string): void;
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
  data?: {
    id?: string;
    shape?: Shape;
    redraw?: boolean;
    moveUp?: boolean;
    isTemp?: boolean;
    colorType?: string;
    newColor?: string;
    method?: Function;
    tool?: ShapeFactory;
    x?: number;
    y?: number;
  };
}

export interface IStream {
  type: number;
  clientId: string;
  canvasId: string;
  eventStream: IEventStream[];
}

interface IEventStream {
  id: string;
  shape?: Shape;
  redraw?: boolean;
  moveUp?: boolean;
  isTemp?: boolean;
  colorType?: string;
  newColor?: string;
  method?: Function;
  tool?: ShapeFactory;
  x?: number;
  y?: number;
}

export interface IResponse {
  type: string | CanvasEventType;
  clientId: string;
  canvasId: string;
  eventStream: IStream[];
}

export enum Services {
  REGISTRATION = 'registration',
  UNREGISTER = 'unregister',
}
