import {
  Circle,
  Line,
  Rectangle,
  Triangle,
} from '../canvas/components/Shapes.js';
import { Shape, IShapeFactory } from './shape.js';

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
  tool?: IShapeFactory;
  x?: number;
  y?: number;
}
export interface IResponseEvent {
  type: ECanvasEventType;
  eventStream?: {
    id?: string;
    shape?: Line | Rectangle | Circle | Triangle;
    redraw?: boolean;
    moveUp?: boolean;
    isTemp?: boolean;
    colorType?: string;
    newColor?: string;
    method?: Function;
    tool?: IShapeFactory;
    x?: number;
    y?: number;
    isBlockedByUserId?: string | null;
    markedColor?: string;
  };
}
export interface IResponse {
  type: string | ECanvasEventType;
  clientId: string;
  canvasId: string;
  markedColor: string;
  eventStream: IStream[];
}

export enum ECanvasEventType {
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

export interface ICanvasEvent {
  type: ECanvasEventType;
  data?: {
    id?: string;
    shape?: Shape;
    redraw?: boolean;
    moveUp?: boolean;
    isTemp?: boolean;
    colorType?: string;
    newColor?: string;
    method?: Function;
    tool?: IShapeFactory;
    x?: number;
    y?: number;
    isBlockedByUserId?: string | null;
    markedColor?: string;
  };
}
