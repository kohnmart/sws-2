export enum EServices {
  REGISTRATION = 'registration',
  UNREGISTER = 'unregister',
  HOST_DISCONNECT = 'host_disconnect',
}

export enum EClient {
  CLIENT_ID = 'clientId',
  HOST_ID = 'hostId',
  RAND_COLOR = 'randColor',
}

export enum EWebsocketEvents {
  REGISTER_FOR_CANVAS = 'registerForCanvas',
  UNREGISTER_FOR_CANVAS = 'unregisterForCanvas',
  SELECT_SHAPE = 'selectShape',
  UNSELECT_SHAPE = 'unselectShape',
  HOST_DISCONNECT = 'host_disconnect',
}
