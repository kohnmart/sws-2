export interface IResponse {
  status: number;
  content?: ICanvasData[];
  list?: ICanvasList;
}

export interface ICanvasData {
  name?: string;
  canvasId?: string;
  hostId?: string;
  msg?: string;
}

export interface ICanvasList {
  canvasList: [
    {
      name?: string;
      canvasId?: string;
      hostId?: string;
    }
  ];
}

export enum ERequest {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  UPDATE = 'UPDATE',
}
