import {
  Circle,
  Line,
  Rectangle,
  Triangle,
} from '../canvas/components/Shapes.js';

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

export interface ShapeManager {
  addShape(isTemp: boolean, shape: Shape, redraw?: boolean): void;
  removeShapeWithId(isTemp: boolean, id: string, redraw?: boolean): void;
}

export interface SelectorManager {
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
  updateShape(
    shapeId: string,
    prop: string,
    value: string | number | boolean | null
  ): void;
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
  SELECT_SHAPE,
  UNSELECT_SHAPE,
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
    isBlockedByUserId?: string | null;
    markedColor?: string;
  };
}

export interface IStream {
  type: number;
  clientId: string;
  canvasId: string;
  events: IResponseEvent;
}

export interface IEventStream {
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
}

export interface IResponse {
  type: string | CanvasEventType;
  clientId: string;
  canvasId: string;
  markedColor: string;
  eventStream: IStream[];
}

export enum Services {
  REGISTRATION = 'registration',
  UNREGISTER = 'unregister',
  HOST_DISCONNECT = 'host_disconnect',
}

export interface IResponseEvent {
  type: CanvasEventType;
  eventStream?: {
    id?: string;
    shape?: Line | Rectangle | Circle | Triangle;
    redraw?: boolean;
    moveUp?: boolean;
    isTemp?: boolean;
    colorType?: string;
    newColor?: string;
    method?: Function;
    tool?: ShapeFactory;
    x?: number;
    y?: number;
    isBlockedByUserId?: string | null;
    markedColor?: string;
  };
}
